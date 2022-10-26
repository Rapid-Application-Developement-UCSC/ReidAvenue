import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
  } from "@chakra-ui/react";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { useEffect, useRef, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { apiInstance } from "../../api/instance";
  import { authStore } from "../../stores/auth-store";
  
  /**
   *
   * @param {{collection: string}} props
   * @returns
   */
  export default function Collection(props) {
    const { isOpen, onOpen, onClose } = useDisclosure();
  
    const token = authStore((state) => state.token);
    const navigate = useNavigate();
  
    const [collection, setCollection] = useState(null);
    const [availbleImages, setAvailableImages] = useState([]);
    const [title, setTitle] = useState("");
    const [marked, setMarked] = useState([]);
    const formRef = useRef(null);
    let m = [];
  
    const [isUpdating, setIsUpdating] = useState(false);
  
    async function updateCollection() {
      setIsUpdating(true);
      try {
        const response = await apiInstance.put(
          `/collections/${collection._id}`,
          {
            title,
            images: marked,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        loadCollection();
        onClose();
      } catch (error) {
        console.log(error);
      } finally {
        setIsUpdating(false);
      }
    }
  
    async function loadCollection() {
      try {
        const response = await apiInstance.get(
          `/collections/${props.collection}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCollection(response.data);
        setTitle(response.data.title);
        setAvailableImages(response.data.images);
      } catch (error) {
        console.log(error);
      }
    }
  
    async function deleteCollection() {
      try {
        const response = await apiInstance.delete(
          `/collections/${props.collection}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        navigate("/app/my-posts");
      } catch (error) {
        console.log(error);
      }
    }
  
    function markForDeletion(imageId) {
      const existing = marked.find((id) => id === imageId);
      m = Array.from(new Set([...m, ...marked]));
      if (!existing) {
        m.push(imageId);
        m = Array.from(new Set(m));
        setMarked([...marked, imageId]);
      }
    }
  
    function isMarkedForDeletion(imageId) {
      return marked.find((id) => id === imageId);
    }
  
    function cancelUpdating(imageId) {
      setMarked([]);
      setTitle(collection.title);
      m = [];
    }
  
    useEffect(() => {
      loadCollection();
    }, []);
  
    if (collection) {
      return (
        <div className="collection" key={collection._id} onClick={onOpen}>
          <div className="collection-card">
            <p>{collection.title}</p>
          </div>
          <Modal isOpen={isOpen} onClose={onClose} size="6xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                <div className="collection-header">
                  <p>Images in the collection</p>
                  <div className="delete-collection" onClick={deleteCollection}>
                    <FontAwesomeIcon icon="trash" />
                  </div>
                </div>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <p className="update-help">
                  Use "X" button over images to delete.Finally update by clicking
                  on update button below.Use the input to update the title.(Keep
                  in mind that clicing cancel will cancel out any changes made)
                </p>
                <form ref={formRef}>
                  <Input
                    value={title}
                    placeholder="Title of the collection"
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                  <div className="collection-images">
                    {collection.images
                      .filter((image) => image !== null)
                      .map((image) => (
                        <div className="collection-image" key={image.imageId}>
                          <div
                            className="collection-image-delete"
                            onClick={() => markForDeletion(image.imageId)}
                          >
                            <FontAwesomeIcon icon="xmark-circle" />
                          </div>
                          <a href={image.url} target="_blank">
                            <img
                              src={image.url}
                              alt=""
                              className={
                                isMarkedForDeletion(image.imageId) ? "marked" : ""
                              }
                            />
                          </a>
                        </div>
                      ))}
                  </div>
                </form>
              </ModalBody>
  
              <ModalFooter>
                <div className="collection-actions">
                  <Button
                    colorScheme="yellow"
                    isLoading={isUpdating}
                    onClick={updateCollection}
                  >
                    Update
                  </Button>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={() => {
                      cancelUpdating();
                      onClose();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      );
    } else {
      return <div>Loading...</div>;
    }
  }
  
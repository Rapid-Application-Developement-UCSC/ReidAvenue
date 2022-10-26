import Post from "../../components/utils/Post";
import { apiInstance } from "../../api/instance";
import { authStore } from "../../stores/auth-store";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import Collection from "../../components/utils/Collection";

export default function CollectionsPage() {
  const token = authStore((state) => state.token);

  const [collections, setCollections] = useState([]);

  const hiddenFileInput = useRef(null);

  const [title, setTitle] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [imageDataURLs, setImageDataURLs] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function createCollection(e) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("title", title);
    imageFiles.forEach((file) => {
      formData.append("images", file);
    });
    try {
      const response = await apiInstance.post("/collections", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      loadCollections();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function loadCollections() {
    setIsLoading(true);

    try {
      const response = await apiInstance.get("/collections", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCollections(response.data.collections);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  function onImageFileSelect(event) {
    let files = event.target.files;
    files = Array.from(files);
    setImageFiles(files);
    const urls = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      urls.push(url);
    }
    setImageDataURLs(urls);
  }

  function cancelImageSelect(index) {
    const newFiles = [...imageFiles];
    newFiles.splice(index, 1);
    setImageFiles(newFiles);

    const newUrls = [...imageDataURLs];
    newUrls.splice(index, 1);
    setImageDataURLs(newUrls);
  }

  const { isOpen, onOpen, onClose } = useDisclosure();

  const dummyCollections = [
    {
      _id: "1",
      title: "Collection 1",
      images: [
        {
          _id: "1",
          url: "https://picsum.photos/600/900",
        },
        {
          _id: "2",
          url: "https://picsum.photos/600/900",
        },
        {
          _id: "3",
          url: "https://picsum.photos/600/900",
        },
      ],
    },
    {
      _id: "2",
      title: "Collection 2",
      images: [
        {
          _id: "1",
          url: "https://picsum.photos/600/900",
        },
        {
          _id: "2",
          url: "https://picsum.photos/600/900",
        },
        {
          _id: "3",
          url: "https://picsum.photos/600/900",
        },
      ],
    },
  ];

  // load collections
  useEffect(() => {
    loadCollections();
  }, []);

  return (
    <div className="collections-page">
      <section className="collections">
        <div className="collection" onClick={onOpen}>
          <div className="collection-card">
            <FontAwesomeIcon icon="square-plus" />
          </div>
          <Modal isOpen={isOpen} onClose={onClose} size="6xl">
            <ModalOverlay />
            <ModalContent minWidth="600px">
              <ModalHeader>Add new collection</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <form
                  className="new-collection-form"
                  onSubmit={(e) => createCollection(e)}
                >
                  <Input
                    type="text"
                    placeholder="Title of the collection"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    id="hidden-file-input"
                    multiple
                    onChange={(e) => onImageFileSelect(e)}
                    ref={hiddenFileInput}
                  />
                  <div
                    className="image-upload"
                    onClick={() => {
                      hiddenFileInput.current.click();
                    }}
                  >
                    <p>Upload images</p>
                    <FontAwesomeIcon icon="camera" />
                  </div>
                  {imageDataURLs.length > 0 ? (
                    <div className="previews">
                      {imageDataURLs.map((url, index) => (
                        <div className="preview" key={url}>
                          <div
                            className="image-delete-icon"
                            onClick={() => cancelImageSelect(index)}
                          >
                            <FontAwesomeIcon icon="xmark-circle" />
                          </div>
                          <img src={url} alt="" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <></>
                  )}
                  <Button
                    colorScheme="green"
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    Create collection
                  </Button>
                </form>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
        {collections.map((collection) => (
          <Collection key={collection} collection={collection} />
        ))}
      </section>
    </div>
  );
}

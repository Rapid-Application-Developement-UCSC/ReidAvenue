import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Textarea } from "@chakra-ui/react";
import { apiInstance } from "../../api/instance";
import { authStore } from "../../stores/auth-store";

export default function NewPostPage() {
  const navigate = useNavigate();
  const token = authStore((state) => state.token);

  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [dataUrl, setDataUrl] = useState(null);

  async function submitData() {
    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", imageFile);
    try {
      const response = await apiInstance.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      if (response.status === 201) {
        // navigate("/app/my-posts");
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   *
   * @param {InputEvent} e
   */
  async function onImageSelect(e) {
    /**
     * @type {File | null}
     */
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setDataUrl(e.target.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
      console.log(file);
    }
  }

  return (
    <div className="new-post-page">
      <section className="form">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitData();
          }}
        >
          <h1>What's new?</h1>
          <Textarea
            placeholder="Caption..."
            colorScheme="green"
            value={caption}
            onChange={(e) => {
              setCaption(e.target.value);
            }}
          />
          <Input
            type="file"
            accept="image/*"
            onChange={onImageSelect}
            required
          />

          <img src={dataUrl} alt="preview image" />
          <Button colorScheme="green" type="submit">
            Post
          </Button>
        </form>
      </section>
    </div>
  );
}

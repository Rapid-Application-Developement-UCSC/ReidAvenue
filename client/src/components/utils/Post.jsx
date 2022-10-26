import { formatDistance } from "date-fns/esm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authStore } from "../../stores/auth-store";
import { apiInstance } from "../../api/instance";
import { useEffect, useState } from "react";

/**
 *
 * @param {{ _id :string}} props
 */
export default function Post(props) {
  console.log(props._id);

  const token = authStore((state) => state.token);
  const user = authStore((state) => state.user);

  const [post, setPost] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  async function loadPost() {
    const response = await apiInstance.get(`/posts/get-post/${props._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    setPost(response.data);
    if (response.data.likes.find((like) => like.user === user._id)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }

  async function like() {
    try {
      const response = await apiInstance.patch(
        `/posts/${post._id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      await loadPost();
    } catch (error) {
      console.log(error);
    }
  }

  async function unlike() {
    try {
      const response = await apiInstance.delete(`/posts/${post._id}/like`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      await loadPost();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadPost();
  }, []);

  return (
    <div className="post">
      <div className="post__header">
        <h3>
          {post && post.postedBy.firstName + " " + post.postedBy.lastName}
        </h3>
        <h4>
          {post &&
            formatDistance(new Date(post.createdAt), new Date(), {
              addSuffix: true,
            })}
        </h4>
      </div>
      <div className="post__caption">
        <p>{post && post.caption}</p>
      </div>
      <div className="post__image">
        <img src={post && post.image} alt="post" />
      </div>
      <div className="post__footer">
        <div
          className={`heart-react ${isLiked ? "liked" : ""}`}
          onClick={() => {
            if (isLiked) {
              unlike();
            } else {
              like();
            }
          }}
        >
          <FontAwesomeIcon icon="heart" />
        </div>
        <p>
          {post && post.likes.length === 0
            ? "No likes"
            : post && post.likes.length === 1
            ? "1 like"
            : `${post && post.likes.length} likes`}
        </p>
      </div>
    </div>
  );
}

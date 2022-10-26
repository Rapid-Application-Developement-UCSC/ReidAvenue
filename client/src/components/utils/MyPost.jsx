import { formatDistance } from "date-fns/esm";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authStore } from "../../stores/auth-store";
import { apiInstance } from "../../api/instance";

/**
 *
 * @param {{caption: string;image: string,  createdAt: string, likes: number}} props
 */
export default function Post(props) {
  const user = authStore((state) => state.user);
  const token = authStore((state) => state.token);

  const navigate = useNavigate();

  async function deletePost() {
    try {
      await apiInstance.delete(`/posts/get-post/${props._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/app/my-posts");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="post my-post">
      <div className="post__header">
        <h4>
          {formatDistance(new Date(props.createdAt), new Date(), {
            addSuffix: true,
          })}
        </h4>
        <div onClick={() => deletePost()}>
          <FontAwesomeIcon icon="trash" />
        </div>
      </div>
      <div className="post__caption">
        <p>{props.caption}</p>
      </div>
      <div className="post__image">
        <img src={props.image} alt="post" />
      </div>
      <div className="post__footer">
        <div className="heart-react">
          <FontAwesomeIcon icon="heart" />
        </div>
        <p>
          {props.likes === 0
            ? ""
            : props.likes === 1
            ? "1 like"
            : `${props.likes} likes`}
        </p>
      </div>
    </div>
  );
}

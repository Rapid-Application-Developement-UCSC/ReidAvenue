import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authStore } from "../../stores/auth-store";
import { apiInstance } from "../../api/instance";
import { useNavigate } from "react-router-dom";

/**
 *
 * @param {{ fullName: string, _id: string}} props
 */
export default function Friend(props) {
  const token = authStore((state) => state.token);

  const navigate = useNavigate();

  async function unfriend() {
    try {
      const response = await apiInstance.delete(`/friends/${props._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/app/feed");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="friend">
      <p>{props.fullName}</p>
      <div onClick={unfriend}>
        <FontAwesomeIcon icon="user-minus" />
      </div>
    </div>
  );
}

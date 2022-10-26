import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authStore } from "../../stores/auth-store";
import { useNavigate } from "react-router-dom";
import { apiInstance } from "../../api/instance";

/**
 *
 * @param {{ fullName: string, _id: string}} props
 */
export default function User(props) {
  const token = authStore((state) => state.token);

  const navigate = useNavigate();

  async function befriend() {
    try {
      const response = await apiInstance.patch(
        `/friends/${props._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/app/feed");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="user">
      <p>{props.fullName}</p>
      <div onClick={befriend}>
        <FontAwesomeIcon icon="user-plus" />
      </div>
    </div>
  );
}

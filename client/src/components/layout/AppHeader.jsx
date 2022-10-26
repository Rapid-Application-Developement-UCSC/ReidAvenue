import { Link as RouterLink } from "react-router-dom";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { authStore } from "../../stores/auth-store";

export default function AppHeader() {
  const user = authStore((state) => state.user);

  return (
    <header className="app-header">
      <Link className="ff-brand home-link" as={RouterLink} to="/">
        Reid Avenue
      </Link>
      <ul>
        <li>
          <Link as={RouterLink} to="/app/feed">
            <FontAwesomeIcon icon="house" />
          </Link>
        </li>
        <li>
          <Link as={RouterLink} to="/app/feed">
            <FontAwesomeIcon icon="folder" />
          </Link>
        </li>{" "}
        <li>
          <Link as={RouterLink} to="/app/feed">
            <FontAwesomeIcon icon="square-plus" />
          </Link>
        </li>
        <li>
          <Link as={RouterLink} to="/app/feed">
            <FontAwesomeIcon icon="user-friends" />
          </Link>
        </li>
      </ul>
      <div className="actions">
        <p>{`${user.firstName} ${user.lastName}`}</p>
        <button className="notifications-btn">
          <FontAwesomeIcon icon="bell" />
        </button>
        <button className="logout-btn">
          <FontAwesomeIcon icon="right-from-bracket" />
        </button>
      </div>
    </header>
  );
}

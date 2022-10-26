import { Link as RouterLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@chakra-ui/react";

import { authStore } from "../../stores/auth-store";
import { apiInstance } from "../../api/instance";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";

export default function AppHeader() {
  const user = authStore((state) => state.user);
  const token = authStore((state) => state.token);
  const navigate = useNavigate();
  const logout = authStore((state) => state.logoutUser);

  async function logoutUser() {
    await logout();
    navigate("/");
  }

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [notifications, setNotifications] = useState([]);

  async function openNotification() {
    onOpen();
    const response = await apiInstance.get("/notifications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setNotifications(response.data);
  }

  async function deleteNotification(id) {
    const response = await apiInstance.delete(`/notifications/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await openNotification();
  }

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
          <Link as={RouterLink} to="/app/new-post">
            <FontAwesomeIcon icon="square-plus" />
          </Link>
        </li>
        <li>
          <Link as={RouterLink} to="/app/my-posts">
            <FontAwesomeIcon icon="camera" />
          </Link>
        </li>
        <li>
          <Link as={RouterLink} to="/app/collections">
            <FontAwesomeIcon icon="folder" />
          </Link>
        </li>
        <li>
          <Link as={RouterLink} to="/app/friends">
            <FontAwesomeIcon icon="user-friends" />
          </Link>
        </li>
      </ul>
      <div className="actions">
        <p>{`${user.firstName} ${user.lastName}`}</p>
        <button className="notifications-btn" onClick={openNotification}>
          <FontAwesomeIcon icon="bell" />
        </button>
        <button className="logout-btn" onClick={logoutUser}>
          <FontAwesomeIcon icon="right-from-bracket" />
        </button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Notifications</ModalHeader>
            <ModalCloseButton />
            <ModalBody className="notifications-body">
              {notifications.length > 0 ? (
                <ul className="notifications">
                  {notifications.map((notification) => (
                    <li key={notification._id} className="notification">
                      <p>{notification.text}</p>
                      <FontAwesomeIcon
                        icon="trash"
                        onClick={() => deleteNotification(notification._id)}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No notifications</p>
              )}
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </header>
  );
}

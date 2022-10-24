import { Button, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { authStore } from "../../stores/auth-store";
export default function LandingHeader() {
  const user = authStore((state) => state.user);
  const logout = authStore((state) => state.logoutUser);

  console.log(user);
  return (
    <header className="landing-header">
      <p className="ff-brand">Reid Avenue</p>
      {!user ? (
        <ul>
          <li>
            <Link as={RouterLink} to="/login">
              Sign in
            </Link>
          </li>
          <li>
            <Button as={RouterLink} to="/signup" colorScheme="green">
              Get started
            </Button>
          </li>
        </ul>
      ) : (
        <ul>
          <li>{"Welcome, " + user.firstName + " " + user.lastName}</li>
          <li>
            <Button colorScheme="green" onClick={logout}>
              Sign out
            </Button>
          </li>
        </ul>
      )}
    </header>
  );
}

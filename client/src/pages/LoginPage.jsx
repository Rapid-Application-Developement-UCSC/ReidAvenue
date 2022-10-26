import { Input, Button, Link } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState } from "react";

import { apiInstance } from "../api/instance";
import { authStore } from "../stores/auth-store";

export default function LoginPage() {
  const navigate = useNavigate();

  const setUserAndToken = authStore((state) => state.setUserAndToken);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  async function submitData() {
    setIsLoading(true);

    try {
      const response = await apiInstance.post(
        "/auth/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setUserAndToken(response.data.user, response.data.token);
        navigate("/app/feed");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-page">
      <section className="form">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitData();
          }}
        >
          <h1 className="ff-brand">Reid Avenue</h1>
          <Input
            placeholder="Email"
            type="email"
            colorScheme="purple"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <Input
            placeholder="Password"
            colorScheme="purple"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <p>
            Don't have an account yet?{" "}
            <Link as={RouterLink} to="/signup">
              Signup
            </Link>
          </p>
          <Button colorScheme="green" type="submit" isLoading={isLoading}>
            Sign in
          </Button>
        </form>
      </section>
      <section className="image">
        <div></div>
      </section>
    </div>
  );
}

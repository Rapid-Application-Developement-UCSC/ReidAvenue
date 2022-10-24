import { Input, Button, Link } from "@chakra-ui/react";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { apiInstance } from "../api/instance";

export default function SignupPage() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function submitData() {
    try {
      const response = await apiInstance.post("/auth/signup", {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });
      console.log(response);
      if (response.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="signup-page">
      <section className="form">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitData();
          }}
        >
          <h1 className="ff-brand">Reid Avenue</h1>
          <Input
            placeholder="First Name"
            colorScheme="green"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
          />
          <Input
            placeholder="Last Name"
            colorScheme="green"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
          />
          <Input
            placeholder="Email"
            type="email"
            colorScheme="green"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <Input
            placeholder="Password"
            colorScheme="green"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <Input
            placeholder="Confirm Password"
            colorScheme="green"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
          <p>
            Already have an account?{" "}
            <Link as={RouterLink} to="/login">
              Sign in
            </Link>
          </p>
          <Button colorScheme="green" type="submit">
            Register
          </Button>
        </form>
      </section>
      <section className="image">
        <div></div>
      </section>
    </div>
  );
}

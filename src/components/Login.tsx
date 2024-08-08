import React, { useState } from "react";
import { LoginResponse } from "../interfaces/LoginResponse";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { environment } from "../environments/environment";
import { LoginProps } from "../interfaces/Props";

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [token, setToken] = useState<string>("");
  const [alert, setAlert] = useState<{
    variant: string;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${environment.apiUrl}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ token }),
      });
      const data: LoginResponse = await response.json();
      if (response.ok) {
        setAlert({ variant: "success", message: "Login successful" });
        localStorage.setItem("authToken", token);
        localStorage.setItem("userData", JSON.stringify(data));
        onLogin(data);
      } else {
        setAlert({ variant: "danger", message: data.error || "Login failed" });
      }
    } catch (error) {
      console.error("Error:", error);
      setAlert({ variant: "danger", message: "An error occurred" });
    }
  };

  return (
    <Container className="mt-5">
      <h2>Login</h2>
      {alert && <Alert variant={alert.variant}>{alert.message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formToken">
          <Form.Label>Personal Access Token</Form.Label>
          <Form.Control
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter your token"
            className="mb-3"
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-25">
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default Login;

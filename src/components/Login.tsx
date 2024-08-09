import React, { useState } from "react";
import { LoginResponse } from "../interfaces/LoginResponse";
import { Form, Button, Container, Alert, Card } from "react-bootstrap";
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
    <Container className="d-flex justify-content-center align-items-center p-4">
      <Card
        style={{ width: "100%", maxWidth: "400px" }}
        className="p-4 shadow-sm"
      >
        <Card.Body>
          <Card.Title className="text-center mb-4">Login</Card.Title>
          {alert && (
            <Alert variant={alert.variant} className="mb-3">
              {alert.message}
            </Alert>
          )}
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
            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;

import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import CameraList from "./components/CameraList";
import { LoginResponse } from "./interfaces/LoginResponse";
import { Container, Button, Card, Navbar, ListGroup } from "react-bootstrap";
import "./App.css";

const App: React.FC = () => {
  const [userData, setUserData] = useState<LoginResponse | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    } else if (storedToken) {
      localStorage.removeItem("authToken");
    }
  }, []);

  const handleLogin = (data: LoginResponse) => {
    setUserData(data);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setUserData(null);
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Navbar.Brand>Angelcam</Navbar.Brand>
        {userData && (
          <div className="ml-auto">
            <Button variant="outline-light" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        )}
      </Navbar>
      <Container className="mt-3">
        {userData ? (
          <>
            <Card className="mb-4 shadow-sm rounded">
              <Card.Body>
                <Card.Title className="text-center mb-4">
                  <h2>
                    Welcome, {userData.data.first_name}{" "}
                    {userData.data.last_name}!
                  </h2>
                </Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    <strong>Email</strong> {userData.data.email}
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    <strong>My cameras</strong> {userData.data.my_cameras_count}
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    <strong>Shared cameras</strong>{" "}
                    {userData.data.shared_cameras_count}
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    <strong>Total cameras</strong>{" "}
                    {userData.data.total_cameras_count}
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
            <CameraList token={localStorage.getItem("authToken")} />
          </>
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </Container>
    </>
  );
};

export default App;

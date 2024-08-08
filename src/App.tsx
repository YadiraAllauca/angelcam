import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import CameraList from "./components/CameraList";
import { LoginResponse } from "./interfaces/LoginResponse";
import { Container, Button, Card, Row, Col, Navbar } from "react-bootstrap";
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
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Card.Title className="text-center">
                  Welcome, {userData.data.first_name} {userData.data.last_name}!
                </Card.Title>
                <Row className="mt-3">
                  <Col md={6}>
                    <Card.Text>Email: {userData.data.email}</Card.Text>
                    <Card.Text>
                      My Cameras: {userData.data.my_cameras_count}
                    </Card.Text>
                    <Card.Text>
                      Shared Cameras: {userData.data.shared_cameras_count}
                    </Card.Text>
                    <Card.Text>
                      Total Cameras: {userData.data.total_cameras_count}
                    </Card.Text>
                  </Col>
                </Row>
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

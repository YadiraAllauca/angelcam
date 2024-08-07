import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import { LoginResponse } from "./interfaces/LoginResponse";
import { Container, Button, Card, Row, Col } from "react-bootstrap";

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
    <Container className="mt-5">
      {userData ? (
        <>
          <div className="d-flex justify-content-end mb-3">
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </div>
          <Card>
            <Card.Body>
              <Card.Title>
                Welcome, {userData.data.first_name} {userData.data.last_name}!
              </Card.Title>
              <Row>
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
                  <Card.Text>
                    Live View Available:{" "}
                    {userData.data.available_features.live_view ? "Yes" : "No"}
                  </Card.Text>
                  <Card.Text>
                    Connect Camera Available:{" "}
                    {userData.data.available_features.connect_camera
                      ? "Yes"
                      : "No"}
                  </Card.Text>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </Container>
  );
};

export default App;

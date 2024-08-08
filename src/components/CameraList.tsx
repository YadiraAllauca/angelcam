import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { Camera } from "../interfaces/Camera";
import { environment } from "../environments/environment";
import { CameraListProps } from "../interfaces/Props";
import "../styles/cameraList.css";

const CameraList: React.FC<CameraListProps> = ({ token }) => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCameras = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${environment.apiUrl}/cameras/`, {
          headers: {
            Authorization: `PersonalAccessToken ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cameras");
        }

        const data = await response.json();

        if (Array.isArray(data.cameras.results)) {
          setCameras(data.cameras.results);
        } else {
          console.error("Results data is not an array", data);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchCameras();
    }
  }, [token]);

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        {Array.isArray(cameras) && cameras.length > 0 ? (
          cameras.map((camera) => (
            <Col
              md={4}
              sm={6}
              xs={12}
              key={camera.id}
              className="mb-4 d-flex justify-content-center"
            >
              <Card className="fixed-card">
                <Card.Img
                  variant="top"
                  src={camera.live_snapshot}
                  alt={`Snapshot of ${camera.name}`}
                />
                <Card.Body>
                  <Card.Title>{camera.name}</Card.Title>
                  <Card.Text>Status: {camera.status}</Card.Text>
                  <Card.Text>
                    Live View:{" "}
                    {camera.live_snapshot ? "Available" : "Not available"}
                  </Card.Text>
                  <Card.Text>Type: {camera.type}</Card.Text>
                  {camera.streams.length > 0 && (
                    <Card.Text>
                      Streams:
                      <ul>
                        {camera.streams.map((stream, index) => (
                          <li key={index}>
                            {stream.format}:{" "}
                            <a
                              href={stream.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Stream
                            </a>
                          </li>
                        ))}
                      </ul>
                    </Card.Text>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <p className="text-center">No cameras available</p>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default CameraList;

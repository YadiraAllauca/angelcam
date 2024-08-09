import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Modal, Button } from "react-bootstrap";
import LoadingSpinner from "./tools/LoadingSpinner";
import ErrorAlert from "./tools/ErrorAlert";
import { Camera } from "../interfaces/Camera";
import { environment } from "../environments/environment";
import { CameraListProps } from "../interfaces/Props";
import "../styles/cameraList.css";
import CameraLiveStream from "./CameraLiveStream";

const CameraList: React.FC<CameraListProps> = ({ token }) => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCameraId, setSelectedCameraId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

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

  const handleShowModal = (cameraId: number) => {
    setSelectedCameraId(cameraId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCameraId(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
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
              <Card
                className="fixed-card"
                onClick={() => handleShowModal(camera.id)}
              >
                <Card.Img
                  variant="top"
                  src={camera.live_snapshot}
                  alt={`Snapshot of ${camera.name}`}
                />
                <Card.Body>
                  <Card.Title className="text-center mb-2">
                    {camera.name}
                  </Card.Title>
                  <Card.Text className="text-muted">
                    <strong>Status:</strong> {camera.status}
                  </Card.Text>
                  <Card.Text className="text-muted">
                    <strong>Live View:</strong>{" "}
                    {camera.live_snapshot ? "Available" : "Not available"}
                  </Card.Text>
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

      {/* Modal for live stream */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Live Stream</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCameraId && (
            <CameraLiveStream cameraId={selectedCameraId} token={token || ""} />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CameraList;

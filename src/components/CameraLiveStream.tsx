import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import Hls from "hls.js";
import { Button, Card, Col, Row, Container } from "react-bootstrap";
import LoadingSpinner from "./tools/LoadingSpinner";
import ErrorAlert from "./tools/ErrorAlert";
import CameraRecordingFilter from "./tools/CameraRecordingFilter";
import { environment } from "../environments/environment";
import { StreamDetails } from "../interfaces/StreamDetails";
import { CameraLiveStreamProps } from "../interfaces/Props";
import { RecordingSegment } from "../interfaces/RecordingSegment";

const CameraLiveStream: React.FC<CameraLiveStreamProps> = ({
  cameraId,
  token,
}) => {
  const [selectedStream, setSelectedStream] = useState<StreamDetails | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [recordingSegments, setRecordingSegments] = useState<
    RecordingSegment[]
  >([]);
  const [loadingRecordings, setLoadingRecordings] = useState<boolean>(true);
  const [selectedSegmentUrl, setSelectedSegmentUrl] = useState<string | null>(
    null
  );
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState<number>(-1);
  const [seekTime, setSeekTime] = useState<string>("00:00:00");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      await fetchStreamDetails();
      await fetchRecordingSegments(
        "2024-08-08T09:00:00Z",
        "2024-08-09T09:00:00Z"
      );
    };
    fetchData();
  }, [cameraId, token]);

  useEffect(() => {
    if (selectedSegmentUrl && videoRef.current) {
      initializeHls();
    }
  }, [selectedSegmentUrl]);

  const fetchStreamDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${environment.apiUrl}/stream/${cameraId}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch stream details");
      const data = await response.json();
      const stream = data.stream_details.find(
        (stream: StreamDetails) =>
          stream.format === "mp4" || stream.format === "mjpeg"
      );
      setSelectedStream(stream || null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchRecordingSegments = async (start: string, end: string) => {
    setLoadingRecordings(true);
    try {
      const response = await fetch(
        `${environment.apiUrl}/recording-timeline/${cameraId}/?start=${start}&end=${end}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch recording timeline");
      const data = await response.json();
      setRecordingSegments(data.timeline.segments);
    } catch (error) {
      console.error("Failed to fetch recording timeline", error);
    } finally {
      setLoadingRecordings(false);
    }
  };

  const fetchSegmentStreamUrl = async (start: string, end: string) => {
    setLoadingRecordings(true);
    try {
      const response = await fetch(
        `${environment.apiUrl}/recording-stream/${cameraId}/?start=${start}&end=${end}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch segment stream URL");
      const data = await response.json();
      setSelectedSegmentUrl(data.stream.url);
      setCurrentSegmentIndex(
        recordingSegments.findIndex(
          (segment) => segment.start === start && segment.end === end
        )
      );
    } catch (error) {
      console.error("Failed to fetch segment stream URL", error);
    } finally {
      setLoadingRecordings(false);
    }
  };

  const initializeHls = () => {
    const hls = new Hls();
    if (Hls.isSupported()) {
      hls.loadSource(selectedSegmentUrl!);
      hls.attachMedia(videoRef.current!);
      hls.on(Hls.Events.MANIFEST_PARSED, () => videoRef.current?.play());
    } else if (videoRef.current?.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = selectedSegmentUrl!;
      videoRef.current.addEventListener("loadedmetadata", () =>
        videoRef.current?.play()
      );
    }
    return () => hls.destroy();
  };

  const timeToSeconds = (time: string) => {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const handleSeekTime = () => {
    const seconds = timeToSeconds(seekTime);
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
    }
  };

  const handleSeekTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSeekTime(event.target.value);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <Container className="my-4">
      <Card className="mb-4">
        <Card.Body>
          <Card.Title className="mb-4 text-center">Live Stream</Card.Title>
          {selectedStream ? (
            selectedStream.format === "mp4" ? (
              <video
                controls
                autoPlay
                style={{ width: "100%", maxHeight: "600px" }}
                ref={videoRef}
              >
                <source src={selectedStream.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={selectedStream.url}
                alt="Live Camera Stream"
                style={{
                  width: "100%",
                  maxHeight: "600px",
                  objectFit: "cover",
                }}
              />
            )
          ) : (
            <p className="text-center">No live stream available</p>
          )}
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <Card.Title className="mb-4 text-center">Recordings</Card.Title>
          <CameraRecordingFilter onFilterChange={fetchRecordingSegments} />
          {selectedSegmentUrl && (
            <Card>
              <Card.Body>
                <Card.Title className="text-center">
                  Selected Segment
                </Card.Title>
                <video
                  ref={videoRef}
                  controls
                  style={{ width: "100%", maxHeight: "400px" }}
                >
                  <source
                    src={selectedSegmentUrl}
                    type="application/vnd.apple.mpegurl"
                  />
                  Your browser does not support the video tag.
                </video>
                {currentSegmentIndex >= 0 && (
                  <Row className="mt-3">
                    <Col md={6}>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          const prevSegment =
                            recordingSegments[currentSegmentIndex - 1];
                          if (prevSegment)
                            fetchSegmentStreamUrl(
                              prevSegment.start,
                              prevSegment.end
                            );
                        }}
                        disabled={currentSegmentIndex <= 0}
                        className="w-100"
                      >
                        Previous Segment
                      </Button>
                    </Col>
                    <Col md={6}>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          const nextSegment =
                            recordingSegments[currentSegmentIndex + 1];
                          if (nextSegment)
                            fetchSegmentStreamUrl(
                              nextSegment.start,
                              nextSegment.end
                            );
                        }}
                        disabled={
                          currentSegmentIndex >= recordingSegments.length - 1
                        }
                        className="w-100"
                      >
                        Next Segment
                      </Button>
                    </Col>
                  </Row>
                )}
                <div className="mt-3">
                  <input
                    type="text"
                    value={seekTime}
                    onChange={handleSeekTimeChange}
                    placeholder="hh:mm:ss"
                    style={{ width: "100%", marginBottom: "10px" }}
                  />
                  <Button onClick={handleSeekTime} variant="primary">
                    Seek to Time
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}
          {loadingRecordings ? (
            <LoadingSpinner />
          ) : recordingSegments.length > 0 ? (
            <Row className="g-3">
              {recordingSegments.map((segment, index) => (
                <Col md={4} key={index} className="mb-3">
                  <Card>
                    <Card.Body>
                      <Card.Text>
                        Recording from{" "}
                        {new Date(segment.start).toLocaleString()} to{" "}
                        {new Date(segment.end).toLocaleString()}
                      </Card.Text>
                      <Button
                        variant="primary"
                        onClick={() =>
                          fetchSegmentStreamUrl(segment.start, segment.end)
                        }
                        className="w-100"
                      >
                        Play Segment
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <p className="text-center">No recordings available</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CameraLiveStream;

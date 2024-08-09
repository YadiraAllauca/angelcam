import React, { useEffect, useState } from "react";
import LoadingSpinner from "./tools/LoadingSpinner";
import ErrorAlert from "./tools/ErrorAlert";
import { environment } from "../environments/environment";
import { StreamDetails } from "../interfaces/StreamDeatils";
import { CameraLiveStreamProps } from "../interfaces/Props";

const CameraLiveStream: React.FC<CameraLiveStreamProps> = ({
  cameraId,
  token,
}) => {
  const [selectedStream, setSelectedStream] = useState<StreamDetails | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStreamDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${environment.apiUrl}/stream/${cameraId}/`,
          {
            headers: {
              Authorization: `PersonalAccessToken ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch stream details");
        }
        const data = await response.json();
        const mp4Stream = data.stream_details.find(
          (stream: StreamDetails) => stream.format === "mp4"
        );
        const mjpegStream = data.stream_details.find(
          (stream: StreamDetails) => stream.format === "mjpeg"
        );
        setSelectedStream(mp4Stream || mjpegStream || null);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchStreamDetails();
  }, [cameraId, token]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <div className="text-center">
      {selectedStream ? (
        selectedStream.format === "mp4" ? (
          <video
            controls
            autoPlay
            style={{ width: "100%", maxHeight: "600px" }}
          >
            <source src={selectedStream.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={selectedStream.url}
            alt="Live Camera Stream"
            style={{ width: "100%", maxHeight: "600px", objectFit: "cover" }}
          />
        )
      ) : (
        <p>No live stream available</p>
      )}
    </div>
  );
};

export default CameraLiveStream;

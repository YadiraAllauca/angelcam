import React from "react";
import { Alert } from "react-bootstrap";

interface ErrorAlertProps {
  message: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => {
  return (
    <div className="text-center">
      <Alert variant="danger">{message}</Alert>
    </div>
  );
};

export default ErrorAlert;
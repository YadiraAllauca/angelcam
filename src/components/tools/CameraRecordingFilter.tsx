import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Card, Form, Row, Col } from "react-bootstrap";

const CameraRecordingFilter: React.FC<{
  onFilterChange: (start: string, end: string) => void;
}> = ({ onFilterChange }) => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const handleApplyFilter = () => {
    if (startDate && endDate) {
      onFilterChange(startDate.toISOString(), endDate.toISOString());
    }
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <Row className="g-3">
          <Col md={4} sm={12}>
            <Form.Group>
              <Form.Label>
                <strong>Start Date</strong>
              </Form.Label>
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) =>
                  setStartDate(date ? date : undefined)
                }
                selectsStart
                startDate={startDate}
                endDate={endDate}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select start date"
                className="form-control"
              />
            </Form.Group>
          </Col>
          <Col md={4} sm={12}>
            <Form.Group>
              <Form.Label>
                <strong>End Date</strong>
              </Form.Label>
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) =>
                  setEndDate(date ? date : undefined)
                }
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select end date"
                className="form-control"
              />
            </Form.Group>
          </Col>
          <Col md={4} sm={12} className="d-flex align-items-end">
            <Button
              variant="primary"
              onClick={handleApplyFilter}
              className="w-100"
            >
              Apply Filter
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default CameraRecordingFilter;

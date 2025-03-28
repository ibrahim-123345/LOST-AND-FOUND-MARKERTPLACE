import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, ListGroup, Card } from "react-bootstrap";
import { FaPaperPlane, FaComment } from "react-icons/fa";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../../../axiosInstance";

const CommunityChat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [report, setReport] = useState("");
  const [reportedItems, setReportedItems] = useState([]);

  // Fetch chat messages from the backend
  const fetchMessages = async () => {
    try {
      const response = await axiosInstance.get("chat/messages");
      console.log(response.data);
      if (response.data.length === 0) {
        // Use mock data if no messages exist
        setMessages([
          { text: "Welcome to the community chat!", createdAt: "2025-03-14T10:00:00Z" },
          { text: "Feel free to report any lost items here.", createdAt: "2025-03-14T10:05:00Z" },
          { text: "Hello everyone! How can I help?", createdAt: "2025-03-14T10:10:00Z" }
        ]);
      } else {
        setMessages(response.data);
      }
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      
      // If there's an error (e.g., backend is down), use mock messages
      setMessages([
        { text: "Server is currently unreachable, but you can still chat!", createdAt: "2025-03-14T10:15:00Z" },
        { text: "Test message 1", createdAt: "2025-03-14T10:20:00Z" },
        { text: "Test message 2", createdAt: "2025-03-14T10:25:00Z" }
      ]);
    }
  };
   

  // Fetch reported items from the backend
  const fetchReportedItems = async () => {
    try {
    const response = await axiosInstance.get("chat/messages");
      setReportedItems(response.data);
    } catch (error) {
      console.error("Error fetching reported items:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchReportedItems();
  }, []);

  // Handle message send
  const sendMessage = async () => {
    if (message) {
      try {
        await axiosInstance.post("chat/messages", { text: message });
        setMessage(""); // Clear message input
        fetchMessages(); // Refresh the chat messages
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  // Handle report submission
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (report) {
      try {
        await axiosInstance.post("reports", { report });
        setReport(""); // Clear report input
        fetchReportedItems(); // Refresh the reported items list
      } catch (error) {
        console.error("Error submitting report:", error);
      }
    }
  };

  return (
    <Container fluid>
      <Row>
        {/* Chat Section */}
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <h3><FaComment /> Community Chat</h3>
              <div style={{ height: "400px", overflowY: "auto", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
                <ListGroup variant="flush">
                  {messages.map((msg, index) => (
                    <ListGroup.Item key={index}>{msg.text}</ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
              <Form.Control
                as="textarea"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
              />
              <Button onClick={sendMessage} variant="primary" className="mt-2">
                <FaPaperPlane /> Send
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Report Section */}
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <h3>Report an Issue</h3>
              <Form onSubmit={handleReportSubmit}>
                <Form.Group controlId="reportText">
                  <Form.Label>Describe the Issue</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={report}
                    onChange={(e) => setReport(e.target.value)}
                    placeholder="Describe what you'd like to report"
                  />
                </Form.Group>
                <Button type="submit" variant="success">
                  Submit Report
                </Button>
              </Form>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <h4>Reported Items</h4>
              <ListGroup variant="flush">
                {reportedItems.length > 0 ? (
                  reportedItems.map((item, index) => (
                    <ListGroup.Item key={index}>{item.report}</ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item>No reports yet.</ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CommunityChat;

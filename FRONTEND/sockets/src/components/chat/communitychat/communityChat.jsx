import React, { useState, useEffect } from "react";
import { Container, Button, Form, ListGroup, Card, Badge, InputGroup } from "react-bootstrap";
import { FaComment, FaExclamationCircle} from "react-icons/fa";
import axiosInstance from "../../../axiosInstance";
import { IoMdSend } from "react-icons/io";



const CommunityChat = () => {
  const currentUser = localStorage.getItem("username");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [report, setReport] = useState("");
  const [reportedItems, setReportedItems] = useState([]);
  const [activeTab, setActiveTab] = useState("chat");
  const [userProfiles, setUserProfiles] = useState({});

  // Fetch user profile images
  const fetchUserProfile = async (username) => {
    try {
      const response = await axiosInstance.get(`/user/profile/${username}`);
      return response.data.profileImage || `https://ui-avatars.com/api/?name=${username}&background=random&color=fff&bold=true`;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return `https://ui-avatars.com/api/?name=${username}&background=random&color=fff&bold=true`;
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axiosInstance.get("community/messages");
      setMessages(response.data);
      
      const uniqueUsers = [...new Set(response.data.map(msg => msg.username))];
      const profiles = {};
      for (const user of uniqueUsers) {
        if (!userProfiles[user]) {
          profiles[user] = await fetchUserProfile(user);
        }
      }
      setUserProfiles(prev => ({ ...prev, ...profiles }));
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      setMessages([]);
    }
  };
   
  const fetchReportedItems = async () => {
    try {
      const response = await axiosInstance.get("reports");
      setReportedItems(response.data);
    } catch (error) {
      console.error("Error fetching reported items:", error);
      setReportedItems([]);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchReportedItems();
    
    const interval = setInterval(fetchMessages, 2000);
    const interval2 = setInterval(fetchReportedItems, 2000);
    
    return () => {
      clearInterval(interval);
      clearInterval(interval2);
    };
  }, []);

  const sendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        text: message,
        createdAt: new Date().toISOString(),
        username: currentUser
      };
      
      try {
        const response = await axiosInstance.post("community/messages", newMessage);
        setMessages([...messages, response.data]);
        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (report.trim()) {
      try {
        const newReport = {
          report: report,
          createdAt: new Date().toISOString(),
          username: currentUser
        };
        const response = await axiosInstance.post("reports", newReport);
        setReportedItems([...reportedItems, response.data]);
        setReport("");
      } catch (error) {
        console.error("Error submitting report:", error);
      }
    }
  };

  
  return (
    <Container fluid className="p-0" style={{ 
      backgroundColor: "#f8f9fa",
      minHeight: "100vh"
    }}>
      <Card className="border-0 shadow-sm h-100" style={{ 
        borderRadius: "0",
        border: "none"
      }}>
        <Card.Header className="bg-white" style={{ 
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          padding: "16px 24px"
        }}>
          <div className="d-flex align-items-center">
            <h4 className="mb-0 fw-bold">
              {activeTab === "chat" ? (
                <>
                  <FaComment className="me-2 text-primary" />
                  Community Chat
                </>
              ) : (
                <>
                  <FaExclamationCircle className="me-2 text-danger" />
                  Reported Issues
                </>
              )}
            </h4>
            <Badge pill bg="light" text="dark" className="ms-2 py-2 px-3 fw-medium">
              {activeTab === "chat" 
                ? `${messages.length} messages` 
                : `${reportedItems.length} reports`}
            </Badge>
          </div>
          <div>
            <Button 
              variant={activeTab === "chat" ? "primary" : "outline-primary"} 
              size="sm" 
              className="me-2 rounded-pill px-3 py-1 fw-medium"
              onClick={() => setActiveTab("chat")}
            >
              Chat
            </Button>
            <Button 
              variant={activeTab === "reports" ? "danger" : "outline-danger"} 
              size="sm"
              className="rounded-pill px-3 py-1 fw-medium"
              onClick={() => setActiveTab("reports")}
            >
              Reports
            </Button>
          </div>
        </Card.Header>
        
        <Card.Body className="p-0 d-flex flex-column" style={{ height: "calc(100vh - 72px)" }}>
          {/* Content Area */}
          <div className="flex-grow-1 overflow-auto p-4">
            {activeTab === "chat" ? (
              <div className="d-flex flex-column gap-3">
                {messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <div key={index} className={`d-flex ${msg.username === currentUser ? "justify-content-end" : "justify-content-start"}`}>
                      <div className={`d-flex ${msg.username === currentUser ? "flex-row-reverse" : "flex-row"}`} style={{ maxWidth: "80%" }}>
                        <div className="mx-3">
                          <img 
                            src={userProfiles[msg.username] || `https://ui-avatars.com/api/?name=${msg.username}&background=random&color=fff&bold=true`} 
                            alt={msg.username} 
                            className="rounded-circle"
                            style={{
                              width: "44px",
                              height: "44px",
                              objectFit: "cover",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                            }}
                          />
                        </div>
                        <div className={`d-flex flex-column ${msg.username === currentUser ? "align-items-end" : "align-items-start"}`} style={{ maxWidth: "calc(100% - 68px)" }}>
                          <div className="d-flex align-items-center mb-1">
                            <strong className="fw-medium">{msg.username === currentUser ? "You" : msg.username}</strong>
                            <small className="text-muted ms-2" style={{ fontSize: "0.8rem" }}>
                              {new Date(msg.createdAt).toLocaleTimeString()}
                            </small>
                          </div>
                          <div className={`p-3 rounded-3 ${msg.username === currentUser ? "bg-primary text-white" : "bg-light text-dark"}`} style={{ 
                            wordBreak: "break-word",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                          }}>
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted py-5">
                    <FaComment size={32} className="opacity-30 mb-3" />
                    <h5 className="fw-medium">No messages yet</h5>
                    <p>Start the conversation!</p>
                  </div>
                )}
              </div>
            ) : (
              <ListGroup variant="flush">
                {reportedItems.length > 0 ? (
                  reportedItems.map((item, index) => (
                    <ListGroup.Item key={index} className="px-0 py-3 border-bottom">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <p className="fw-medium mb-1">{item.report}</p>
                          <div className="d-flex align-items-center">
                            <small className="text-muted me-3">
                              {item.username}
                            </small>
                            <small className="text-muted">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </small>
                          </div>
                        </div>
                        <Badge pill bg="warning" text="dark" className="fw-medium px-3 py-1">
                          Pending
                        </Badge>
                      </div>
                    </ListGroup.Item>
                  ))
                ) : (
                  <div className="text-center text-muted py-5">
                    <FaExclamationCircle size={32} className="opacity-30 mb-3" />
                    <h5 className="fw-medium">No reports found</h5>
                    <p>Be the first to report an issue</p>
                  </div>
                )}
              </ListGroup>
            )}
          </div>
          
          {/* Input Area */}
          {activeTab === "chat" ? (
            <div className="p-3 border-top bg-light">
              <InputGroup>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="rounded-start-3 border-end-0"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <Button 
                  variant="primary" 
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className="rounded-end-3 px-4"
                >
                  <IoMdSend size={18} />
                </Button>
              </InputGroup>
            </div>
          ) : (
            <div className="p-3 border-top bg-light">
              <Form onSubmit={handleReportSubmit}>
                <Form.Group>
                  <Form.Label className="fw-medium text-secondary mb-2">Report an Issue</Form.Label>
                  <InputGroup>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={report}
                      onChange={(e) => setReport(e.target.value)}
                      placeholder="Describe the issue you want to report..."
                      className="rounded-start-3 border-end-0"
                    />
                    <Button 
                      variant="danger" 
                      type="submit"
                      disabled={!report.trim()}
                      className="rounded-end-3 px-4"
                    >
                      <FaExclamationCircle className="me-1" />
                      Report
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Form>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CommunityChat;
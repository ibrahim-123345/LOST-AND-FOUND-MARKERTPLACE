import React, { useState, useEffect } from "react";
import { Container, Button, Form, ListGroup, Card, Badge, InputGroup } from "react-bootstrap";
import { FaComment, FaExclamationCircle, FaCheckCircle } from "react-icons/fa";
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
  const [isLoading, setIsLoading] = useState(true);

  // Premium watercolor background image
  const backgroundImage = "url('https://images.app.goo.gl/Si7UZe9rDPLFybz48')";

  // Fetch user profile images
  const fetchUserProfile = async (username) => {
    try {
      const response = await axiosInstance.get(`/user/profile/${username}`);
      return response.data.profileImage;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
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
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      setMessages([]);
      setIsLoading(false);
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
        await axiosInstance.post("community/messages", newMessage);
        setMessage("");
        fetchMessages();
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
        await axiosInstance.post("reports", newReport);
        setReport("");
        fetchReportedItems();
      } catch (error) {
        console.error("Error submitting report:", error);
      }
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Container fluid className="p-0 h-100" style={{ 
      backgroundImage: backgroundImage,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      minHeight: "100vh"
    }}>
      <div style={{
        backgroundColor: "rgba(255, 255, 255, 0.88)",
        minHeight: "100vh",
        backdropFilter: "blur(2px)"
      }}>
        <Card className="border-0 h-100 mx-auto" style={{ 
          maxWidth: "1200px",
          borderRadius: "0.75rem",
          border: "none",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.18)",
          backgroundColor: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(4px)"
        }}>
          <Card.Header className="bg-white" style={{ 
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
            padding: "1.25rem 1.5rem",
            borderTopLeftRadius: "0.75rem",
            borderTopRightRadius: "0.75rem"
          }}>
            <div className="d-flex align-items-center">
              <h4 className="mb-0 fw-bold" style={{ letterSpacing: "-0.2px" }}>
                {activeTab === "chat" ? (
                  <>
                    <FaComment className="me-2" style={{ color: "#6366f1" }} />
                    Community Chat
                  </>
                ) : (
                  <>
                    <FaExclamationCircle className="me-2" style={{ color: "#ef4444" }} />
                    Reported Issues
                  </>
                )}
              </h4>
              <Badge pill className="ms-2 py-2 px-3 fw-medium" style={{ 
                backgroundColor: "rgba(99, 102, 241, 0.1)",
                color: "#6366f1"
              }}>
                {activeTab === "chat" 
                  ? `${messages.length} ${messages.length === 1 ? 'message' : 'messages'}` 
                  : `${reportedItems.length} ${reportedItems.length === 1 ? 'report' : 'reports'}`}
              </Badge>
            </div>
            <div>
              <Button 
                variant={activeTab === "chat" ? "primary" : "outline-primary"} 
                size="sm" 
                className="me-2 rounded-pill px-3 py-1 fw-medium"
                onClick={() => setActiveTab("chat")}
                style={{
                  backgroundColor: activeTab === "chat" ? "#6366f1" : "transparent",
                  borderColor: "#6366f1",
                  color: activeTab === "chat" ? "white" : "#6366f1"
                }}
              >
                Chat
              </Button>
              <Button 
                variant={activeTab === "reports" ? "danger" : "outline-danger"} 
                size="sm"
                className="rounded-pill px-3 py-1 fw-medium"
                onClick={() => setActiveTab("reports")}
                style={{
                  backgroundColor: activeTab === "reports" ? "#ef4444" : "transparent",
                  borderColor: "#ef4444",
                  color: activeTab === "reports" ? "white" : "#ef4444"
                }}
              >
                Reports
              </Button>
            </div>
          </Card.Header>
          
          <Card.Body className="p-0 d-flex flex-column" style={{ height: "calc(100vh - 72px)" }}>
            {/* Content Area */}
            <div className="flex-grow-1 overflow-auto p-4" style={{ 
              background: activeTab === "chat" ? "rgba(249, 250, 251, 0.7)" : "rgba(255, 255, 255, 0.7)",
              scrollbarWidth: "thin"
            }}>
              {isLoading ? (
                <div className="d-flex justify-content-center align-items-center h-100">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : activeTab === "chat" ? (
                <div className="d-flex flex-column gap-3">
                  {messages.length > 0 ? (
                    messages.map((msg, index) => (
                      <div 
                        key={index} 
                        className={`d-flex ${msg.username === currentUser ? "justify-content-end" : "justify-content-start"}`}
                      >
                        <div 
                          className={`d-flex ${msg.username === currentUser ? "flex-row-reverse" : ""}`} 
                          style={{ maxWidth: "85%" }}
                        >
                          <div className="flex-shrink-0" style={{ 
                            width: "40px", 
                            height: "40px",
                            marginLeft: msg.username === currentUser ? "0" : "12px",
                            marginRight: msg.username === currentUser ? "12px" : "0"
                          }}>
                            <img 
                              src={userProfiles[msg.username] || `https://ui-avatars.com/api/?name=${msg.username}&background=random&color=fff&bold=true`} 
                              alt={msg.username} 
                              className="rounded-circle h-100 w-100"
                              style={{
                                objectFit: "cover",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                              }}
                            />
                          </div>
                          <div 
                            className={`d-flex flex-column ${msg.username === currentUser ? "align-items-end" : "align-items-start"}`}
                            style={{ maxWidth: "calc(100% - 52px)" }}
                          >
                            <div className="d-flex align-items-center mb-1">
                              <strong className="fw-medium" style={{ 
                                color: msg.username === currentUser ? "#6366f1" : "#374151",
                                fontSize: "0.875rem"
                              }}>
                                {msg.username === currentUser ? "You" : msg.username}
                              </strong>
                              <small className="text-muted ms-2" style={{ 
                                fontSize: "0.75rem",
                                opacity: 0.7
                              }}>
                                {formatTime(msg.createdAt)}
                              </small>
                            </div>
                            <div 
                              className={`p-3 rounded-3 ${msg.username === currentUser ? "bg-primary text-white" : "bg-white text-gray-800"}`} 
                              style={{ 
                                wordBreak: "break-word",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                                border: msg.username === currentUser ? "none" : "1px solid rgba(0,0,0,0.05)",
                                lineHeight: "1.5",
                                fontSize: "0.9375rem"
                              }}
                            >
                              {msg.text}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted py-5" style={{ opacity: 0.6 }}>
                      <FaComment size={40} className="mb-3" />
                      <h5 className="fw-medium mb-2">No messages yet</h5>
                      <p className="mb-0">Be the first to start the conversation!</p>
                    </div>
                  )}
                </div>
              ) : (
                <ListGroup variant="flush" className="rounded-lg overflow-hidden">
                  {reportedItems.length > 0 ? (
                    reportedItems.map((item, index) => (
                      <ListGroup.Item 
                        key={index} 
                        className="px-0 py-3 border-bottom"
                        style={{ 
                          backgroundColor: index % 2 === 0 ? "rgba(249, 250, 251, 0.7)" : "rgba(255, 255, 255, 0.7)",
                          borderColor: "rgba(0,0,0,0.03)"
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <div style={{ maxWidth: "calc(100% - 100px)" }}>
                            <p className="fw-medium mb-2" style={{ color: "#1f2937" }}>{item.report}</p>
                            <div className="d-flex align-items-center">
                              <small className="text-muted me-3" style={{ fontSize: "0.8125rem" }}>
                                {item.username === currentUser ? "You" : item.username}
                              </small>
                              <small className="text-muted" style={{ fontSize: "0.8125rem" }}>
                                {new Date(item.createdAt).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </small>
                            </div>
                          </div>
                          <Badge 
                            pill 
                            className="fw-medium px-3 py-1" 
                            style={{ 
                              backgroundColor: "rgba(234, 179, 8, 0.1)",
                              color: "#d97706",
                              fontSize: "0.75rem"
                            }}
                          >
                            <FaCheckCircle className="me-1" size={12} />
                            Pending
                          </Badge>
                        </div>
                      </ListGroup.Item>
                    ))
                  ) : (
                    <div className="text-center text-muted py-5" style={{ opacity: 0.6 }}>
                      <FaExclamationCircle size={40} className="mb-3" />
                      <h5 className="fw-medium mb-2">No reports found</h5>
                      <p className="mb-0">Be the first to report an issue</p>
                    </div>
                  )}
                </ListGroup>
              )}
            </div>
            
            {/* Input Area */}
            {activeTab === "chat" ? (
              <div className="p-3 border-top" style={{ 
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderColor: "rgba(0,0,0,0.05)"
              }}>
                <InputGroup>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="rounded-start-3 border-end-0"
                    style={{
                      borderColor: "rgba(0,0,0,0.1)",
                      resize: "none",
                      fontSize: "0.9375rem",
                      padding: "0.75rem 1rem",
                      backgroundColor: "rgba(255, 255, 255, 0.9)"
                    }}
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
                    className="rounded-end-3 px-4 d-flex align-items-center"
                    style={{
                      backgroundColor: "#6366f1",
                      borderColor: "#6366f1",
                      height: "100%"
                    }}
                  >
                    <IoMdSend size={18} className="me-1" />
                    Send
                  </Button>
                </InputGroup>
              </div>
            ) : (
              <div className="p-3 border-top" style={{ 
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderColor: "rgba(0,0,0,0.05)"
              }}>
                <Form onSubmit={handleReportSubmit}>
                  <Form.Group>
                    <Form.Label className="fw-medium text-secondary mb-2" style={{ fontSize: "0.875rem" }}>
                      Report an Issue
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={report}
                        onChange={(e) => setReport(e.target.value)}
                        placeholder="Describe the issue you want to report..."
                        className="rounded-start-3 border-end-0"
                        style={{
                          borderColor: "rgba(0,0,0,0.1)",
                          resize: "none",
                          fontSize: "0.9375rem",
                          padding: "0.75rem 1rem",
                          backgroundColor: "rgba(255, 255, 255, 0.9)"
                        }}
                      />
                      <Button 
                        variant="danger" 
                        type="submit"
                        disabled={!report.trim()}
                        className="rounded-end-3 px-4 d-flex align-items-center"
                        style={{
                          backgroundColor: "#ef4444",
                          borderColor: "#ef4444",
                          height: "100%"
                        }}
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
      </div>
    </Container>
  );
};

export default CommunityChat;
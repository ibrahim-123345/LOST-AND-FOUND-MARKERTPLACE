import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, ListGroup, Card, Badge, InputGroup } from "react-bootstrap";
import { FaComment, FaExclamationCircle, FaUsers, FaInfoCircle, FaRegLightbulb } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import axiosInstance from "../../../axiosInstance";

const user = localStorage.getItem("username") || 'Guest';

const CommunityChat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [report, setReport] = useState("");
  const [reportedItems, setReportedItems] = useState([]);
  const [activeTab, setActiveTab] = useState("chat");

  // Get avatar with random background
  const getAvatar = (username) => {
    return `https://ui-avatars.com/api/?name=${username}&background=random&color=fff&bold=true`;
  };

  // Fetch chat messages from the backend
  const fetchMessages = async () => {
    try {
      const response = await axiosInstance.get("community/messages");
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      setMessages([]);
    }
  };
   
  // Fetch reported items from the backend
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

  // Handle message send
  const sendMessage = async () => {
    if (message) {
      const newMessage = {
        text: message,
        createdAt: new Date().toISOString(),
        user: user
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

  // Handle report submission
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (report) {
      try {
        const newReport = {
          report: report,
          createdAt: new Date().toISOString(),
          username: user
        };
        const response = await axiosInstance.post("reports", newReport);
        setReportedItems([...reportedItems, response.data]);
        setReport("");
      } catch (error) {
        console.error("Error submitting report:", error);
      }
    }
  };

  // Count active users
  const activeUsersCount = messages.length > 0 ? new Set(messages.map(m => m.username)).size : 0;

  return (
    <Container fluid style={{ 
      padding: "20px", 
      backgroundColor: "#f8f9fa",
      minHeight: "100vh"
    }}>
      <Row style={{ gap: "16px" }}>
        {/* Left Column - Chat and Reports */}
        <Col lg={8} style={{ padding: 0 }}>
          <Card style={{ 
            height: "100%",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            borderRadius: "12px",
            border: "none"
          }}>
            <Card.Header style={{ 
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "white",
              borderBottom: "1px solid rgba(0,0,0,0.05)",
              padding: "20px"
            }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <h4 style={{ marginBottom: 0, fontWeight: "600" }}>
                  {activeTab === "chat" ? (
                    <>
                      <FaComment style={{ marginRight: "10px", color: "#4e73ff" }} />
                      Community Chat
                    </>
                  ) : (
                    <>
                      <FaExclamationCircle style={{ marginRight: "10px", color: "#e74a3b" }} />
                      Reported Issues
                    </>
                  )}
                </h4>
                <Badge pill bg="light" text="dark" style={{ 
                  marginLeft: "12px",
                  padding: "8px 12px",
                  fontWeight: "500",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                }}>
                  {activeTab === "chat" 
                    ? `${messages.length} messages • ${activeUsersCount} users` 
                    : `${reportedItems.length} reports`}
                </Badge>
              </div>
              <div>
                <Button 
                  variant={activeTab === "chat" ? "primary" : "outline-primary"} 
                  size="sm" 
                  style={{ 
                    marginRight: "8px",
                    borderRadius: "20px",
                    padding: "6px 16px",
                    fontWeight: "500",
                    borderWidth: "2px"
                  }}
                  onClick={() => setActiveTab("chat")}
                >
                  Chat
                </Button>
                <Button 
                  variant={activeTab === "reports" ? "danger" : "outline-danger"} 
                  size="sm"
                  style={{ 
                    borderRadius: "20px",
                    padding: "6px 16px",
                    fontWeight: "500",
                    borderWidth: "2px"
                  }}
                  onClick={() => setActiveTab("reports")}
                >
                  Reports
                </Button>
              </div>
            </Card.Header>
            
            <Card.Body style={{ 
              padding: 0,
              display: "flex",
              flexDirection: "column",
              height: "calc(100% - 72px)"
            }}>
              {/* Content Area */}
              <div style={{ 
                flexGrow: 1,
                overflow: "auto",
                padding: "20px",
                height: "400px"
              }}>
                {activeTab === "chat" ? (
                  <div style={{ 
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px"
                  }}>
                    {messages.length > 0 ? (
                      messages.map((msg, index) => (
                        <div key={index} style={{ 
                          display: "flex",
                          maxWidth: "80%",
                          alignSelf: msg.username === user ? "flex-end" : "flex-start",
                          flexDirection: msg.username === user ? "row-reverse" : "row"
                        }}>
                          <div style={{ margin: "0 12px" }}>
                            <img 
                              src={getAvatar(msg.username)} 
                              alt={msg.username} 
                              style={{
                                borderRadius: "50%",
                                width: "44px",
                                height: "44px",
                                objectFit: "cover",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                              }}
                            />
                          </div>
                          <div style={{ 
                            display: "flex",
                            flexDirection: "column",
                            alignItems: msg.username === user ? "flex-end" : "flex-start",
                            maxWidth: "calc(100% - 68px)"
                          }}>
                            <div style={{ 
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "6px"
                            }}>
                              <strong style={{ fontWeight: "500" }}>{msg.username === user ? "You" : msg.username}</strong>
                              <small style={{ 
                                color: "#6c757d",
                                marginLeft: "10px",
                                fontSize: "0.8rem"
                              }}>
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </small>
                            </div>
                            <div style={{ 
                              padding: "12px 16px",
                              borderRadius: "18px",
                              wordBreak: "break-word",
                              backgroundColor: msg.username === user ? "#4e73ff" : "#f1f3f6",
                              color: msg.username === user ? "white" : "#212529",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                              borderTopRightRadius: msg.username === user ? "4px" : "18px",
                              borderTopLeftRadius: msg.username === user ? "18px" : "4px"
                            }}>
                              {msg.text}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ 
                        textAlign: "center",
                        color: "#6c757d",
                        padding: "40px 0"
                      }}>
                        <FaComment size={32} style={{ opacity: 0.3, marginBottom: "12px" }} />
                        <h5 style={{ fontWeight: "500" }}>No messages yet</h5>
                        <p>Start the conversation!</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <ListGroup variant="flush">
                    {reportedItems.length > 0 ? (
                      reportedItems.map((item, index) => (
                        <ListGroup.Item key={index} style={{ 
                          padding: "16px 20px",
                          borderLeft: "none",
                          borderRight: "none",
                          borderBottom: "1px solid rgba(0,0,0,0.05)"
                        }}>
                          <div style={{ 
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start"
                          }}>
                            <div>
                              <p style={{ 
                                marginBottom: "6px",
                                fontWeight: "500"
                              }}>{item.report}</p>
                              <div style={{ display: "flex", alignItems: "center" }}>
                                <small style={{ 
                                  color: "#6c757d",
                                  display: "flex",
                                  alignItems: "center",
                                  marginRight: "12px"
                                }}>
                                  <FaUsers style={{ marginRight: "4px", fontSize: "0.8rem" }} />
                                  {item.username}
                                </small>
                                <small style={{ color: "#6c757d" }}>
                                  {new Date(item.createdAt).toLocaleDateString()}
                                </small>
                              </div>
                            </div>
                            <Badge pill bg="warning" text="dark" style={{ 
                              fontWeight: "500",
                              padding: "6px 12px"
                            }}>
                              Pending
                            </Badge>
                          </div>
                        </ListGroup.Item>
                      ))
                    ) : (
                      <div style={{ 
                        textAlign: "center",
                        color: "#6c757d",
                        padding: "40px 0"
                      }}>
                        <FaExclamationCircle size={32} style={{ opacity: 0.3, marginBottom: "12px" }} />
                        <h5 style={{ fontWeight: "500" }}>No reports found</h5>
                        <p>Be the first to report an issue</p>
                      </div>
                    )}
                  </ListGroup>
                )}
              </div>
              
              {/* Input Area */}
              {activeTab === "chat" ? (
                <div style={{ 
                  padding: "16px 20px",
                  borderTop: "1px solid rgba(0,0,0,0.05)",
                  backgroundColor: "#f8f9fa"
                }}>
                  <InputGroup>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message here..."
                      style={{ 
                        resize: "none",
                        borderRadius: "12px 0 0 12px",
                        border: "1px solid rgba(0,0,0,0.1)",
                        padding: "12px",
                        fontSize: "0.95rem"
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
                      disabled={!message}
                      style={{ 
                        borderRadius: "0 12px 12px 0",
                        padding: "0 20px"
                      }}
                    >
                      <IoMdSend size={18} />
                    </Button>
                  </InputGroup>
                </div>
              ) : (
                <div style={{ 
                  padding: "16px 20px",
                  borderTop: "1px solid rgba(0,0,0,0.05)",
                  backgroundColor: "#f8f9fa"
                }}>
                  <Form onSubmit={handleReportSubmit}>
                    <Form.Group>
                      <Form.Label style={{ 
                        fontSize: "0.9rem",
                        fontWeight: "500",
                        marginBottom: "8px",
                        color: "#495057"
                      }}>Report an Issue</Form.Label>
                      <InputGroup>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          value={report}
                          onChange={(e) => setReport(e.target.value)}
                          placeholder="Describe the issue you want to report..."
                          style={{ 
                            resize: "none",
                            borderRadius: "12px 0 0 12px",
                            border: "1px solid rgba(0,0,0,0.1)",
                            padding: "12px",
                            fontSize: "0.95rem"
                          }}
                        />
                        <Button 
                          variant="danger" 
                          type="submit"
                          disabled={!report}
                          style={{ 
                            borderRadius: "0 12px 12px 0",
                            padding: "0 20px"
                          }}
                        >
                          <FaExclamationCircle style={{ marginRight: "6px" }} />
                          Report
                        </Button>
                      </InputGroup>
                    </Form.Group>
                  </Form>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        {/* Right Column - Community Info */}
        <Col lg={4} style={{ padding: 0 }}>
          <Card style={{ 
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            borderRadius: "12px",
            border: "none",
            height: "100%"
          }}>
            <Card.Header style={{ 
              backgroundColor: "white",
              borderBottom: "1px solid rgba(0,0,0,0.05)",
              padding: "20px"
            }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <FaInfoCircle style={{ 
                  color: "#4e73ff", 
                  fontSize: "1.5rem",
                  marginRight: "12px"
                }} />
                <h4 style={{ 
                  marginBottom: 0,
                  fontWeight: "600"
                }}>Community Hub</h4>
              </div>
            </Card.Header>
            <Card.Body style={{ padding: "20px" }}>
              <div style={{ marginBottom: "24px" }}>
                <div style={{ 
                  display: "flex",
                  alignItems: "flex-start",
                  marginBottom: "20px"
                }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    backgroundColor: "rgba(78, 115, 255, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "16px",
                    flexShrink: 0
                  }}>
                    <FaUsers style={{ color: "#4e73ff", fontSize: "1.25rem" }} />
                  </div>
                  <div>
                    <h5 style={{ 
                      fontWeight: "600",
                      marginBottom: "8px",
                      fontSize: "1.1rem"
                    }}>About This Community</h5>
                    <p style={{ 
                      color: "#6c757d",
                      marginBottom: 0,
                      fontSize: "0.9rem",
                      lineHeight: "1.5"
                    }}>
                      Connect with neighbors to reunite lost items with their owners. 
                      This platform helps our community work together to solve lost & found cases.
                    </p>
                  </div>
                </div>

                <div style={{ 
                  display: "flex",
                  alignItems: "flex-start",
                  marginBottom: "20px"
                }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    backgroundColor: "rgba(78, 115, 255, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "16px",
                    flexShrink: 0
                  }}>
                    <FaRegLightbulb style={{ color: "#4e73ff", fontSize: "1.25rem" }} />
                  </div>
                  <div>
                    <h5 style={{ 
                      fontWeight: "600",
                      marginBottom: "8px",
                      fontSize: "1.1rem"
                    }}>Quick Tips</h5>
                    <p style={{ 
                      color: "#6c757d",
                      marginBottom: 0,
                      fontSize: "0.9rem",
                      lineHeight: "1.5"
                    }}>
                      Include specific details like locations, colors, and unique identifiers 
                      when posting about lost items.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h5 style={{ 
                  fontWeight: "600",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center"
                }}>
                  <FaExclamationCircle style={{ 
                    color: "#e74a3b",
                    marginRight: "12px",
                    fontSize: "1.25rem"
                  }} />
                  Community Guidelines
                </h5>
                <ListGroup variant="flush">
                  <ListGroup.Item style={{ 
                    display: "flex",
                    alignItems: "flex-start",
                    borderLeft: "none",
                    borderRight: "none",
                    padding: "12px 0",
                    backgroundColor: "transparent"
                  }}>
                    <div style={{ 
                      color: "#4e73ff",
                      fontWeight: "600",
                      marginRight: "12px",
                      fontSize: "1.1rem",
                      width: "24px",
                      textAlign: "center"
                    }}>1.</div>
                    <div>
                      <div style={{ fontWeight: "500", marginBottom: "4px" }}>Be Respectful</div>
                      <div style={{ 
                        color: "#6c757d",
                        fontSize: "0.9rem",
                        lineHeight: "1.5"
                      }}>Treat all members with kindness and respect in all interactions.</div>
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item style={{ 
                    display: "flex",
                    alignItems: "flex-start",
                    borderLeft: "none",
                    borderRight: "none",
                    padding: "12px 0",
                    backgroundColor: "transparent"
                  }}>
                    <div style={{ 
                      color: "#4e73ff",
                      fontWeight: "600",
                      marginRight: "12px",
                      fontSize: "1.1rem",
                      width: "24px",
                      textAlign: "center"
                    }}>2.</div>
                    <div>
                      <div style={{ fontWeight: "500", marginBottom: "4px" }}>Stay On Topic</div>
                      <div style={{ 
                        color: "#6c757d",
                        fontSize: "0.9rem",
                        lineHeight: "1.5"
                      }}>Keep discussions relevant to lost and found items in our community.</div>
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item style={{ 
                    display: "flex",
                    alignItems: "flex-start",
                    borderLeft: "none",
                    borderRight: "none",
                    padding: "12px 0",
                    backgroundColor: "transparent"
                  }}>
                    <div style={{ 
                      color: "#4e73ff",
                      fontWeight: "600",
                      marginRight: "12px",
                      fontSize: "1.1rem",
                      width: "24px",
                      textAlign: "center"
                    }}>3.</div>
                    <div>
                      <div style={{ fontWeight: "500", marginBottom: "4px" }}>Provide Details</div>
                      <div style={{ 
                        color: "#6c757d",
                        fontSize: "0.9rem",
                        lineHeight: "1.5"
                      }}>Include clear descriptions when reporting lost or found items.</div>
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item style={{ 
                    display: "flex",
                    alignItems: "flex-start",
                    borderLeft: "none",
                    borderRight: "none",
                    padding: "12px 0",
                    backgroundColor: "transparent"
                  }}>
                    <div style={{ 
                      color: "#4e73ff",
                      fontWeight: "600",
                      marginRight: "12px",
                      fontSize: "1.1rem",
                      width: "24px",
                      textAlign: "center"
                    }}>4.</div>
                    <div>
                      <div style={{ fontWeight: "500", marginBottom: "4px" }}>Privacy Matters</div>
                      <div style={{ 
                        color: "#6c757d",
                        fontSize: "0.9rem",
                        lineHeight: "1.5"
                      }}>Use private messages for sensitive information and personal details.</div>
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </div>

              <div style={{ 
                backgroundColor: "rgba(78, 115, 255, 0.05)",
                borderRadius: "12px",
                padding: "16px",
                marginTop: "24px"
              }}>
                <h6 style={{ 
                  fontWeight: "600",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "0.95rem"
                }}>
                  <FaRegLightbulb style={{ marginRight: "8px", color: "#4e73ff" }} />
                  Community Stats
                </h6>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ color: "#6c757d", fontSize: "0.9rem" }}>Active Members</span>
                  <span style={{ fontWeight: "500" }}>{activeUsersCount}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ color: "#6c757d", fontSize: "0.9rem" }}>Total Messages</span>
                  <span style={{ fontWeight: "500" }}>{messages.length}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#6c757d", fontSize: "0.9rem" }}>Active Reports</span>
                  <span style={{ fontWeight: "500" }}>{reportedItems.length}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CommunityChat;
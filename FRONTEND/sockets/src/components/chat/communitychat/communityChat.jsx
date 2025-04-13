import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, ListGroup, Card, Badge, InputGroup } from "react-bootstrap";
import { FaComment, FaExclamationCircle } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import axiosInstance from "../../../axiosInstance";
const user = localStorage.getItem("username");

const CommunityChat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [report, setReport] = useState("");
  const [reportedItems, setReportedItems] = useState([]);
  const [activeTab, setActiveTab] = useState("chat");

  // Get avatar or generate a default one based on username
  const getAvatar = (username) => {
    return `https://ui-avatars.com/api/?name=${username}&background=random`;
  };

  // Fetch chat messages from the backend
  const fetchMessages = async () => {
    try {
      const response = await axiosInstance.get("community/messages");
      setMessages(response.data);
      console.log(response.data);
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
    handleReportSubmit()
    
    
    const interval = setInterval(fetchMessages, 2000);
    const interval2= setInterval(fetchReportedItems, 2000)
    return () => {clearInterval(interval),clearInterval(interval2);};
    
  }, []);


  // Handle message send
  const sendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        _id: message.length + 1,
        text: message,
        createdAt: new Date().toISOString(),
        user: user
      };
      console.log(newMessage);
      
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
    if (report.trim()) {
      try {

        const newReport = {
         report: report,
          createdAt: new Date().toISOString(),
          username: user
        };
        const response = await axiosInstance.post("reports", { newReport });
        setReportedItems([...reportedItems, response.data]);
        setReport("");
      } catch (error) {
        console.error("Error submitting report:", error);
      }
    }
  };

  
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
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "12px",
            border: "none"
          }}>
            <Card.Header style={{ 
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "white",
              border: "none",
              padding: "15px 20px"
            }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <h4 style={{ marginBottom: 0 }}>
                  {activeTab === "chat" ? (
                    <>
                      <FaComment style={{ marginRight: "8px", color: "#007bff" }} />
                      Community Chat
                    </>
                  ) : (
                    <>
                      <FaExclamationCircle style={{ marginRight: "8px", color: "#dc3545" }} />
                      Reported Issues
                    </>
                  )}
                </h4>
                <Badge bg="light" text="dark" style={{ marginLeft: "8px" }}>
                  {activeTab === "chat" ? "mesages "+ messages.length + "  : "+ user.length+" Users": reportedItems.length}
                </Badge>
              </div>
              <div>
                <Button 
                  variant={activeTab === "chat" ? "primary" : "outline-primary"} 
                  size="sm" 
                  style={{ marginRight: "8px" }}
                  onClick={() => setActiveTab("chat")}
                >
                  Chat
                </Button>
                <Button 
                  variant={activeTab === "reports" ? "primary" : "outline-primary"} 
                  size="sm"
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
              height: "calc(100% - 56px)"
            }}>
              {/* Content Area */}
              <div style={{ 
                flexGrow: 1,
                overflow: "auto",
                padding: "12px",
                height: "400px"
              }}>
                {activeTab === "chat" ? (
                  <div style={{ 
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px"
                  }}>
                    {messages.length > 0 ? (
                      messages.map((msg, index) => (
                        <div key={index} style={{ 
                          display: "flex",
                          maxWidth: "80%",
                          alignSelf: msg.username === user ? "flex-end" : "flex-start",
                          flexDirection: msg.username=== user ? "row-reverse" : "row"
                        }}>
                          <div style={{ margin: "0 10px" }}>
                            <img 
                              src={getAvatar(msg.username)} 
                              alt={msg.username} 
                              style={{
                                borderRadius: "50%",
                                width: "40px",
                                height: "40px",
                                objectFit: "cover"
                              }}
                            />
                          </div>
                          <div style={{ 
                            display: "flex",
                            flexDirection: "column",
                            alignItems: msg.username === user ? "flex-end" : "flex-start"
                          }}>
                            <div style={{ 
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "5px"
                            }}>
                              <strong>{msg.username}</strong>
                              <small style={{ 
                                color: "#6c757d",
                                marginLeft: "8px"
                              }}>
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </small>
                            </div>
                            <div style={{ 
                              padding: "10px 15px",
                              borderRadius: "18px",
                              wordBreak: "break-word",
                              backgroundColor: msg.username=== user ? "#007bff" : "#f1f1f1",
                              color: msg.username === user ? "white" : "#333",
                              borderTopRightRadius: msg.username === user ? 0 : "18px",
                              borderTopLeftRadius: msg.username === user ? "18px" : 0
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
                        padding: "16px 0"
                      }}>
                        No messages found
                      </div>
                    )}
                  </div>
                ) : (
                  <ListGroup variant="flush">
                    {reportedItems.length > 0 ? (
                      reportedItems.map((item, index) => (
                        <ListGroup.Item key={index} style={{ 
                          padding: "12px 0",
                          borderLeft: "none",
                          borderRight: "none",
                          transition: "background-color 0.2s"
                        }}>
                          <div style={{ 
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start"
                          }}>
                            <div>
                              <p style={{ marginBottom: "4px" }}>{item.report}</p>
                              <small style={{ color: "#6c757d" }}>
                                Reported on {new Date(item.createdAt).toLocaleDateString()}
                              </small>
                            </div>
                           
                          </div>
                        </ListGroup.Item>
                      ))
                    ) : (
                      <div style={{ 
                        textAlign: "center",
                        color: "#6c757d",
                        padding: "16px 0"
                      }}>
                        No reports found
                      </div>
                    )}
                  </ListGroup>
                )}
              </div>
              
              {/* Input Area */}
              {activeTab === "chat" ? (
                <div style={{ 
                  padding: "12px",
                  borderTop: "1px solid #dee2e6"
                }}>
                  <InputGroup>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message here..."
                      style={{ 
                        resize: "none"
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
                    >
                      <IoMdSend />
                    </Button>
                  </InputGroup>
                </div>
              ) : (
                <div style={{ 
                  padding: "12px",
                  borderTop: "1px solid #dee2e6"
                }}>
                  <Form onSubmit={handleReportSubmit}>
                    <Form.Group>
                      <Form.Label>Report an Issue</Form.Label>
                      <InputGroup>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          value={report}
                          onChange={(e) => setReport(e.target.value)}
                          placeholder="Describe the issue you want to report..."
                          style={{ resize: "none" }}
                        />
                        <Button 
                          variant="danger" 
                          type="submit"
                          disabled={!report.trim()}
                        >
                          <FaExclamationCircle style={{ marginRight: "4px" }} />
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
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "12px",
            border: "none",
            height: "100%"
          }}>
            <Card.Header style={{ 
              backgroundColor: "white",
              border: "none",
              padding: "15px 20px"
            }}>
              <h5>Community Guidelines</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item style={{ 
                  display: "flex",
                  alignItems: "flex-start",
                  borderLeft: "none",
                  borderRight: "none"
                }}>
                  <div style={{ 
                    color: "#007bff",
                    marginRight: "8px"
                  }}>1.</div>
                  <div>Be respectful to all community members</div>
                </ListGroup.Item>
                <ListGroup.Item style={{ 
                  display: "flex",
                  alignItems: "flex-start",
                  borderLeft: "none",
                  borderRight: "none"
                }}>
                  <div style={{ 
                    color: "#007bff",
                    marginRight: "8px"
                  }}>2.</div>
                  <div>Keep discussions relevant to lost and found items</div>
                </ListGroup.Item>
                <ListGroup.Item style={{ 
                  display: "flex",
                  alignItems: "flex-start",
                  borderLeft: "none",
                  borderRight: "none"
                }}>
                  <div style={{ 
                    color: "#007bff",
                    marginRight: "8px"
                  }}>3.</div>
                  <div>Provide clear descriptions when reporting items</div>
                </ListGroup.Item>
                <ListGroup.Item style={{ 
                  display: "flex",
                  alignItems: "flex-start",
                  borderLeft: "none",
                  borderRight: "none"
                }}>
                  <div style={{ 
                    color: "#007bff",
                    marginRight: "8px"
                  }}>4.</div>
                  <div>Don't share personal information publicly</div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CommunityChat;
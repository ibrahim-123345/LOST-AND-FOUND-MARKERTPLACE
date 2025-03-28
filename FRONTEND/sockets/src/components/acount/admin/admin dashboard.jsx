import React, { useState, useEffect } from "react";
import { 
  Container, Card, Button, Table, Tabs, Tab, 
  Row, Col, Image, Form, Modal, Alert 
} from "react-bootstrap";
import { 
  FaUsers, FaBox, FaFlag, FaComments, 
  FaUserCog, FaEdit, FaKey, FaSignOutAlt,
  FaUserCircle, FaImage, FaTrash
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminDashboard = () => {
  const [key, setKey] = useState("users");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  
  const [adminProfile, setAdminProfile] = useState({
    name: "Admin User",
    email: "admin@example.com",
    avatar: "",
    role: "Super Admin"
  });
  
  // Mock data states with empty arrays initially
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [reports, setReports] = useState([]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      // Load mock data - you would replace this with actual API calls
      setUsers([
        { id: 1, name: "Admin User", email: "admin@example.com", role: "admin" },
        { id: 2, name: "Regular User", email: "user@example.com", role: "user" }
      ]);
      
      setItems([]); // Empty items for demonstration
      
      setReports([
        { id: 1, description: "Inappropriate content", reported_by: "user1", status: "Pending" }
      ]);
      
      setChats([]); // Empty chats for demonstration
      
      setLoading(false);
    }, 1000);
  }, []);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // In a real app, you would upload the avatarFile and update the profile
    if (avatarFile) {
      const newAvatarUrl = URL.createObjectURL(avatarFile);
      setAdminProfile({...adminProfile, avatar: newAvatarUrl});
    }
    setShowProfileModal(false);
    setAvatarPreview(null);
    setAvatarFile(null);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // Add password change logic here
    setShowPasswordModal(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
    setAdminProfile({...adminProfile, avatar: ""});
  };

  const renderEmptyState = (message) => (
    <Card>
      <Card.Body className="text-center py-5">
        <p className="text-muted mb-0">{message}</p>
      </Card.Body>
    </Card>
  );

  return (
    <Container className="py-4">
      {/* Admin Profile Section */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body className="p-4">
          <Row className="align-items-center">
            <Col md={2} className="text-center mb-3 mb-md-0">
              {adminProfile.avatar ? (
                <Image 
                  src={adminProfile.avatar} 
                  roundedCircle 
                  width={100} 
                  height={100} 
                  className="border object-fit-cover"
                  alt="Admin avatar"
                />
              ) : (
                <div className="d-flex justify-content-center align-items-center bg-light rounded-circle" 
                  style={{width: 100, height: 100}}>
                  <FaUserCircle size={60} className="text-secondary" />
                </div>
              )}
            </Col>
            <Col md={6} className="mb-3 mb-md-0">
              <h3 className="mb-2">{adminProfile.name}</h3>
              <p className="text-muted mb-1">
                <strong>Email:</strong> {adminProfile.email}
              </p>
              <p className="text-muted">
                <strong>Role:</strong> <span className="badge bg-primary">{adminProfile.role}</span>
              </p>
            </Col>
            <Col md={4} className="d-flex flex-column flex-md-row justify-content-md-end gap-2">
              <Button 
                variant="outline-primary" 
                className="text-nowrap"
                onClick={() => setShowProfileModal(true)}
              >
                <FaEdit className="me-1" /> Edit Profile
              </Button>
              <Button 
                variant="outline-secondary" 
                className="text-nowrap"
                onClick={() => setShowPasswordModal(true)}
              >
                <FaKey className="me-1" /> Change Password
              </Button>
              <Button variant="outline-danger" className="text-nowrap">
                <FaSignOutAlt className="me-1" /> Logout
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Dashboard Tabs */}
      <h2 className="mb-3">Dashboard</h2>
      <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
        <Tab eventKey="users" title={<><FaUsers className="me-1" /> Users</>}>
          {loading ? (
            <div className="text-center py-5">Loading users...</div>
          ) : users.length > 0 ? (
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <Table striped bordered hover responsive>
                  {/* Users table content */}
                </Table>
              </Card.Body>
            </Card>
          ) : (
            renderEmptyState("No users found")
          )}
        </Tab>
        <Tab eventKey="items" title={<><FaBox className="me-1" /> Items</>}>
          {loading ? (
            <div className="text-center py-5">Loading items...</div>
          ) : items.length > 0 ? (
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <Table striped bordered hover responsive>
                  {/* Items table content */}
                </Table>
              </Card.Body>
            </Card>
          ) : (
            renderEmptyState("No items found. Add your first item to get started.")
          )}
        </Tab>
        <Tab eventKey="reports" title={<><FaFlag className="me-1" /> Reports</>}>
          {loading ? (
            <div className="text-center py-5">Loading reports...</div>
          ) : reports.length > 0 ? (
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <Table striped bordered hover responsive>
                  {/* Reports table content */}
                </Table>
              </Card.Body>
            </Card>
          ) : (
            renderEmptyState("No reports to display. Everything looks good!")
          )}
        </Tab>
        <Tab eventKey="chats" title={<><FaComments className="me-1" /> Chats</>}>
          {loading ? (
            <div className="text-center py-5">Loading chats...</div>
          ) : chats.length > 0 ? (
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <Table striped bordered hover responsive>
                  {/* Chats table content */}
                </Table>
              </Card.Body>
            </Card>
          ) : (
            renderEmptyState("No active chat rooms")
          )}
        </Tab>
      </Tabs>

      {/* Edit Profile Modal */}
      <Modal show={showProfileModal} onHide={() => {
        setShowProfileModal(false);
        setAvatarPreview(null);
        setAvatarFile(null);
      }}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleProfileUpdate}>
          <Modal.Body>
            <Form.Group className="mb-4 text-center">
              <div className="position-relative d-inline-block">
                {avatarPreview || adminProfile.avatar ? (
                  <>
                    <Image 
                      src={avatarPreview || adminProfile.avatar} 
                      roundedCircle 
                      width={120} 
                      height={120} 
                      className="border object-fit-cover mb-2"
                      alt="Avatar preview"
                    />
                    <Button 
                      variant="danger" 
                      size="sm" 
                      className="position-absolute top-0 end-0 rounded-circle"
                      onClick={removeAvatar}
                    >
                      <FaTrash size={12} />
                    </Button>
                  </>
                ) : (
                  <div className="d-flex justify-content-center align-items-center bg-light rounded-circle mb-2" 
                    style={{width: 120, height: 120}}>
                    <FaUserCircle size={60} className="text-secondary" />
                  </div>
                )}
                <div>
                  <Form.Label 
                    htmlFor="avatarUpload" 
                    className="btn btn-sm btn-outline-primary mt-2"
                  >
                    <FaImage className="me-1" /> {avatarPreview ? "Change" : "Upload"} Avatar
                  </Form.Label>
                  <Form.Control 
                    type="file" 
                    id="avatarUpload" 
                    accept="image/*" 
                    className="d-none"
                    onChange={handleAvatarChange}
                  />
                </div>
              </div>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control 
                type="text" 
                value={adminProfile.name}
                onChange={(e) => setAdminProfile({...adminProfile, name: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                value={adminProfile.email}
                onChange={(e) => setAdminProfile({...adminProfile, email: e.target.value})}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => {
              setShowProfileModal(false);
              setAvatarPreview(null);
              setAvatarFile(null);
            }}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Change Password Modal */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handlePasswordChange}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Enter current password" 
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Enter new password" 
                minLength="8"
                required
              />
              <Form.Text className="text-muted">
                Password must be at least 8 characters long
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Confirm new password" 
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowPasswordModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Update Password
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
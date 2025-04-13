import React, { useState, useEffect } from "react";
import {
  Container, Card, Button, Table, Tabs, Tab,
  Row, Col, Image, Form, Modal, Badge
} from "react-bootstrap";
import {
  FaEdit, FaTrash, FaUserCircle,
  FaKey, FaPlus, FaBoxOpen, FaSearch,
  FaCalendarAlt, FaMapMarkerAlt
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../../../axiosInstance";
import moment from "moment";
import { Link } from "react-router-dom";
import useThemeStore from "../../store/colorStore";

const UserDashboard = () => {
  const username = localStorage.getItem("username");
  const isDarkMode = useThemeStore((state) => state.isDarkmode);

  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    avatar: "",
    joinDate: ""
  });

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "" });

  const userId = async () => {
    try {
      const response = await axiosInstance.get("/user/getuserBasedonToken");
      const user = response.data;
      const { user: [{ _id }] } = user;
      localStorage.setItem("userid", _id);
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get("/user/getuserBasedonToken");
        const data = await response.data;
        const { user: [user] } = data;
        const { username, email, createdAt } = user;
        setUserProfile({
          name: username,
          email: email,
          avatar: data.avatar || "",
          joinDate: moment(createdAt).format("MMMM Do YYYY")
        });
        setEditForm({ name: username, email: email });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
    userId();
  }, []);

  const [foundItems, setFoundItems] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [key, setKey] = useState("foundItems");
  const itemBasedOnUser = localStorage.getItem("userid");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const foundResponse = await axiosInstance.get(`/foundItemsByUser/${itemBasedOnUser}`);
        const foundData = foundResponse.data || {};
        setFoundItems(foundData);

        const lostResponse = await axiosInstance.get(`/lostItemsByUser/${itemBasedOnUser}`);
        const lostData = lostResponse.data || {};
        setLostItems(lostData);
      } catch (error) {
        console.error("Error fetching items:", error);
        setFoundItems([]);
        setLostItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [itemBasedOnUser]);

  const handleEditFound = (itemId) => console.log(`Editing found item: ${itemId}`);
  const handleDeleteFound = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this found item?")) {
      try {
        await axiosInstance.delete(`/found/delete/${itemId}`);
        setFoundItems(foundItems.filter(item => item._id !== itemId));
      } catch (error) {
        console.error("Error deleting found item:", error);
      }
    }
  };

  const handleEditLost = (itemId) => console.log(`Editing lost item: ${itemId}`);
  const handleDeleteLost = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this lost item?")) {
      try {
        await axiosInstance.delete(`/lost/delete/${itemId}`);
        setLostItems(lostItems.filter(item => item._id !== itemId));
      } catch (error) {
        console.error("Error deleting lost item:", error);
      }
    }
  };

  const renderEmptyState = (message, action, linkTo, icon) => {
    const IconComponent = icon;
    return (
      <Card className={`text-center border-0 shadow-sm ${isDarkMode ? "bg-dark-2 text-light" : "bg-light text-dark"}`}>
        <Card.Body className="py-5">
          <div className="empty-state-icon mb-4">
            <IconComponent size={60} className={`${isDarkMode ? "text-primary" : "text-secondary"}`} />
          </div>
          <h5 className="mb-4">{message}</h5>
          {action && (
            <Link to={linkTo}>
              <Button variant="primary" className="px-4 py-2 rounded-pill">
                <FaPlus className="me-2" /> {action}
              </Button>
            </Link>
          )}
        </Card.Body>
      </Card>
    );
  };

  const renderFoundItemsTable = () => (
    <div className="table-responsive">
      <Table hover className={`mb-0 ${isDarkMode ? "table-dark" : ""}`}>
        <thead className={`${isDarkMode ? "bg-dark-3" : "bg-light"}`}>
          <tr>
            <th>#</th>
            <th>Item</th>
            <th>Description</th>
            <th><FaCalendarAlt className="me-1" /> Date</th>
            <th><FaMapMarkerAlt className="me-1" /> Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {foundItems.map((item, index) => (
            <tr key={item._id}>
              <td>{index + 1}</td>
              <td>
                <div className="d-flex align-items-center">
                  {item.image ? (
                    <Image 
                      src={item.image} 
                      width={50} 
                      height={50} 
                      className="rounded me-3 object-fit-cover"
                    />
                  ) : (
                    <div className="me-3">
                      <FaBoxOpen size={24} className="text-muted" />
                    </div>
                  )}
                  <span className="fw-medium">{item.name}</span>
                </div>
              </td>
              <td>
                <div className="text-truncate" style={{ maxWidth: "200px" }}>
                  {item.description}
                </div>
              </td>
              <td>{moment(item.dateFound).format("MMM D, YYYY")}</td>
              <td>{item.location}</td>
              <td>
                <Badge 
                  bg={item.status === "claimed" ? "success" : "primary"}
                  className="px-3 py-2"
                >
                  {item.status}
                </Badge>
              </td>
              <td>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="me-2 rounded-circle"
                  onClick={() => handleEditFound(item._id)}
                >
                  <FaEdit />
                </Button>
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  className="rounded-circle"
                  onClick={() => handleDeleteFound(item._id)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );

  const renderLostItemsTable = () => (
    <div className="table-responsive">
      <Table hover className={`mb-0 ${isDarkMode ? "table-dark" : ""}`}>
        <thead className={`${isDarkMode ? "bg-dark-3" : "bg-light"}`}>
          <tr>
            <th>#</th>
            <th>Item</th>
            <th>Description</th>
            <th><FaCalendarAlt className="me-1" /> Date</th>
            <th><FaMapMarkerAlt className="me-1" /> Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {lostItems.map((item, index) => (
            <tr key={item._id}>
              <td>{index + 1}</td>
              <td className="fw-medium">{item.name}</td>
              <td>
                <div className="text-truncate" style={{ maxWidth: "200px" }}>
                  {item.description}
                </div>
              </td>
              <td>{moment(item.dateLost).format("MMM D, YYYY")}</td>
              <td>{item.location}</td>
              <td>
                <Badge 
                  bg={item.status === "found" ? "success" : "warning"}
                  className="px-3 py-2"
                >
                  {item.status}
                </Badge>
              </td>
              <td>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="me-2 rounded-circle"
                  onClick={() => handleEditLost(item._id)}
                >
                  <FaEdit />
                </Button>
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  className="rounded-circle"
                  onClick={() => handleDeleteLost(item._id)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );

  const handleProfileUpdate = () => {
    console.log("Updated Profile:", editForm);
    setShowProfileModal(false);
  };

  const handlePasswordUpdate = () => {
    console.log("Changing Password:", passwordForm);
    setShowPasswordModal(false);
  };

  return (
    <Container
      fluid
      className={`px-4 py-4 ${isDarkMode ? "bg-dark text-light" : "bg-light text-dark"}`}
      style={{ minHeight: "100vh" }}
    >
      {/* User Profile Header */}
      <Card className={`mb-4 border-0 shadow-sm ${isDarkMode ? "bg-dark-2" : "bg-white"}`}>
        <Card.Body className="p-4">
          <Row className="align-items-center">
            <Col md={2} className="text-center mb-3 mb-md-0">
              {userProfile.avatar ? (
                <Image
                  src={userProfile.avatar}
                  roundedCircle
                  width={100}
                  height={100}
                  className="border object-fit-cover"
                />
              ) : (
                <div className="d-flex justify-content-center align-items-center bg-light rounded-circle"
                  style={{ width: 100, height: 100 }}>
                  <FaUserCircle size={60} className="text-secondary" />
                </div>
              )}
            </Col>
            <Col md={6}>
              <h3 className="mb-2">{userProfile.name}</h3>
              <p className="text-muted mb-1"><strong>Email:</strong> {userProfile.email}</p>
              <p className="text-muted"><strong>Member Since:</strong> {userProfile.joinDate}</p>
            </Col>
            <Col md={4} className="d-flex flex-column flex-md-row justify-content-md-end gap-2">
              <Button 
                variant={isDarkMode ? "outline-light" : "outline-primary"} 
                onClick={() => setShowProfileModal(true)}
                className="d-flex align-items-center justify-content-center"
              >
                <FaEdit className="me-1" /> Edit Profile
              </Button>
              <Button 
                variant={isDarkMode ? "outline-light" : "outline-secondary"} 
                onClick={() => setShowPasswordModal(true)}
                className="d-flex align-items-center justify-content-center"
              >
                <FaKey className="me-1" /> Change Password
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Main Content Tabs */}
      <Tabs 
        activeKey={key} 
        onSelect={(k) => setKey(k)} 
        className="mb-4 custom-tabs"
      >
        <Tab 
          eventKey="foundItems" 
          title={
            <div className="d-flex align-items-center">
              <FaBoxOpen className="me-2" />
              <span>Found Items ({foundItems.length})</span>
            </div>
          }
        >
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : foundItems.length === 0 ? (
            renderEmptyState(
              "You haven't reported any found items yet",
              "Report Found Item",
              "/foundItemReport",
              FaBoxOpen
            )
          ) : (
            <Card className={`border-0 shadow-sm ${isDarkMode ? "bg-dark-2" : "bg-white"}`}>
              <Card.Body className="p-0">
                {renderFoundItemsTable()}
              </Card.Body>
            </Card>
          )}
        </Tab>

        <Tab 
          eventKey="lostItems" 
          title={
            <div className="d-flex align-items-center">
              <FaSearch className="me-2" />
              <span>Lost Items ({lostItems.length})</span>
            </div>
          }
        >
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : lostItems.length === 0 ? (
            renderEmptyState(
              "You haven't reported any lost items yet",
              "Report Lost Item",
              "/lost-itemsPost",
              FaSearch
            )
          ) : (
            <Card className={`border-0 shadow-sm ${isDarkMode ? "bg-dark-2" : "bg-white"}`}>
              <Card.Body className="p-0">
                {renderLostItemsTable()}
              </Card.Body>
            </Card>
          )}
        </Tab>
      </Tabs>

      {/* Profile Modal */}
      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} centered>
        <Modal.Header closeButton className={isDarkMode ? "bg-dark-3 text-light border-dark" : ""}>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDarkMode ? "bg-dark-2 text-light" : ""}>
          <Form>
            <Form.Group controlId="formUsername" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className={isDarkMode ? "bg-dark-3 text-light border-dark" : ""}
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className={isDarkMode ? "bg-dark-3 text-light border-dark" : ""}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className={isDarkMode ? "bg-dark-3 border-dark" : ""}>
          <Button variant="secondary" onClick={() => setShowProfileModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleProfileUpdate}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      {/* Password Modal */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered>
        <Modal.Header closeButton className={isDarkMode ? "bg-dark-3 text-light border-dark" : ""}>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDarkMode ? "bg-dark-2 text-light" : ""}>
          <Form>
            <Form.Group controlId="formOldPassword" className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordForm.oldPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                className={isDarkMode ? "bg-dark-3 text-light border-dark" : ""}
              />
            </Form.Group>
            <Form.Group controlId="formNewPassword" className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className={isDarkMode ? "bg-dark-3 text-light border-dark" : ""}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className={isDarkMode ? "bg-dark-3 border-dark" : ""}>
          <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handlePasswordUpdate}>Update Password</Button>
        </Modal.Footer>
      </Modal>

      {/* Custom CSS */}
      <style>{`
        .bg-dark-2 {
          background-color: #1a1a1a;
        }
        .bg-dark-3 {
          background-color: #2a2a2a;
        }
        .custom-tabs .nav-link {
          border: none;
          padding: 12px 20px;
          color: ${isDarkMode ? '#aaa' : '#6c757d'};
          font-weight: 500;
          transition: all 0.2s;
        }
        .custom-tabs .nav-link:hover {
          color: ${isDarkMode ? '#fff' : '#0d6efd'};
          background-color: ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'};
        }
        .custom-tabs .nav-link.active {
          color: ${isDarkMode ? '#fff' : '#0d6efd'};
          border-bottom: 3px solid ${isDarkMode ? '#fff' : '#0d6efd'};
          background-color: transparent;
        }
        .table th {
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.5px;
          padding: 12px 16px;
        }
        .table td {
          padding: 12px 16px;
          vertical-align: middle;
        }
        .btn-outline-primary {
          transition: all 0.2s;
        }
        .btn-outline-primary:hover {
          transform: translateY(-1px);
        }
        .rounded-circle {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </Container>
  );
};

export default UserDashboard;
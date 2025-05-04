import React, { useState, useEffect } from "react";
import {
  Container, Card, Button, Table, Tabs, Tab,
  Row, Col, Image, Form, Modal, Badge, Spinner,
  OverlayTrigger, Tooltip
} from "react-bootstrap";
import {
  FaEdit, FaTrash, FaUserCircle,
  FaKey, FaPlus, FaBoxOpen, FaSearch,
  FaCalendarAlt, FaMapMarkerAlt, FaUserCog,
  FaUserShield, FaPen, FaLock
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
        const { username, email, createdAt, profileImage } = user;
        setUserProfile({
          name: username,
          email: email,
          avatar: profileImage || "",
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
      <div className="text-center py-5">
        <div className={`empty-state-icon mb-4 p-4 rounded-circle d-inline-flex ${isDarkMode ? "bg-dark-3" : "bg-light"}`}>
          <IconComponent size={48} className={`${isDarkMode ? "text-primary" : "text-secondary"}`} />
        </div>
        <h4 className="mb-3">{message}</h4>
        {action && (
          <Link to={linkTo}>
            <Button 
              variant={isDarkMode ? "outline-light" : "primary"} 
              className="px-4 py-2 rounded-pill fw-medium"
            >
              <FaPlus className="me-2" /> {action}
            </Button>
          </Link>
        )}
      </div>
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
                <OverlayTrigger placement="top" overlay={<Tooltip>Edit Item</Tooltip>}>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="me-2 rounded-circle"
                    onClick={() => handleEditFound(item._id)}
                  >
                    <FaEdit />
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger placement="top" overlay={<Tooltip>Delete Item</Tooltip>}>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    className="rounded-circle"
                    onClick={() => handleDeleteFound(item._id)}
                  >
                    <FaTrash />
                  </Button>
                </OverlayTrigger>
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
                <OverlayTrigger placement="top" overlay={<Tooltip>Edit Item</Tooltip>}>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="me-2 rounded-circle"
                    onClick={() => handleEditLost(item._id)}
                  >
                    <FaEdit />
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger placement="top" overlay={<Tooltip>Delete Item</Tooltip>}>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    className="rounded-circle"
                    onClick={() => handleDeleteLost(item._id)}
                  >
                    <FaTrash />
                  </Button>
                </OverlayTrigger>
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
      className={`px-md-4 py-4 ${isDarkMode ? "bg-dark text-light" : "bg-light text-dark"}`}
      style={{ minHeight: "100vh" }}
    >
      {/* User Profile Header */}
      <Card className={`mb-4 border-0 shadow ${isDarkMode ? "bg-dark-2" : "bg-white"}`}>
        <Card.Body className="p-4">
          <Row className="align-items-center">
            <Col md={3} lg={2} className="text-center mb-4 mb-md-0">
              <div className="position-relative d-inline-block">
                {userProfile.avatar ? (
                  <Image
                    src={userProfile.avatar}
                    roundedCircle
                    width={180}
                    height={180}
                    className="border object-fit-cover shadow"
                    style={{ borderWidth: '4px', borderColor: isDarkMode ? '#444' : '#e9ecef' }}
                  />
                ) : (
                  <div 
                    className="d-flex justify-content-center align-items-center rounded-circle shadow"
                    style={{ 
                      width: 180, 
                      height: 180, 
                      backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f9fa',
                      border: `4px solid ${isDarkMode ? '#444' : '#e9ecef'}`
                    }}
                  >
                    <FaUserCircle size={100} className={isDarkMode ? "text-light" : "text-secondary"} />
                  </div>
                )}
                <OverlayTrigger placement="top" overlay={<Tooltip>Edit Profile</Tooltip>}>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="position-absolute bottom-0 end-0 rounded-circle p-2 shadow-sm"
                    onClick={() => setShowProfileModal(true)}
                    style={{ 
                      transform: 'translate(25%, 25%)',
                      width: '40px',
                      height: '40px'
                    }}
                  >
                    <FaUserCog size={18} />
                  </Button>
                </OverlayTrigger>
              </div>
            </Col>
            <Col md={6} lg={7}>
              <div className="d-flex flex-column">
                <h2 className="mb-3 fw-bold" style={{ fontSize: '1.8rem' }}>{userProfile.name}</h2>
                <div className="d-flex flex-wrap gap-3 mb-3">
                  <div className={`p-3 rounded-3 shadow-sm ${isDarkMode ? "bg-dark-3" : "bg-light"}`}>
                    <div className="text-muted small mb-1">Email Address</div>
                    <div className="fw-medium d-flex align-items-center">
                      <FaUserShield className="me-2 text-primary" />
                      {userProfile.email}
                    </div>
                  </div>
                  <div className={`p-3 rounded-3 shadow-sm ${isDarkMode ? "bg-dark-3" : "bg-light"}`}>
                    <div className="text-muted small mb-1">Member Since</div>
                    <div className="fw-medium d-flex align-items-center">
                      <FaCalendarAlt className="me-2 text-primary" />
                      {userProfile.joinDate}
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={3} lg={3} className="d-flex flex-column gap-3">
              <Button 
                variant={isDarkMode ? "outline-light" : "primary"} 
                onClick={() => setShowProfileModal(true)}
                className="d-flex align-items-center justify-content-center py-3 rounded-pill shadow-sm"
              >
                <FaPen className="me-2" /> Edit Profile
              </Button>
              <Button 
                variant={isDarkMode ? "outline-light" : "outline-primary"} 
                onClick={() => setShowPasswordModal(true)}
                className="d-flex align-items-center justify-content-center py-3 rounded-pill shadow-sm"
              >
                <FaLock className="me-2" /> Change Password
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Main Content Tabs */}
      <Card className={`border-0 shadow ${isDarkMode ? "bg-dark-2" : "bg-white"}`}>
        <Card.Body className="p-0">
          <Tabs 
            activeKey={key} 
            onSelect={(k) => setKey(k)} 
            className="px-3 pt-3 custom-tabs"
          >
            <Tab 
              eventKey="foundItems" 
              title={
                <div className="d-flex align-items-center px-3 py-2">
                  <FaBoxOpen className="me-2" />
                  <span>Found Items ({foundItems.length})</span>
                </div>
              }
            >
              <div className="p-3">
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Loading your found items...</p>
                  </div>
                ) : foundItems.length === 0 ? (
                  renderEmptyState(
                    "You haven't reported any found items yet",
                    "Report Found Item",
                    "/foundItemReport",
                    FaBoxOpen
                  )
                ) : (
                  renderFoundItemsTable()
                )}
              </div>
            </Tab>

            <Tab 
              eventKey="lostItems" 
              title={
                <div className="d-flex align-items-center px-3 py-2">
                  <FaSearch className="me-2" />
                  <span>Lost Items ({lostItems.length})</span>
                </div>
              }
            >
              <div className="p-3">
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Loading your lost items...</p>
                  </div>
                ) : lostItems.length === 0 ? (
                  renderEmptyState(
                    "You haven't reported any lost items yet",
                    "Report Lost Item",
                    "/lost-itemsPost",
                    FaSearch
                  )
                ) : (
                  renderLostItemsTable()
                )}
              </div>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

      {/* Profile Modal */}
      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} centered>
        <Modal.Header closeButton className={isDarkMode ? "bg-dark-3 text-light border-dark" : ""}>
          <Modal.Title>
            <FaUserCog className="me-2" />
            Edit Profile
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDarkMode ? "bg-dark-2 text-light" : ""}>
          <Form>
            <Form.Group controlId="formUsername" className="mb-4">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className={isDarkMode ? "bg-dark-3 text-light border-dark" : ""}
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mb-4">
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
          <Modal.Title>
            <FaLock className="me-2" />
            Change Password
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDarkMode ? "bg-dark-2 text-light" : ""}>
          <Form>
            <Form.Group controlId="formOldPassword" className="mb-4">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordForm.oldPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                className={isDarkMode ? "bg-dark-3 text-light border-dark" : ""}
              />
            </Form.Group>
            <Form.Group controlId="formNewPassword" className="mb-4">
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
          background-color: ${isDarkMode ? '#1e1e1e' : '#fff'};
        }
        .bg-dark-3 {
          background-color: ${isDarkMode ? '#2a2a2a' : '#f8f9fa'};
        }
        .custom-tabs .nav-link {
          border: none;
          padding: 0;
          margin-right: 8px;
          color: ${isDarkMode ? '#aaa' : '#6c757d'};
          font-weight: 500;
          transition: all 0.2s;
          border-radius: 8px 8px 0 0;
        }
        .custom-tabs .nav-link:hover {
          color: ${isDarkMode ? '#fff' : '#0d6efd'};
          background-color: ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'};
        }
        .custom-tabs .nav-link.active {
          color: ${isDarkMode ? '#fff' : '#0d6efd'};
          background-color: transparent;
          border-bottom: 3px solid ${isDarkMode ? '#fff' : '#0d6efd'};
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
          border-top: 1px solid ${isDarkMode ? '#2a2a2a' : '#dee2e6'};
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
        .object-fit-cover {
          object-fit: cover;
        }
      `}</style>
    </Container>
  );
};

export default UserDashboard;
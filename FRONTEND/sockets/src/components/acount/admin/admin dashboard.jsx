import React, { useState, useEffect } from "react";
import {
  Container, Card, Button, Table, Tabs, Tab,
  Row, Col, Image, Form, Modal, Badge
} from "react-bootstrap";
import {
  FaUsers, FaBox, FaUserCircle, FaTrash, FaBan, FaEdit, FaKey, FaSignOutAlt
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../../../axiosInstance";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [key, setKey] = useState("users");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [foundItems, setFoundItems] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [adminProfile, setAdminProfile] = useState({
    name: "Super User",
    email: "admin@gmail.com",
    avatar: "",
    role: "Admin",
  });
  const [previewImage, setPreviewImage] = useState(null);

  const fetchAdminProfile = async () => {
    try {
      const response = await axiosInstance.get("/user/getuserBasedonToken");
      const { user: [{ username, email, role }] } = response.data;
      setAdminProfile({
        name: username,
        email,
        avatar: "",
        role,
      });
    } catch (error) {
      console.error("Failed to fetch admin profile", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/user/Getuser");
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const fetchFoundItems = async () => {
    try {
      const response = await axiosInstance.get("/foundItems");
      setFoundItems(response.data);
    } catch (error) {
      console.error("Failed to fetch found items", error);
    }
  };

  const fetchLostItems = async () => {
    try {
      const response = await axiosInstance.get("/lostItem");
      setLostItems(response.data);
    } catch (error) {
      console.error("Failed to fetch lost items", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await fetchAdminProfile();
    await fetchUsers();
    await fetchFoundItems();
    await fetchLostItems();
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    if (avatarFile) {
      const newAvatarUrl = URL.createObjectURL(avatarFile);
      setAdminProfile({ ...adminProfile, avatar: newAvatarUrl });
    }
    setShowProfileModal(false);
    setAvatarPreview(null);
    setAvatarFile(null);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axiosInstance.delete(`/user/delete/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleDeleteFoundItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this found item?")) return;
    try {
      await axiosInstance.delete(`/items/found/${id}`);
      fetchFoundItems();
    } catch (error) {
      console.error("Failed to delete found item:", error);
    }
  };

  const handleDeleteLostItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lost item?")) return;
    try {
      await axiosInstance.delete(`/items/lost/${id}`);
      fetchLostItems();
    } catch (error) {
      console.error("Failed to delete lost item:", error);
    }
  };

  const renderEmptyState = (message) => (
    <Card className="border-0 shadow-sm">
      <Card.Body className="text-center py-5">
        <div className="empty-state-icon mb-3">
          <FaBox size={48} className="text-muted" />
        </div>
        <h5 className="text-muted mb-0">{message}</h5>
      </Card.Body>
    </Card>
  );

  const getRoleBadge = (role) => {
    switch (role) {
      case "Admin":
        return <Badge bg="primary" className="px-3 py-2">{role}</Badge>;
      case "User":
        return <Badge bg="success" className="px-3 py-2">{role}</Badge>;
      case "Moderator":
        return <Badge bg="warning" className="px-3 py-2 text-dark">{role}</Badge>;
      default:
        return <Badge bg="secondary" className="px-3 py-2">{role}</Badge>;
    }
  };

  return (
    <div className="admin-dashboard" style={{ backgroundColor: "#f8f9fa" }}>
      {/* Top Navigation */}
      <div className="admin-topnav">
        <div className="d-flex align-items-center">
          <h4 className="mb-0">
            {key === "users" && "User Management"}
            {key === "foundItems" && "Found Items"}
            {key === "lostItems" && "Lost Items"}
          </h4>
        </div>
        
        <div className="admin-profile-dropdown">
          <div className="d-flex align-items-center">
            {adminProfile.avatar ? (
              <Image
                src={adminProfile.avatar}
                roundedCircle
                width={40}
                height={40}
                className="border object-fit-cover me-2"
              />
            ) : (
              <div className="d-flex justify-content-center align-items-center bg-light rounded-circle me-2"
                style={{ width: 40, height: 40 }}>
                <FaUserCircle size={24} className="text-secondary" />
              </div>
            )}
            <div className="d-none d-md-block">
              <div className="fw-medium">{adminProfile.name}</div>
              <div className="small text-muted">{adminProfile.role}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="admin-main-content">
        {/* Main Content Area */}
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-0">
            <Tabs 
              activeKey={key} 
              onSelect={(k) => setKey(k)} 
              className="border-bottom-0 px-3 pt-3"
            >
              <Tab eventKey="users" title={<><FaUsers className="me-1" /> Users</>}>
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : users.length > 0 ? (
                  <div className="table-responsive">
                    <Table hover className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user, index) => (
                          <tr key={user._id}>
                            <td>{index + 1}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="avatar-sm me-2">
                                  {user.avatar ? (
                                    <Image
                                      src={user.avatar}
                                      roundedCircle
                                      width={36}
                                      height={36}
                                      className="border object-fit-cover"
                                    />
                                  ) : (
                                    <div className="d-flex justify-content-center align-items-center bg-light rounded-circle"
                                      style={{ width: 36, height: 36 }}>
                                      <FaUserCircle size={20} className="text-secondary" />
                                    </div>
                                  )}
                                </div>
                                <span>{user.username}</span>
                              </div>
                            </td>
                            <td>{user.email}</td>
                            <td>{getRoleBadge(user.role)}</td>
                            <td>
                              <Badge bg={user.status === "Active" ? "success" : "danger"}>
                                {user.status || "Active"}
                              </Badge>
                            </td>
                            <td>
                              {user.role === "Admin" ? (
                                <span className="text-muted">Admin privileges</span>
                              ) : (
                                <div className="d-flex">
                                  <Button 
                                    variant="outline-danger" 
                                    size="sm" 
                                    className="me-2" 
                                    onClick={() => handleDeleteUser(user._id)}
                                  >
                                    <FaTrash />
                                  </Button>
                                  <Button 
                                    variant="outline-warning" 
                                    size="sm"
                                    onClick={() => alert(`Block user logic for user ID: ${user._id}`)}
                                  >
                                    <FaBan />
                                  </Button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  renderEmptyState("No users found.")
                )}
              </Tab>

              <Tab eventKey="foundItems" title={<><FaBox className="me-1" /> Found Items</>}>
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : foundItems.length > 0 ? (
                  <div className="table-responsive">
                    <Table hover className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>#</th>
                          <th>Image</th>
                          <th>Item Name</th>
                          <th>Description</th>
                          <th>Location Found</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {foundItems.map((item, index) => (
                          <tr key={item._id}>
                            <td>{index + 1}</td>
                            <td>
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  width={60}
                                  height={60}
                                  rounded
                                  style={{ cursor: "pointer", objectFit: "cover" }}
                                  onClick={() => setPreviewImage(item.image)}
                                  className="shadow-sm"
                                />
                              ) : <span className="text-muted">No image</span>}
                            </td>
                            <td className="fw-medium">{item.name}</td>
                            <td>
                              <div className="text-truncate" style={{ maxWidth: "200px" }}>
                                {item.description}
                              </div>
                            </td>
                            <td>{item.location}</td>
                            <td>
                              <Badge bg={item.status === "Available" ? "success" : "warning"}>
                                {item.status || "Available"}
                              </Badge>
                            </td>
                            <td>
                              <div className="d-flex">
                                <Button 
                                  variant="outline-danger" 
                                  size="sm" 
                                  className="me-2" 
                                  onClick={() => handleDeleteFoundItem(item._id)}
                                >
                                  <FaTrash />
                                </Button>
                                <Button 
                                  variant="outline-warning" 
                                  size="sm"
                                  onClick={() => alert(`Block found item logic for item ID: ${item._id}`)}
                                >
                                  <FaBan />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  renderEmptyState("No found items available.")
                )}
              </Tab>

              <Tab eventKey="lostItems" title={<><FaBox className="me-1" /> Lost Items</>}>
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : lostItems.length > 0 ? (
                  <div className="table-responsive">
                    <Table hover className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>#</th>
                          <th>Image</th>
                          <th>Item Name</th>
                          <th>Description</th>
                          <th>Location Lost</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lostItems.map((item, index) => (
                          <tr key={item._id}>
                            <td>{index + 1}</td>
                            <td>
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  width={60}
                                  height={60}
                                  rounded
                                  style={{ cursor: "pointer", objectFit: "cover" }}
                                  onClick={() => setPreviewImage(item.image)}
                                  className="shadow-sm"
                                />
                              ) : <span className="text-muted">No image</span>}
                            </td>
                            <td className="fw-medium">{item.name}</td>
                            <td>
                              <div className="text-truncate" style={{ maxWidth: "200px" }}>
                                {item.description}
                              </div>
                            </td>
                            <td>{item.location}</td>
                            <td>
                              <Badge bg={item.status === "Missing" ? "danger" : "success"}>
                                {item.status || "Missing"}
                              </Badge>
                            </td>
                            <td>
                              <div className="d-flex">
                                <Button 
                                  variant="outline-danger" 
                                  size="sm" 
                                  className="me-2" 
                                  onClick={() => handleDeleteLostItem(item._id)}
                                >
                                  <FaTrash />
                                </Button>
                                <Button 
                                  variant="outline-warning" 
                                  size="sm"
                                  onClick={() => alert(`Block lost item logic for item ID: ${item._id}`)}
                                >
                                  <FaBan />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  renderEmptyState("No lost items available.")
                )}
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      </div>

      {/* Image Preview Modal */}
      <Modal show={!!previewImage} onHide={() => setPreviewImage(null)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0 d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
          <Image src={previewImage} fluid style={{ maxHeight: "70vh", objectFit: "contain" }} />
        </Modal.Body>
      </Modal>

      {/* Profile Modal */}
      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleProfileUpdate}>
            <div className="text-center mb-4">
              <div className="avatar-upload mb-3">
                {avatarPreview ? (
                  <Image
                    src={avatarPreview}
                    roundedCircle
                    width={120}
                    height={120}
                    className="border object-fit-cover"
                  />
                ) : adminProfile.avatar ? (
                  <Image
                    src={adminProfile.avatar}
                    roundedCircle
                    width={120}
                    height={120}
                    className="border object-fit-cover"
                  />
                ) : (
                  <div className="d-flex justify-content-center align-items-center bg-light rounded-circle mx-auto"
                    style={{ width: 120, height: 120 }}>
                    <FaUserCircle size={60} className="text-secondary" />
                  </div>
                )}
              </div>
              <div>
                <input
                  type="file"
                  id="avatar-upload"
                  className="d-none"
                  onChange={handleAvatarChange}
                  accept="image/*"
                />
                <label htmlFor="avatar-upload" className="btn btn-outline-primary">
                  Change Avatar
                </label>
              </div>
            </div>
            
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={adminProfile.name}
                onChange={(e) => setAdminProfile({...adminProfile, name: e.target.value})}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={adminProfile.email}
                onChange={(e) => setAdminProfile({...adminProfile, email: e.target.value})}
              />
            </Form.Group>
            
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowProfileModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Password Modal */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control type="password" placeholder="Enter current password" />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control type="password" placeholder="Enter new password" />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control type="password" placeholder="Confirm new password" />
            </Form.Group>
            
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowPasswordModal(false)}>
                Cancel
              </Button>
              <Button variant="primary">
                Update Password
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Add CSS */}
      <style>{`
        .admin-dashboard {
          display: flex;
          min-height: 100vh;
          flex-direction: column;
        }
        
        .admin-topnav {
          padding: 20px 30px;
          background: white;
          box-shadow: 0 2px 15px rgba(0,0,0,0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .admin-main-content {
          padding: 30px;
          flex: 1;
        }
        
        .table th {
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.5px;
          color: #6c757d;
          background-color: #f8f9fa;
          border-bottom-width: 1px;
        }
        
        .table td {
          vertical-align: middle;
          border-bottom: 1px solid #f1f1f1;
        }
        
        .table tr:hover td {
          background-color: #f9f9f9;
        }
        
        .avatar-upload {
          position: relative;
        }
        
        .avatar-upload label {
          cursor: pointer;
        }
        
        .empty-state-icon {
          opacity: 0.5;
        }
        
        .nav-tabs .nav-link {
          border: none;
          padding: 12px 20px;
          color: #6c757d;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .nav-tabs .nav-link:hover {
          color: #0d6efd;
        }
        
        .nav-tabs .nav-link.active {
          color: #0d6efd;
          border-bottom: 3px solid #0d6efd;
          background: transparent;
        }
        
        .badge {
          font-weight: 500;
          padding: 5px 10px;
          letter-spacing: 0.5px;
        }
        
        .card {
          border-radius: 10px;
          overflow: hidden;
          border: none;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }
        
        .btn-outline-danger {
          border-color: #dc3545;
          color: #dc3545;
        }
        
        .btn-outline-danger:hover {
          background-color: #dc3545;
          color: white;
        }
        
        .btn-outline-warning {
          border-color: #ffc107;
          color: #ffc107;
        }
        
        .btn-outline-warning:hover {
          background-color: #ffc107;
          color: #212529;
        }
        
        .admin-profile-dropdown {
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 8px;
          transition: all 0.2s;
        }
        
        .admin-profile-dropdown:hover {
          background-color: #f8f9fa;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
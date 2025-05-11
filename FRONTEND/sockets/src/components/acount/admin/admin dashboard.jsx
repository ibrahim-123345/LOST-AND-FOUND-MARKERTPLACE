import React, { useState, useEffect } from "react";
import {
  Card, Button, Table, Tabs, Tab,
  Row, Col, Image, Form, Modal, Badge, Alert,
  Dropdown, Spinner
} from "react-bootstrap";
import {
  FaUsers, FaBox, FaUserCircle, FaTrash, FaEdit, FaKey, 
  FaSignOutAlt, FaSearch, FaEllipsisV
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../../../axiosInstance";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [key, setKey] = useState("users");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
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
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    foundItems: 0,
    lostItems: 0
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const navigate = useNavigate();

  const fetchAdminProfile = async () => {
    try {
      const response = await axiosInstance.get("/user/getuserBasedonToken");
      const { user: [{ username, email, role, profileImage }] } = response.data;
      setAdminProfile({
        name: username,
        email: email,
        avatar: profileImage,
        role,
      });
    } catch (error) {
      console.error("Failed to fetch admin profile", error);
    }
  };

  const clickLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/user/Getuser");
      setUsers(response.data);
      setStats(prev => ({
        ...prev,
        totalUsers: response.data.length,
        activeUsers: response.data.filter(u => u.status === "Active").length
      }));
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const fetchFoundItems = async () => {
    try {
      const response = await axiosInstance.get("/foundItems");
      setFoundItems(response.data);
      setStats(prev => ({ ...prev, foundItems: response.data.length }));
    } catch (error) {
      console.error("Failed to fetch found items", error);
    }
  };

  const fetchLostItems = async () => {
    try {
      const response = await axiosInstance.get("/lostItem");
      setLostItems(response.data);
      setStats(prev => ({ ...prev, lostItems: response.data.length }));
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
      await axiosInstance.delete(`/found/delete/${id}`);
      fetchFoundItems();
    } catch (error) {
      console.error("Failed to delete found item:", error);
    }
  };

  const handleDeleteLostItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lost item?")) return;
    try {
      await axiosInstance.delete(`/lost/delete/${id}`);
      fetchLostItems();
    } catch (error) {
      console.error("Failed to delete lost item:", error);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }

    try {
      const username=adminProfile.name
      const oldPassword=passwordData.currentPassword
      const newPassword=passwordData.newPassword
      const response = await axiosInstance.post('/password/reset', {
        username,
        oldPassword,
        newPassword
      });

      if (response.data.success) {
        setPasswordSuccess(true);
        setTimeout(() => {
          localStorage.clear();
          navigate('/login');
        }, 2000);
      } else {
        setPasswordError(response.data.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Password change error:", error);
      setPasswordError(error.response?.data?.message || "Failed to change password");
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFoundItems = foundItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLostItems = lostItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );






  const handleEditFound = (itemId) => {
    
    window.confirm("Are you sure you want to edit this found item?")
        navigate(`/found-edit/${itemId}`);

  };




    const handleEditLost = (itemId) => {
      
    
    window.confirm("Are you sure you want to edit this found item?")
        navigate(`/lost-edit/${itemId}`);
    
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
        return <Badge bg="primary" className="px-3 py-2 fs-6">{role}</Badge>;
      case "User":
        return <Badge bg="success" className="px-3 py-2 fs-6">{role}</Badge>;
      case "Moderator":
        return <Badge bg="warning" className="px-3 py-2 text-dark fs-6">{role}</Badge>;
      default:
        return <Badge bg="secondary" className="px-3 py-2 fs-6">{role}</Badge>;
    }
  };

  const renderStatsCard = (title, value, icon, color) => (
    <Card className={`border-0 bg-${color}-subtle`}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="text-muted mb-2">{title}</h6>
            <h3 className="mb-0">{value}</h3>
          </div>
          <div className={`bg-${color} p-3 rounded-circle`}>
            {React.cloneElement(icon, { size: 24, className: "text-white" })}
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  const renderPasswordModal = () => (
    <Modal show={showPasswordModal} onHide={() => {
      setShowPasswordModal(false);
      setPasswordError('');
      setPasswordSuccess(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }} centered>
      <Modal.Header closeButton>
        <Modal.Title>Change Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {passwordSuccess ? (
          <Alert variant="success" className="text-center">
            <h5>Password Changed Successfully!</h5>
            <p>You will be redirected to login page shortly.</p>
          </Alert>
        ) : (
          <Form onSubmit={handlePasswordChange}>
            {passwordError && (
              <Alert variant="danger" className="mb-3">
                {passwordError}
              </Alert>
            )}
            
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Enter current password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value
                })}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Enter new password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value
                })}
                minLength="6"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Confirm new password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value
                })}
                minLength="6"
                required
              />
            </Form.Group>
            
            <div className="d-flex justify-content-end">
              <Button 
                variant="secondary" 
                className="me-2" 
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError('');
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Update Password
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );

  return (
    <div className="admin-dashboard">
      {/* Top Navigation */}
      <nav className="admin-topnav navbar navbar-expand">
        <div className="container-fluid">
          <h4 className="mb-0 fw-bold">
            {key === "users" && "User Management"}
            {key === "foundItems" && "Found Items"}
            {key === "lostItems" && "Lost Items"}
          </h4>
          
          <div className="d-flex align-items-center">
            <div className="input-group search-bar me-3">
              <span className="input-group-text bg-white border-end-0">
                <FaSearch className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Dropdown className="ms-3">
              <Dropdown.Toggle variant="light" className="d-flex align-items-center p-0 bg-transparent border-0">
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
                <span className="d-none d-md-inline fw-medium">{adminProfile.name}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-end shadow-sm">
                <Dropdown.Item onClick={() => setShowPasswordModal(true)}>
                  <FaKey className="me-2" /> Change Password
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={clickLogout}>
                  <FaSignOutAlt className="me-2" /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="admin-main-content">
        {/* Stats Overview */}
        {key === "users" && (
          <Row className="mb-4 g-4">
            <Col md={3}>
              {renderStatsCard("Total Users", stats.totalUsers, <FaUsers />, "primary")}
            </Col>
            <Col md={3}>
              {renderStatsCard("Active Users", stats.activeUsers, <FaUserCircle />, "success")}
            </Col>
            <Col md={3}>
              {renderStatsCard("Found Items", stats.foundItems, <FaBox />, "info")}
            </Col>
            <Col md={3}>
              {renderStatsCard("Lost Items", stats.lostItems, <FaBox />, "warning")}
            </Col>
          </Row>
        )}

        {/* Main Content Area */}
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-0">
            <Tabs 
              activeKey={key} 
              onSelect={(k) => setKey(k)} 
              className="border-bottom-0 px-3 pt-3"
              variant="pills"
            >
              <Tab eventKey="users" title={<><FaUsers className="me-1" /> Users</>}>
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Loading users...</p>
                  </div>
                ) : filteredUsers.length > 0 ? (
                  <div className="table-responsive">
                    <Table hover className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>#</th>
                          <th>User</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user, index) => (
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
                                <div>
                                  <span className="d-block fw-medium">{user.username}</span>
                                  <small className="text-muted">Joined: {new Date(user.createdAt).toLocaleDateString()}</small>
                                </div>
                              </div>
                            </td>
                            <td>{user.email}</td>
                            <td>{getRoleBadge(user.role)}</td>
                            <td>
                              <Badge bg={user.status === "Active" ? "success" : "danger"} className="fs-6">
                                {user.status || "Active"}
                              </Badge>
                            </td>
                            <td>
                              {user.role === "Admin" ? (
                                <span className="text-muted">Admin privileges</span>
                              ) : (
                                <Dropdown>
                                  <Dropdown.Toggle variant="light" size="sm" className="px-2">
                                    
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item onClick={()=>{}}>
                                      <FaEdit className="me-2" /> 
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleDeleteUser(user._id)} className="text-danger">
                                      <FaTrash className="me-2" /> Delete
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  renderEmptyState("No users found matching your search.")
                )}
              </Tab>

              <Tab eventKey="foundItems" title={<><FaBox className="me-1" /> Found Items</>}>
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Loading found items...</p>
                  </div>
                ) : filteredFoundItems.length > 0 ? (
                  <div className="table-responsive">
                    <Table hover className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>#</th>
                          <th>Image</th>
                          <th>Item Details</th>
                          <th>Location</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredFoundItems.map((item, index) => (
                          <tr key={item._id}>
                            <td>{index + 1}</td>
                            <td>
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  width={80}
                                  height={80}
                                  rounded
                                  style={{ cursor: "pointer", objectFit: "cover" }}
                                  onClick={() => setPreviewImage(item.image)}
                                  className="shadow-sm"
                                />
                              ) : <span className="text-muted">No image</span>}
                            </td>
                            <td>
                              <div className="fw-medium">{item.name}</div>
                              <div className="text-muted small text-truncate" style={{ maxWidth: "250px" }}>
                                {item.description}
                              </div>
                              <small className="text-muted">Found on: {new Date(item.date).toLocaleDateString()}</small>
                            </td>
                            <td>{item.location}</td>
                            <td>
                              <Badge bg={item.status === "Available" ? "success" : "warning"} className="fs-6">
                                {item.status || "Available"}
                              </Badge>
                            </td>
                            <td>
                              <Dropdown>
                                <Dropdown.Toggle variant="light" size="sm" className="px-2">
                                  <FaEllipsisV />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item onClick={() =>{
                                    handleEditFound(item._id)
                                  }}>
                                    <FaEdit className="me-2" /> Edit
                                  </Dropdown.Item>
                                  <Dropdown.Item onClick={() => handleDeleteFoundItem(item._id)} className="text-danger">
                                    <FaTrash className="me-2" /> Delete
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  renderEmptyState("No found items matching your search.")
                )}
              </Tab>

              <Tab eventKey="lostItems" title={<><FaBox className="me-1" /> Lost Items</>}>
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Loading lost items...</p>
                  </div>
                ) : filteredLostItems.length > 0 ? (
                  <div className="table-responsive">
                    <Table hover className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>#</th>
                          <th>Image</th>
                          <th>Item Details</th>
                          <th>Location</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLostItems.map((item, index) => (
                          <tr key={item._id}>
                            <td>{index + 1}</td>
                            <td>
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  width={80}
                                  height={80}
                                  rounded
                                  style={{ cursor: "pointer", objectFit: "cover" }}
                                  onClick={() => setPreviewImage(item.image)}
                                  className="shadow-sm"
                                />
                              ) : <span className="text-muted">No image</span>}
                            </td>
                            <td>
                              <div className="fw-medium">{item.name}</div>
                              <div className="text-muted small text-truncate" style={{ maxWidth: "250px" }}>
                                {item.description}
                              </div>
                              <small className="text-muted">Lost on: {new Date(item.date).toLocaleDateString()}</small>
                            </td>
                            <td>{item.location}</td>
                            <td>
                              <Badge bg={item.status === "Missing" ? "danger" : "success"} className="fs-6">
                                {item.status || "Missing"}
                              </Badge>
                            </td>
                            <td>
                              <Dropdown>
                                <Dropdown.Toggle variant="light" size="sm" className="px-2">
                                  <FaEllipsisV />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item onClick={() => {
                                    handleEditLost(item._id)
                                  }}>
                                    <FaEdit className="me-2" /> Edit
                                  </Dropdown.Item>
                                  <Dropdown.Item onClick={() => handleDeleteLostItem(item._id)} className="text-danger">
                                    <FaTrash className="me-2" /> Delete
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  renderEmptyState("No lost items matching your search.")
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

      {/* Password Change Modal */}
      {renderPasswordModal()}

      {/* CSS Styles */}
      <style>{`
        .admin-dashboard {
          display: flex;
          min-height: 100vh;
          flex-direction: column;
          background-color: #f5f7fb;
        }
        
        .admin-topnav {
          padding: 1rem 2rem;
          background: white;
          box-shadow: 0 2px 15px rgba(0,0,0,0.08);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .admin-main-content {
          padding: 2rem;
          flex: 1;
        }
        
        .nav-pills .nav-link.active {
          background-color: #0d6efd;
          color: white;
        }
        
        .nav-pills .nav-link {
          color: #495057;
          font-weight: 500;
          border-radius: 20px;
          padding: 0.5rem 1.25rem;
          margin-right: 0.5rem;
        }
        
        .table th {
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.5px;
          color: #6c757d;
          background-color: #f8f9fa;
          border-bottom-width: 1px;
          padding: 1rem;
        }
        
        .table td {
          vertical-align: middle;
          border-bottom: 1px solid #f1f1f1;
          padding: 1rem;
        }
        
        .table tr:hover td {
          background-color: rgba(13, 110, 253, 0.03);
        }
        
        .empty-state-icon {
          opacity: 0.5;
        }
        
        .badge {
          font-weight: 500;
          padding: 5px 10px;
          letter-spacing: 0.5px;
        }
        
        .card {
          border-radius: 12px;
          overflow: hidden;
          border: none;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }
        
        .search-bar {
          width: 250px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .search-bar .form-control {
          border-left: none;
          padding-left: 0;
        }
        
        .search-bar .input-group-text {
          border-right: none;
          background: white;
        }
        
        .dropdown-menu {
          border: none;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          border-radius: 10px;
          padding: 0.5rem;
        }
        
        .dropdown-item {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 500;
        }
        
        .dropdown-item:hover {
          background-color: #f8f9fa;
        }
        
        .bg-primary-subtle {
          background-color: rgba(13, 110, 253, 0.1) !important;
        }
        
        .bg-success-subtle {
          background-color: rgba(25, 135, 84, 0.1) !important;
        }
        
        .bg-info-subtle {
          background-color: rgba(13, 202, 240, 0.1) !important;
        }
        
        .bg-warning-subtle {
          background-color: rgba(255, 193, 7, 0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
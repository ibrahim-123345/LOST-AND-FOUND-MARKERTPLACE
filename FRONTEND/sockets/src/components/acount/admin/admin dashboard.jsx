import React, { useState, useEffect } from "react";
import {
  Container, Card, Button, Table, Tabs, Tab,
  Row, Col, Image, Form, Modal
} from "react-bootstrap";
import {
  FaUsers, FaBox, FaFlag, FaComments,
  FaUserCog, FaEdit, FaKey, FaSignOutAlt,
  FaUserCircle, FaTrash, FaBan, FaSearch
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../../../axiosInstance";
import { Link, useNavigate } from "react-router-dom";

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
    <Card>
      <Card.Body className="text-center py-5">
        <p className="text-muted mb-0">{message}</p>
      </Card.Body>
    </Card>
  );

  const getRoleBadge = (role) => {
    switch (role) {
      case "Admin":
        return <span className="badge bg-primary">{role}</span>;
      case "User":
        return <span className="badge bg-success">{role}</span>;
      case "Moderator":
        return <span className="badge bg-warning text-dark">{role}</span>;
      default:
        return <span className="badge bg-secondary">{role}</span>;
    }
  };

  return (
    <Container className="py-4">
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
                />
              ) : (
                <div className="d-flex justify-content-center align-items-center bg-light rounded-circle"
                  style={{ width: 100, height: 100 }}>
                  <FaUserCircle size={60} className="text-secondary" />
                </div>
              )}
            </Col>
            <Col md={6}>
              <h3 className="mb-2">{adminProfile.name}</h3>
              <p className="text-muted mb-1"><strong>Email:</strong> {adminProfile.email}</p>
              <p className="text-muted"><strong>Role:</strong> {getRoleBadge(adminProfile.role)}</p>
            </Col>
            <Col md={4} className="d-flex flex-column flex-md-row justify-content-md-end gap-2">
              <Button variant="outline-primary" onClick={() => setShowProfileModal(true)}><FaEdit className="me-1" /> Edit Profile</Button>
              <Button variant="outline-secondary" onClick={() => setShowPasswordModal(true)}><FaKey className="me-1" /> Change Password</Button>
              <Button as={Link} to="/logout" variant="outline-danger"><FaSignOutAlt className="me-1" /> Logout</Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <h2 className="mb-3">Admin Dashboard</h2>
      <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
        <Tab eventKey="users" title={<><FaUsers className="me-1" /> Users</>}>
          {loading ? (
            <div className="text-center py-5">Loading users...</div>
          ) : users.length > 0 ? (
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <Table striped bordered hover responsive>
                  <thead>
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
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{getRoleBadge(user.role)}</td>
                        <td>{user.status || "Active"}</td>
                        <td>
                          {user.role === "Admin" ? (
                            <span className="text-muted">Admin can't be deleted or blocked</span>
                          ) : (
                            <>
                              <Button variant="danger" size="sm" className="me-2" onClick={() => handleDeleteUser(user._id)}>
                                <FaTrash /> Delete
                              </Button>
                              <Button variant="warning" size="sm" onClick={() => alert(`Block user logic for user ID: ${user._id}`)}>
                                <FaBan /> Block
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          ) : (
            renderEmptyState("No users found.")
          )}
        </Tab>

        <Tab eventKey="foundItems" title={<><FaBox className="me-1" /> Found Items</>}>
          {loading ? (
            <div className="text-center py-5">Loading found items...</div>
          ) : foundItems.length > 0 ? (
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <Table striped bordered hover responsive>
                  <thead>
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
                            />
                          ) : <span className="text-muted">No image</span>}
                        </td>
                        <td>{item.name}</td>
                        <td>{item.description}</td>
                        <td>{item.location}</td>
                        <td>{item.status || "Available"}</td>
                        <td>
                          <Button variant="danger" size="sm" className="me-2" onClick={() => handleDeleteFoundItem(item._id)}>
                            <FaTrash /> Delete
                          </Button>
                          <Button variant="warning" size="sm" onClick={() => alert(`Block found item logic for item ID: ${item._id}`)}>
                            <FaBan /> Block
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          ) : (
            renderEmptyState("No found items available.")
          )}
        </Tab>

        <Tab eventKey="lostItems" title={<><FaBox className="me-1" /> Lost Items</>}>
          {loading ? (
            <div className="text-center py-5">Loading lost items...</div>
          ) : lostItems.length > 0 ? (
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <Table striped bordered hover responsive>
                  <thead>
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
                            />
                          ) : <span className="text-muted">No image</span>}
                        </td>
                        <td>{item.name}</td>
                        <td>{item.description}</td>
                        <td>{item.location}</td>
                        <td>{item.status || "Missing"}</td>
                        <td>
                          <Button variant="danger" size="sm" className="me-2" onClick={() => handleDeleteLostItem(item._id)}>
                            <FaTrash /> Delete
                          </Button>
                          <Button variant="warning" size="sm" onClick={() => alert(`Block lost item logic for item ID: ${item._id}`)}>
                            <FaBan /> Block
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          ) : (
            renderEmptyState("No lost items available.")
          )}
        </Tab>
      </Tabs>

      {/* Image Preview Modal */}
      <Modal show={!!previewImage} onHide={() => setPreviewImage(null)} centered size="lg">
        <Modal.Body className="p-0">
          <Image src={previewImage} fluid style={{ width: "100%", objectFit: "contain" }} />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;

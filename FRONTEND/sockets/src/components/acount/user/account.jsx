import React, { useState, useEffect } from "react";
import {
  Container, Card, Button, Table, Tabs, Tab,
  Row, Col, Image, Form, Modal
} from "react-bootstrap";
import {
  FaEdit, FaTrash, FaUserCircle,
  FaKey, FaPlus, FaBoxOpen, FaSearch
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

  const renderFoundEmptyState = (message, action, linkTo) => (
    <Card className={`text-center border-0 shadow-sm ${isDarkMode ? "bg-secondary text-light" : "bg-light text-dark"}`}>
      <Card.Body className="py-5">
        <FaBoxOpen size={60} className="text-muted mb-3" />
        <p className="fs-5 mb-4">{message}</p>
        {action && (
          <Link to={linkTo}>
            <Button variant="primary" className="px-4 py-2">
              <FaPlus className="me-2" /> {action}
            </Button>
          </Link>
        )}
      </Card.Body>
    </Card>
  );

  const renderLostEmptyState = (message, action, linkTo) => (
    <Card className={`text-center border-0 shadow-sm ${isDarkMode ? "bg-secondary text-light" : "bg-light text-dark"}`}>
      <Card.Body className="py-5">
        <FaSearch size={60} className="text-muted mb-3" />
        <p className="fs-5 mb-4">{message}</p>
        {action && (
          <Link to={linkTo}>
            <Button variant="primary" className="px-4 py-2">
              <FaPlus className="me-2" /> {action}
            </Button>
          </Link>
        )}
      </Card.Body>
    </Card>
  );

  const renderFoundItemsTable = () => (
    <Table responsive bordered hover className={`shadow-sm ${isDarkMode ? "table-dark" : "table-light"}`}>
      <thead className="table-primary">
        <tr>
          <th>#</th>
          <th>Image</th>
          <th>Item</th>
          <th>Description</th>
          <th>Date</th>
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
                <Image src={item.image} width={80} height={80} className="rounded" />
              ) : (
                <FaUserCircle size={50} className="text-muted" />
              )}
            </td>
            <td>{item.name}</td>
            <td>{item.description}</td>
            <td>{moment(item.dateFound).format("MMMM Do YYYY")}</td>
            <td>{item.status}</td>
            <td>
              <Button variant="outline-success" size="sm" className="me-2" onClick={() => handleEditFound(item._id)}>
                <FaEdit />
              </Button>
              <Button variant="outline-danger" size="sm" onClick={() => handleDeleteFound(item._id)}>
                <FaTrash />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderLostItemsTable = () => (
    <Table responsive bordered hover className={`shadow-sm ${isDarkMode ? "table-dark" : "table-light"}`}>
      <thead className="table-primary">
        <tr>
          <th>#</th>
          <th>Item</th>
          <th>Description</th>
          <th>Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {lostItems.map((item, index) => (
          <tr key={item._id}>
            <td>{index + 1}</td>
            <td>{item.name}</td>
            <td>{item.description}</td>
            <td>{moment(item.dateLost).format("MMMM Do YYYY")}</td>
            <td>{item.status}</td>
            <td>
              <Button variant="outline-success" size="sm" className="me-2" onClick={() => handleEditLost(item._id)}>
                <FaEdit />
              </Button>
              <Button variant="outline-danger" size="sm" onClick={() => handleDeleteLost(item._id)}>
                <FaTrash />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
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
      className={`py-4 ${isDarkMode ? "bg-dark text-light" : "bg-light text-dark"}`}
      style={{ minHeight: "100vh" }}
    >
      <Row className="justify-content-between align-items-start mb-4">
        <Col xs={12} md="auto" className="text-md-end text-center">
          {userProfile.avatar ? (
            <Image src={userProfile.avatar} roundedCircle width={80} height={80} />
          ) : (
            <FaUserCircle size={80} className="text-muted" />
          )}
          <h5 className="mt-2 fw-bold">{userProfile.name}</h5>
          <p className="mb-1 text-muted">{userProfile.email}</p>
          <small className="text-muted">Joined At: {userProfile.joinDate}</small>
        </Col>
        <Col xs={12} md="auto" className="d-flex flex-column align-items-start gap-2 mt-3 mt-md-0">
          <Button variant="outline-primary" onClick={() => setShowProfileModal(true)}>
            <FaEdit className="me-1" /> Edit Profile
          </Button>
          <Button variant="outline-secondary" onClick={() => setShowPasswordModal(true)}>
            <FaKey className="me-1" /> Change Password
          </Button>
        </Col>
      </Row>

      <Tabs activeKey={key} onSelect={(k) => setKey(k)} id="user-dashboard-tabs" className="mb-3">
        <Tab eventKey="foundItems" title={<><FaBoxOpen className="me-2" />Found Items</>}>
          {loading ? (
            <p className="text-center py-4">Loading...</p>
          ) : foundItems.length === 0 ? (
            renderFoundEmptyState("Seems like you're not lucky yet", "Add Item You've Found", "/foundItemReport")
          ) : (
            renderFoundItemsTable()
          )}
        </Tab>

        <Tab eventKey="lostItems" title={<><FaSearch className="me-2" />Lost Items</>}>
          {loading ? (
            <p className="text-center py-4">Loading...</p>
          ) : lostItems.length === 0 ? (
            renderLostEmptyState("Seems like you've never lost anything", "Want to Add Item?", "/lost-itemsPost")
          ) : (
            renderLostItemsTable()
          )}
        </Tab>
      </Tabs>

      {/* Profile Modal */}
      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUsername" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProfileModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleProfileUpdate}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      {/* Password Modal */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formOldPassword" className="mb-3">
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordForm.oldPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formNewPassword" className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handlePasswordUpdate}>Update Password</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserDashboard;

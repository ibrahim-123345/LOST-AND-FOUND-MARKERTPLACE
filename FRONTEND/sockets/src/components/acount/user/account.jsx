import React, { useState, useEffect } from "react";
import {
  Container, Card, Button, Table, Tabs, Tab,
  Row, Col, Image, Form, Modal
} from "react-bootstrap";
import {
  FaEdit, FaTrash, FaUserCircle,
  FaKey, FaPlus
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../../../axiosInstance";
import moment from "moment";
import LostItem from "../../lostitems/lostItemUpload";
import { Link } from "react-router-dom"





const UserDashboard = () => {
  const username = localStorage.getItem("username");
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    avatar: "",
    joinDate: ""
  });

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(true);




  const userId = async () => {
    try {
      const response = await axiosInstance.get("/user/getuserBasedonToken");
      const user = response.data;
      const { message, user: [{ _id }] } = user;

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
        const { message, user: [user] } = data;
        const { username, email, createdAt } = user;
        setUserProfile({
          name: username,
          email: email,
          avatar: data.avatar || "",
          joinDate: moment(createdAt).format("MMMM Do YYYY")
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile(),
      userId();
  }, []);




  const [foundItems, setFoundItems] = useState({});
  const [lostItems, setLostItems] = useState([]);
  const [key, setKey] = useState("foundItems");
  const itemBasedOnUser = localStorage.getItem("userid")
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const foundResponse = await axiosInstance.get(`/foundItemsByUser/${itemBasedOnUser}`);
       // const lostResponse = await axiosInstance.get(`/lostItemsByUser/${itemBasedOnUser}`);

        const foundDataObj = foundResponse.data.foundItems || {};
       // const lostDataObj = lostResponse.data.lostItems || {};

        // Convert objects to arrays
        const foundItemsArray = Object.values(foundDataObj);
        //const lostItemsArray = Object.values(lostDataObj);
        //console.log(foundItemsArray, lostItemsArray)

        setFoundItems(foundItemsArray);
        //setLostItems(lostItemsArray);
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

  const handleEditFound = (itemId) => {
    console.log(`Editing found item: ${itemId}`);
  };

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

  const handleEditLost = (itemId) => {
    console.log(`Editing lost item: ${itemId}`);
  };

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

 const renderEmptyState = (message, action, linkTo) => (
  <Card className="border-0 shadow-sm">
    <Card.Body className="text-center py-5">
      <p className="text-muted mb-3">{message}</p>
      {action && (
        <Link to="/lost-itemsPost">
          <Button variant="primary">
            <FaPlus className="me-1" /> {action}
          </Button>
        </Link>
      )}
    </Card.Body>
  </Card>
);


  const renderFoundItemsTable = () => (
    <Table responsive bordered hover>
      <thead>
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
              <Button
                variant="outline-success"
                size="sm"
                className="me-2"
                onClick={() => handleEditFound(item._id)}
              >
                <FaEdit />
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleDeleteFound(item._id)}
              >
                <FaTrash />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderLostItemsTable = () => (
    <Table responsive bordered hover>
      <thead>
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
        {lostItems.map((item, index) => (
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
            <td>{moment(item.dateLost).format("MMMM Do YYYY")}</td>
            <td>{item.status}</td>
            <td>
              <Button
                variant="outline-success"
                size="sm"
                className="me-2"
                onClick={() => handleEditLost(item._id)}
              >
                <FaEdit />
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleDeleteLost(item._id)}
              >
                <FaTrash />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const handleProfileSave = () => {
    setShowProfileModal(false);
  };

  const handlePasswordSave = async () => {
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;


    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      await axiosInstance.post("/password/reset", { username, oldPassword, newPassword });
      alert("Password has been reset successfully.");
      setShowPasswordModal(false);
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("There was an error resetting your password.");
    }
  };

  return (
    <Container className="py-4">
      {/* Profile Section */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row className="align-items-center">
            <Col xs="auto">
              {userProfile.avatar ? (
                <Image src={userProfile.avatar} roundedCircle width={80} height={80} />
              ) : (
                <FaUserCircle size={80} className="text-muted" />
              )}
            </Col>
            <Col>
              <h5>{userProfile.name}</h5>
              <p className="mb-0 text-muted">{userProfile.email}</p>
              <small>Joined At: {userProfile.joinDate}</small>
            </Col>
            <Col xs="auto">
              <Button variant="outline-primary" className="me-2" onClick={() => setShowProfileModal(true)}>
                <FaEdit className="me-1" /> Edit Profile
              </Button>
              <Button variant="outline-secondary" onClick={() => setShowPasswordModal(true)}>
                <FaKey className="me-1" /> Change Password
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Profile Modal */}
      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" defaultValue={userProfile.name} />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" defaultValue={userProfile.email} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleProfileSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Password Reset Modal */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="oldPassword">
              <Form.Label>Old Password</Form.Label>
              <Form.Control type="password" placeholder="Enter old password" />
            </Form.Group>
            <Form.Group controlId="newPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control type="password" placeholder="Enter new password" />
            </Form.Group>
            <Form.Group controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" placeholder="Confirm new password" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePasswordSave}>
            Reset Password
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Lost and Found Items */}
      <Tabs activeKey={key} onSelect={(k) => setKey(k)} id="user-dashboard-tabs">
        <Tab eventKey="foundItems" title="Found Items">
          {loading ? (
            <p>Loading...</p>
          ) : foundItems.length === 0 ? (
            renderEmptyState("Seems like you're not lucky yet", "Add Item You've Found")
          ) : (
            renderFoundItemsTable()
          )}
        </Tab>
        <Tab eventKey="lostItems" title="Lost Items">
          {loading ? (
            <p>Loading...</p>
          ) : lostItems.length === 0 ? (
            renderEmptyState("Seems like you've never lost anything", "Want to Add Item?")
          ) : (
            renderLostItemsTable()
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default UserDashboard;

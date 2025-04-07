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
import { Link } from "react-router-dom";

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
        console.log(foundData);
        const lostResponse = await axiosInstance.get(`/lostItemsByUser/${itemBasedOnUser}`);
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

  const renderEmptyState = (message, action, linkTo) => (
    <Card className="text-center border-0 shadow-sm bg-light">
      <Card.Body className="py-5">
        <p className="text-muted fs-5 mb-4">{message}</p>
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
    <Table responsive bordered hover className="bg-white shadow-sm">
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
  
  return (
    <Container className="py-4">
      <Card className="mb-4 shadow-sm bg-white">
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
              <h5 className="mb-1 fw-bold">{userProfile.name}</h5>
              <p className="mb-0 text-muted">{userProfile.email}</p>
              <small className="text-muted">Joined At: {userProfile.joinDate}</small>
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

      <Tabs activeKey={key} onSelect={(k) => setKey(k)} id="user-dashboard-tabs" className="mb-3">
        <Tab eventKey="foundItems" title="Found Items">
          {loading ? (
            <p className="text-center py-4">Loading...</p>
          ) : !foundItems._id ? (
            renderEmptyState("Seems like you're not lucky yet", "Add Item You've Found", "/found-itemsPost")
          ) : (
            renderFoundItemsTable()
          )}
        </Tab>
        <Tab eventKey="lostItems" title="Lost Items">
          {loading ? (
            <p className="text-center py-4">Loading...</p>
          ) : lostItems.length === 0 ? (
            renderEmptyState("Seems like you've never lost anything", "Want to Add Item?", "/foundItemReport")
          ) : (
            renderLostItemsTable()
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default UserDashboard;

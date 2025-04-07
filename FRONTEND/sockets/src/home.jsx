import React, { useState, useEffect } from "react";
import { Container, Button, Card, Row, Col, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaHome, FaSearch, FaPlus, FaBoxOpen, FaComments, FaSignInAlt, FaSignOutAlt, FaMoon, FaSun, FaUserCircle } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import moment from "moment";
import useThemeStore from "./components/store/colorStore";
import isTokenExpired from "./components/login/decodeToken";
import AdminDashboard from "./components/acount/admin/admin dashboard";

const HomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [foundItems, setFoundItems] = useState([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const token = localStorage.getItem("token");
  const navigate = useNavigate(); // Hook to programmatically navigate

  const [role, setRole] = useState(null);

  useEffect(() => {
    fetchFoundItems();
    
    if (isTokenExpired(token)) {
      console.log("Token has expired. Logging out...");
      localStorage.removeItem("token");
    } else if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
      setRole(decodedToken.role); // Assuming token contains role in decoded payload
    }
  }, []);

  const fetchFoundItems = async () => {
    try {
      const response = await axios.get("http://localhost:7000/foundItem");
      setFoundItems(response.data || []);
    } catch (error) {
      console.error("Error fetching found items:", error);
    }
  };

  const handleViewDetails = (item) => {
    if (token) {
      window.location.href = `/foundid/${item._id}`;
    } else {
      setSelectedItem(item);
      setShowLoginPrompt(true);
    }
  };

  const handleAccountClick = () => {
    if (role === "Admin") {
      navigate("/admin/dashboard"); // Redirect to Admin Dashboard
    } else {
      navigate("/user/account"); // Redirect to User Account page
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: isDarkMode ? "#333" : "#f4f1e1", color: isDarkMode ? "#f4f1e1" : "#333" }}>
      {/* Sidebar */}
      <div style={{ width: sidebarOpen ? "270px" : "160px", background: isDarkMode ? "#1b1b1b" : "#007bff", color: "#fff", height: "100vh", transition: "0.3s", paddingTop: "20px", position: "fixed", display: "flex", flexDirection: "column", alignItems: "center", top: 0, left: 0 }}>
        <Button variant="link" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ color: "white", fontSize: "32px" }}>
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </Button>
        <nav style={{ marginTop: "40px", width: "100%" }}>
          {[{ to: "/", icon: <FaHome />, label: "Home" }].concat(
            token
              ? [
                  { to: "/founditems", icon: <FaSearch />, label: "Found Items" },
                  { to: "/lostitems", icon: <FaBoxOpen />, label: "Lost items" },
                  { to: "/lost-items", icon: <FaPlus />, label: "Report Item Lost" },
                  { to: "/communitychat", icon: <FaComments />, label: "Community Chat" },
                  { to: "/logout", icon: <FaSignOutAlt />, label: "Logout" },
                  { to: "/user", icon: <FaUserCircle />, label: "Account", onClick: handleAccountClick }, // Updated to handle click
                ]
              : [{ to: "/login", icon: <FaSignInAlt />, label: "Login" }]
          ).map(({ to, icon, label, onClick }, index) => (
            <Link key={index} to={to} onClick={onClick} className="nav-link sidebar-item" style={{ display: "flex", alignItems: "center", gap: sidebarOpen ? "20px" : "0", fontSize: "18px", padding: "15px 10px", color: "white", transition: "0.3s", textDecoration: "none" }}>
              {sidebarOpen && <span style={{ fontSize: "24px" }}>{icon}</span>}
              {sidebarOpen && label}
            </Link>
          ))}
        </nav>
        <Button variant="link" onClick={toggleDarkMode} style={{ color: "white", fontSize: "24px", marginTop: "20px" }}>
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </Button>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: sidebarOpen ? "280px" : "90px", transition: "0.3s", width: "100%" }}>
        
        {/* Hero Section */}
        <div style={{ textAlign: "center", color: isDarkMode ? "#f4f1e1" : "white", background: "linear-gradient(135deg, #8a4d76, #3b1d4f)", height: "60vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", borderRadius: "5px 5px 0 20px 20px" }}>
          <h1><b>Welcome to Lost & Found Marketplace</b></h1>
          <p>Your trusted platform to find and report lost items.</p>
          {token && (
            <Button variant="light" as={Link} to="/foundItemReport" style={{ fontSize: "18px", padding: "10px 20px", borderRadius: "8px", backgroundColor: "#c97f43", color: "#fff" }}>
              Report Found Item
            </Button>
          )}
        </div>

        {/* Found Items Section */}
        <Container className="mt-5">
          <h3 className="text-center" style={{ color: isDarkMode ? "#f4f1e1" : "#3b1d4f" }}>Recently Found Items</h3>
          <Row>
            {foundItems.map((item, index) => (
              <Col xs={12} sm={6} md={4} lg={3} key={index} className="mb-3">
                <Card style={{ borderRadius: "12px", overflow: "hidden" }}>
                  <Card.Img variant="top" src={item.image || "https://via.placeholder.com/150"} alt="removed" style={{ height: "200px", objectFit: "cover" }} />
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>Found at {item.location} on {moment(item.dateLost).fromNow()}.</Card.Text>
                    <Button variant="primary" onClick={() => handleViewDetails(item)}>See More Details...</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Modal for Login Prompt */}
      <Modal show={showLoginPrompt} onHide={() => setShowLoginPrompt(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You need to log in to view item details.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLoginPrompt(false)}>Cancel</Button>
          <Button variant="primary" as={Link} to="/login">Login</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HomePage;

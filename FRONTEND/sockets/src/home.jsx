import React, { useState, useEffect } from "react";
import { 
  Container, Button, Card, Row, Col, Modal, 
  Carousel, Badge 
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome, FaSearch, FaPlus, FaBoxOpen, FaComments,
  FaSignInAlt, FaSignOutAlt, FaMoon, FaSun, 
  FaUserCircle, FaMapMarkerAlt, FaClock, FaTimes
} from "react-icons/fa";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import moment from "moment";
import useThemeStore from "./components/store/colorStore";
import isTokenExpired from "./components/login/decodeToken";

const HomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [foundItems, setFoundItems] = useState([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "User";

  useEffect(() => {
    fetchFoundItems();
    if (isTokenExpired(token)) {
      localStorage.removeItem("token");
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
      navigate(`/foundid/${item._id}`);
    } else {
      setSelectedItem(item);
      setShowLoginPrompt(true);
    }
  };

  const handleAccountClick = () => {
    navigate(role === "Admin" ? "/admin" : "/User");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const featuredItems = foundItems.slice(0, 5);

  return (
    <div className={`app-container ${isDarkMode ? 'dark' : 'light'}`} 
      style={{
        minHeight: "100vh",
        background: isDarkMode ? "#121212" : "#f8f9fa",
        color: isDarkMode ? "#e0e0e0" : "#212529"
      }}>
      
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}
        style={{
          background: isDarkMode 
            ? "linear-gradient(195deg, #1a1a2e, #16213e)"
            : "linear-gradient(195deg, #3a7bd5, #00d2ff)",
          boxShadow: "4px 0 15px rgba(0,0,0,0.1)",
          transition: "width 0.3s ease"
        }}>
        
        <div className="sidebar-header">
          <Button variant="link" onClick={toggleSidebar} 
            className="toggle-btn">
            <FaTimes />
          </Button>
          {sidebarOpen && (
            <h4 className="brand">
              <FaBoxOpen className="mr-2" />
              Lost & Found
            </h4>
          )}
        </div>

        <div className="sidebar-content">
          <nav>
            {[
              { to: "/", icon: <FaHome />, label: "Home" },
              ...(token ? [
                { to: "/founditems", icon: <FaSearch />, label: "Found Items" },
                { to: "/lostitems", icon: <FaBoxOpen />, label: "Lost Items" },
                { to: "/lost-itemsPost", icon: <FaPlus />, label: "Report Lost" },
                { to: "/communitychat", icon: <FaComments />, label: "Community" },
                { icon: <FaUserCircle />, label: "My Account", onClick: handleAccountClick },
                { to: "/logout", icon: <FaSignOutAlt />, label: "Logout" },
              ] : [
                { to: "/login", icon: <FaSignInAlt />, label: "Login" }
              ])
            ].map((item, index) => (
              <div key={index} className="nav-item-wrapper">
                {item.onClick ? (
                  <div className="nav-item" onClick={item.onClick}>
                    <span className="nav-icon">{item.icon}</span>
                    {sidebarOpen && <span className="nav-label">{item.label}</span>}
                  </div>
                ) : (
                  <Link to={item.to} className="nav-item">
                    <span className="nav-icon">{item.icon}</span>
                    {sidebarOpen && <span className="nav-label">{item.label}</span>}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <Button variant="link" onClick={toggleDarkMode} className="theme-toggle">
            {isDarkMode ? <FaSun /> : <FaMoon />}
            {sidebarOpen && <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
        style={{
          marginLeft: sidebarOpen ? "270px" : "80px",
          transition: "margin-left 0.3s ease"
        }}>
        
        {/* Hero Section */}
        <section className="hero-section" 
          style={{
            background: isDarkMode
              ? "linear-gradient(135deg, #2c3e50, #4ca1af)"
              : "linear-gradient(135deg, #667eea, #764ba2)"
          }}>
          <div className="hero-content">
            <h1>Reuniting People With Their Lost Belongings</h1>
            <p className="lead">
              Our platform helps you find lost items and report found ones with ease With Just a Push of Button
            </p>
            
            <div className="hero-actions">
              {token ? (
                <>
                  <Button variant="light" as={Link} to="/foundItemReport" className="action-btn">
                    <FaPlus /> Report Found Item
                  </Button>
                  <Button variant="outline-light" as={Link} to="/lost-itemsPost" className="action-btn">
                    <FaBoxOpen /> Report Lost Item
                  </Button>
                </>
              ) : (
                <Button variant="light" as={Link} to="/register" className="action-btn">
                  Join Our Community
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Featured Items Carousel */}
        {featuredItems.length > 0 && (
          <section className="featured-section">
            <Container>
              <div className="section-header">
                <h3 className="section-title">Recently Posted Finds</h3>
                <div className="carousel-controls">
                  <Button variant="link" onClick={() => setActiveIndex(prev => Math.max(0, prev - 1))}>
                    <FiChevronLeft />
                  </Button>
                  <Button variant="link" onClick={() => setActiveIndex(prev => Math.min(featuredItems.length - 1, prev + 1))}>
                    <FiChevronRight />
                  </Button>
                </div>
              </div>
              
              <Carousel activeIndex={activeIndex} onSelect={setActiveIndex} indicators={false}>
                {featuredItems.map((item, index) => (
                  <Carousel.Item key={index}>
                    <div 
                      className="featured-item" 
                      onClick={() => token && navigate(`/foundid/${item._id}`)}
                      style={{ cursor: token ? "pointer" : "default" }}
                    >
                      <img
                        className="d-block w-100"
                        src={item.image || "https://via.placeholder.com/800x400?text=No+Image"}
                        alt={item.name}
                      />
                      <div className="featured-overlay">
                        <h4>{item.name}</h4>
                        <div className="item-meta">
                          <span><FaMapMarkerAlt /> {item.location}</span>
                          <span><FaClock /> {moment(item.dateFound).fromNow()}</span>
                        </div>
                        {token && (
                          <Button 
                            variant="light" 
                            className="view-btn"
                          >
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            </Container>
          </section>
        )}

        {/* App Description Section */}
        <section className="description-section">
          <Container>
            <div 
              className="description-card p-4 rounded"
              style={{
                backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                border: isDarkMode ? "1px solid #444" : "1px solid #eee"
              }}
            >
              <h3 className="text-center mb-4" style={{ color: isDarkMode ? "#4ca1af" : "#667eea" }}>
                About Our Lost & Found Platform
              </h3>
              
              <Row>
                <Col md={6}>
                  <div className="mb-4">
                    <h5 className="d-flex align-items-center">
                      <FaSearch className="me-3" />
                      <span>Find Lost Items</span>
                    </h5>
                    <p style={{ color: isDarkMode ? "#e0e0e0" : "#495057" }}>
                      Our platform connects people who have lost items with those who have found them.
                      Browse through our database of found items to see if your lost belongings have
                      been recovered by kind strangers in your community.
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <h5 className="d-flex align-items-center">
                      <FaBoxOpen className="me-3" />
                      <span>Report Found Items</span>
                    </h5>
                    <p style={{ color: isDarkMode ? "#e0e0e0" : "#495057" }}>
                      Found something that doesn't belong to you? Help reunite it with its owner by
                      reporting it through our system. We make the process simple and secure.
                    </p>
                  </div>
                </Col>
                
                <Col md={6}>
                  <div className="mb-4">
                    <h5 className="d-flex align-items-center">
                      <FaPlus className="me-3" />
                      <span>Report Lost Items</span>
                    </h5>
                    <p style={{ color: isDarkMode ? "#e0e0e0" : "#495057" }}>
                      Lost something valuable? Create a detailed report with photos and descriptions.
                      Our system will match your report with found items and notify you of potential matches.
                    </p>
                  </div>
                  
                  <div>
                    <h5 className="d-flex align-items-center">
                      <FaComments className="me-3" />
                      <span>Community Support</span>
                    </h5>
                    <p style={{ color: isDarkMode ? "#e0e0e0" : "#495057" }}>
                      Join our active community forum to get help from others who understand what
                      you're going through. Share tips, success stories, and support each other.
                    </p>
                  </div>
                </Col>
              </Row>
              
              <div className="text-center mt-4">
                {token ? (
                  <Button 
                    variant="primary" 
                    as={Link} 
                    to="/founditems"
                    style={{
                      background: isDarkMode 
                        ? "linear-gradient(135deg, #4ca1af, #2c3e50)" 
                        : "linear-gradient(135deg, #667eea, #764ba2)",
                      border: "none"
                    }}
                  >
                    Browse All Found Items
                  </Button>
                ) : (
                  <Button 
                    variant="primary" 
                    as={Link} 
                    to="/register"
                    style={{
                      background: isDarkMode 
                        ? "linear-gradient(135deg, #4ca1af, #2c3e50)" 
                        : "linear-gradient(135deg, #667eea, #764ba2)",
                      border: "none"
                    }}
                  >
                    Join Now to Get Started
                  </Button>
                )}
              </div>
            </div>
          </Container>
        </section>
      </div>

      {/* Login Prompt Modal */}
      <Modal show={showLoginPrompt} onHide={() => setShowLoginPrompt(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You need to log in to view item details.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLoginPrompt(false)}>
            Cancel
          </Button>
          <Button variant="primary" as={Link} to="/login">
            Login
          </Button>
        </Modal.Footer>
      </Modal>

      {/* CSS Styles */}
      <style jsx>{`
        .app-container {
          display: flex;
          min-height: 100vh;
        }
        
        .sidebar {
          width: 270px;
          height: 100vh;
          position: fixed;
          display: flex;
          flex-direction: column;
          z-index: 1000;
        }
        
        .sidebar.closed {
          width: 80px;
        }
        
        .sidebar-header {
          padding: 20px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        
        .toggle-btn {
          color: white;
          font-size: 1.5rem;
          padding: 0;
          margin-right: 15px;
        }
        
        .brand {
          color: white;
          margin: 0;
          font-weight: 600;
        }
        
        .sidebar-content {
          flex: 1;
          overflow-y: auto;
          padding: 20px 0;
        }
        
        .nav-item-wrapper {
          padding: 0 15px;
          margin-bottom: 5px;
        }
        
        .nav-item {
          display: flex;
          align-items: center;
          padding: 12px 15px;
          color: white;
          text-decoration: none;
          border-radius: 8px;
        }
        
        .nav-item:hover {
          background: rgba(255,255,255,0.1);
        }
        
        .nav-icon {
          font-size: 1.2rem;
          margin-right: 15px;
          width: 24px;
          text-align: center;
        }
        
        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        
        .theme-toggle {
          color: white;
          display: flex;
          align-items: center;
          width: 100%;
          padding: 10px;
        }
        
        .theme-toggle span {
          margin-left: 15px;
        }
        
        .main-content {
          flex: 1;
        }
        
        .hero-section {
          height: 60vh;
          min-height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-align: center;
          padding: 0 20px;
          position: relative;
          overflow: hidden;
        }
        
        .hero-content {
          max-width: 800px;
          z-index: 1;
        }
        
        .hero-content h1 {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 20px;
        }
        
        .hero-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-top: 30px;
        }
        
        .action-btn {
          padding: 12px 25px;
          font-weight: 600;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .section-title {
          font-weight: 600;
          margin-bottom: 30px;
        }
        
        .featured-section {
          padding: 60px 0;
          background: ${isDarkMode ? "#121212" : "#f8f9fa"};
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        
        .carousel-controls button {
          color: ${isDarkMode ? "#e0e0e0" : "#212529"};
          font-size: 1.5rem;
        }
        
        .featured-item {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          height: 400px;
        }
        
        .featured-item img {
          height: 100%;
          object-fit: cover;
          filter: brightness(0.7);
        }
        
        .featured-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 30px;
          color: white;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
        }
        
        .featured-overlay h4 {
          font-size: 1.8rem;
          margin-bottom: 10px;
        }
        
        .item-meta {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
          font-size: 0.9rem;
        }
        
        .view-btn {
          font-weight: 600;
          padding: 8px 20px;
        }
        
        .description-section {
          padding: 60px 0;
        }
        
        .description-card {
          transition: all 0.3s ease;
        }
        
        .description-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
};

export default HomePage;
import React, { useState, useEffect } from "react";
import { 
  Container, Card, Row, Col, Pagination, 
  InputGroup, Form, Button, FormControl 
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { 
  FaHome, FaSignOutAlt, FaUser, FaSearch, 
  FaClock, FaEnvelope, FaMapMarkerAlt 
} from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import moment from "moment";
import useThemeStore from "../store/colorStore";
import axiosInstance from "../../axiosInstance";
import "bootstrap/dist/css/bootstrap.min.css";

const LostItemsPage = () => {
  const [lostItems, setLostItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 6;
  const { isDarkMode } = useThemeStore();

  // Set theme with proper contrast
  useEffect(() => {
    document.body.style.backgroundColor = isDarkMode ? "#121212" : "#f8f9fa";
    document.body.style.color = isDarkMode ? "#e0e0e0" : "#212529"; // Improved text color
  }, [isDarkMode]);

  // Fetch lost items
  const fetchLostItems = async () => {
    try {
      const response = await axiosInstance.get("lostItem");
      setLostItems(response.data || []);
    } catch (error) {
      console.error("Error fetching lost items:", error);
    }
  };

  useEffect(() => {
    fetchLostItems();
  }, []);

  // Filter items
  const filteredItems = lostItems.filter(item =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.contactInfo?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Custom pagination controls
  const PaginationControl = () => (
    <div className="d-flex justify-content-center mt-4">
      <Pagination className="mb-0">
        <Pagination.Prev 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
          disabled={currentPage === 1}
        >
          <FiChevronLeft />
        </Pagination.Prev>
        
        {[...Array(totalPages)].map((_, idx) => (
          <Pagination.Item
            key={idx}
            active={idx + 1 === currentPage}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </Pagination.Item>
        ))}
        
        <Pagination.Next 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
          disabled={currentPage === totalPages}
        >
          <FiChevronRight />
        </Pagination.Next>
      </Pagination>
    </div>
  );

  return (
    <div className="lost-items-page">
      {/* Premium Header */}
      <div 
        className={`header-gradient ${isDarkMode ? 'dark' : 'light'}`}
        style={{
          background: isDarkMode 
            ? "linear-gradient(135deg, #2c3e50, #4ca1af)" 
            : "linear-gradient(135deg, #667eea, #764ba2)",
          color: "white",
          padding: "2rem 0",
          marginBottom: "2rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}
      >
        <Container>
          <h1 className="text-center mb-3" style={{ fontWeight: 700 }}>
            Lost Items
          </h1>
          <p className="text-center mb-4" style={{ opacity: 0.9 }}>
            Help reunite lost items with their owners
          </p>
          
          {/* Search Bar with improved visibility */}
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <InputGroup>
              <Form.Control
                as="input"
                placeholder="Search items by name, description or contact..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  height: "50px",
                  fontSize: "1rem",
                  border: "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  backgroundColor: isDarkMode ? "#2d2d2d" : "white",
                  color: isDarkMode ? "#f0f0f0" : "#333",
                }}
              />
              <Button 
                variant={isDarkMode ? "secondary" : "primary"}
                style={{
                  height: "50px",
                  fontWeight: 600,
                  backgroundColor: isDarkMode ? "#4ca1af" : "#667eea"
                }}
              >
                <FaSearch /> Search
              </Button>
            </InputGroup>
          </div>
        </Container>
      </div>

      {/* Main Content with improved contrast */}
      <Container 
        className="mb-5" 
        style={{ 
          paddingBottom: "100px",
          backgroundColor: isDarkMode ? "#1a1a1a" : "white",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginTop: "2rem",
          position: "relative",
          zIndex: 1,
          padding: "2rem",
          maxWidth: "95%",
          marginLeft: "auto",
          marginRight: "auto",
          color: isDarkMode ? "#e0e0e0" : "#212529"
        }}
      >
        {/* Results Count */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 style={{ fontWeight: 600 }}>
            {filteredItems.length} {filteredItems.length === 1 ? "Item" : "Items"} Found
          </h5>
          <div style={{ color: isDarkMode ? "#aaa" : "#6c757d" }}>
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div 
            className="text-center py-5"
            style={{
              backgroundColor: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
              borderRadius: "12px",
              color: isDarkMode ? "#e0e0e0" : "#212529"
            }}
          >
            <h4 className="mb-3">No items found</h4>
            <p style={{ color: isDarkMode ? "#bbb" : "#6c757d" }}>
              {searchQuery ? "Try adjusting your search query" : "Check back later for lost items"}
            </p>
          </div>
        ) : (
          <>
            <Row className="g-4">
              {currentItems.map((item) => (
                <Col key={item._id} md={6} lg={4}>
                  <Card
                    className="h-100 border-0 shadow-sm hover-effect"
                    style={{
                      borderRadius: "12px",
                      overflow: "hidden",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      backgroundColor: isDarkMode ? "#2d2d2d" : "white",
                      color: isDarkMode ? "#e0e0e0" : "#212529",
                      border: isDarkMode ? "1px solid #444" : "1px solid #ddd"
                    }}
                  >
                    <div 
                      style={{
                        height: "200px",
                        overflow: "hidden",
                        position: "relative"
                      }}
                    >
                      <Card.Img
                        variant="top"
                        src={item.image || "https://via.placeholder.com/300x200?text=No+Image"}
                        alt={item.name}
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "cover",
                          transition: "transform 0.5s"
                        }}
                        onError={(e) => (e.target.src = "https://via.placeholder.com/300x200?text=No+Image")}
                      />
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="mb-3" style={{ color: isDarkMode ? "#f0f0f0" : "#212529" }}>
                        {item.name}
                      </Card.Title>
                      
                      <div className="mb-3">
                        {item.description && (
                          <p style={{ 
                            color: isDarkMode ? "#bbb" : "#6c757d",
                            fontSize: "0.9rem"
                          }}>
                            {item.description.length > 100 
                              ? `${item.description.substring(0, 100)}...` 
                              : item.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="mt-auto">
                        <div className="d-flex align-items-center mb-2">
                          <FaMapMarkerAlt className="me-2" size={14} style={{ color: isDarkMode ? "#4ca1af" : "#667eea" }} />
                          <small style={{ color: isDarkMode ? "#bbb" : "#6c757d" }}>
                            {item.location || "Location not specified"}
                          </small>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <FaClock className="me-2" size={14} style={{ color: isDarkMode ? "#4ca1af" : "#667eea" }} />
                          <small style={{ color: isDarkMode ? "#bbb" : "#6c757d" }}>
                            {item.dateLost ? moment(item.dateLost).format("MMM D, YYYY") : "Date not specified"}
                          </small>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <FaEnvelope className="me-2" size={14} style={{ color: isDarkMode ? "#4ca1af" : "#667eea" }} />
                          <small style={{ color: isDarkMode ? "#bbb" : "#6c757d" }}>
                            {item.contactInfo}
                          </small>
                        </div>
                      </div>
                      
                      <Button 
                        as={Link}
                        to={`/lostitem/${item._id}`}
                        variant={isDarkMode ? "outline-light" : "outline-primary"}
                        className="mt-3 align-self-start"
                        size="sm"
                        style={{
                          borderColor: isDarkMode ? "#4ca1af" : "#667eea",
                          color: isDarkMode ? "#f0f0f0" : "#667eea"
                        }}
                      >
                        View Details
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            {totalPages > 1 && <PaginationControl />}
          </>
        )}
      </Container>

      {/* Bottom Navigation */}
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          background: isDarkMode 
            ? "linear-gradient(135deg, #2c3e50, #4ca1af)" 
            : "linear-gradient(135deg, #667eea, #764ba2)",
          padding: "12px 0",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          boxShadow: "0px -4px 12px rgba(0,0,0,0.15)",
          zIndex: 1000,
        }}
      >
        <Link 
          to="/" 
          className="d-flex flex-column align-items-center"
          style={{ color: "white", textDecoration: "none" }}
        >
          <FaHome size={20} />
          <small style={{ fontSize: "0.75rem", marginTop: "4px" }}>Home</small>
        </Link>
        
        <Link 
          to="/account" 
          className="d-flex flex-column align-items-center"
          style={{ color: "white", textDecoration: "none" }}
        >
          <FaUser size={20} />
          <small style={{ fontSize: "0.75rem", marginTop: "4px" }}>Account</small>
        </Link>
        
        <div
          className="d-flex flex-column align-items-center"
          style={{ 
            background: "rgba(255,255,255,0.2)",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            justifyContent: "center",
            marginTop: "-30px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
          }}
        >
          <FaSearch size={20} />
        </div>
        
        <Link 
          to="/lost-itemsPost" 
          className="d-flex flex-column align-items-center"
          style={{ color: "white", textDecoration: "none" }}
        >
          <div style={{ 
            background: "#fff",
            width: "24px",
            height: "24px",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isDarkMode ? "#667eea" : "#764ba2",
            fontWeight: "bold"
          }}>
            +
          </div>
          <small style={{ fontSize: "0.75rem", marginTop: "4px" }}>Report</small>
        </Link>
        
        <Link 
          to="/logout" 
          onClick={() => { localStorage.removeItem("token"); window.location.reload(); }} 
          className="d-flex flex-column align-items-center"
          style={{ color: "white", textDecoration: "none" }}
        >
          <FaSignOutAlt size={20} />
          <small style={{ fontSize: "0.75rem", marginTop: "4px" }}>Logout</small>
        </Link>
      </nav>
    </div>
  );
};

export default LostItemsPage;
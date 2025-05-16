import React, { useState, useEffect } from "react";
import { 
  Container, 
  Card, 
  Row, 
  Col, 
  Pagination, 
  InputGroup, 
  FormControl,
  Badge,
  Button
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaHome, 
  FaSignOutAlt, 
  FaUser, 
  FaSearch,
  FaMapMarkerAlt,
  FaCalendarAlt
} from "react-icons/fa";
import moment from "moment";
import useThemeStore from "../store/colorStore";
import axiosInstance from "../../axiosInstance";
import "bootstrap/dist/css/bootstrap.min.css";

const FoundItemsPage = () => {
  const [foundItems, setFoundItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 6;
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    document.body.style.backgroundColor = isDarkMode ? "#121212" : "#f8f9fa";
    document.body.style.color = isDarkMode ? "#ffffff" : "#000000";
  }, [isDarkMode]);

  const fetchFoundItems = async () => {
    try {
      const response = await axiosInstance.get("foundItems");
      setFoundItems(response.data || []);
    } catch (error) {
      console.error("Error fetching found items:", error);
    }
  };

  useEffect(() => {
    fetchFoundItems();
  }, []);

  const filteredItems = foundItems.filter(item =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.contactInfo?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item._id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="found-items-page" style={{ paddingBottom: "80px" }}>
      {/* Header Section */}
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
            Found Items Marketplace
          </h1>
          <p className="text-center mb-4" style={{ opacity: 0.9 }}>
            Reuniting lost items with their owners
          </p>
          
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <InputGroup>
              <FormControl
                placeholder="Search items by name, description or contact..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  height: "50px",
                  border: "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  background: isDarkMode ? "#2c2c2c" : "white",
                  color: isDarkMode ? "white" : "black"
                }}
              />
              <Button 
                variant="primary" 
                style={{ height: "50px" }}
              >
                <FaSearch />
              </Button>
            </InputGroup>
          </div>
        </Container>
      </div>

      {/* Main Content - Updated Container */}
      <Container 
        style={{ 
          background: isDarkMode ? "#1e1e1e" : "white",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          margin: "2rem auto",
          padding: "2rem",
          maxWidth: "95%",
          position: "relative",
          zIndex: 1
        }}
      >
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "1.5rem",
          color: isDarkMode ? "white" : "inherit"
        }}>
          <h5 style={{ fontWeight: 600 }}>
            {filteredItems.length} {filteredItems.length === 1 ? "Item" : "Items"} Found
          </h5>
          <div style={{ color: isDarkMode ? "#aaa" : "#6c757d" }}>
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "3rem",
            background: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
            borderRadius: "12px",
            color: isDarkMode ? "white" : "inherit"
          }}>
            <h4 className="mb-3">No items found</h4>
            <p className="text-muted">
              {searchQuery ? "Try adjusting your search query" : "Check back later for new found items"}
            </p>
          </div>
        ) : (
          <>
            <Row className="g-4">
              {currentItems.map((item) => (
                <Col key={item._id} md={6} lg={4}>
                  <Card
                    className="h-100"
                    style={{
                      borderRadius: "12px",
                      overflow: "hidden",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      background: isDarkMode ? "#2c2c2c" : "white",
                      color: isDarkMode ? "white" : "inherit",
                      border: isDarkMode ? "1px solid #444" : "1px solid #dee2e6"
                    }}
                  >
                    <div style={{
                      height: "200px",
                      overflow: "hidden",
                      position: "relative"
                    }}>
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
                      {item.category && (
                        <Badge 
                          pill 
                          style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            textTransform: "capitalize"
                          }}
                        >
                          {item.category}
                        </Badge>
                      )}
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>{item.name}</Card.Title>
                      
                      <div className="mb-3">
                        {item.description && (
                          <p style={{ 
                            color: isDarkMode ? "#ccc" : "#6c757d",
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
                          <FaMapMarkerAlt className="me-2" size={14} />
                          <small style={{ color: isDarkMode ? "#aaa" : "#6c757d" }}>
                            {item.location || "Location not specified"}
                          </small>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <FaCalendarAlt className="me-2" size={14} />
                          <small style={{ color: isDarkMode ? "#aaa" : "#6c757d" }}>
                            {item.dateFound ? moment(item.dateFound).format("MMM D, YYYY") : "Date not specified"}
                          </small>
                        </div>
                      </div>
                      
                      <Button 
                        as={Link}
                        to={`/foundid/${item._id}`}
                        variant={isDarkMode ? "outline-light" : "outline-primary"}
                        className="mt-3 align-self-start"
                        size="sm"
                      >
                        View Details
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <Pagination>
                  <Pagination.Prev 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  />
                  
                  {currentPage > 2 && (
                    <Pagination.Item onClick={() => setCurrentPage(1)}>
                      1
                    </Pagination.Item>
                  )}
                  {currentPage > 3 && <Pagination.Ellipsis />}
                  
                  {[
                    currentPage - 1,
                    currentPage,
                    currentPage + 1
                  ].map(page => (
                    page > 0 && page <= totalPages && (
                      <Pagination.Item 
                        key={page}
                        active={page === currentPage}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Pagination.Item>
                    )
                  ))}
                  
                  {currentPage < totalPages - 2 && <Pagination.Ellipsis />}
                  {currentPage < totalPages - 1 && (
                    <Pagination.Item onClick={() => setCurrentPage(totalPages)}>
                      {totalPages}
                    </Pagination.Item>
                  )}
                  
                  <Pagination.Next 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  />
                </Pagination>
              </div>
            )}
          </>
        )}
      </Container>

      {/* Bottom Navigation */}
      <nav style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        padding: "12px 0",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        background: isDarkMode 
          ? "linear-gradient(135deg, #2c3e50, #4ca1af)" 
          : "linear-gradient(135deg, #667eea, #764ba2)",
        boxShadow: "0px -4px 12px rgba(0,0,0,0.15)",
        zIndex: 1000,
      }}>
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
          to="/foundItemReport" 
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
        
     
      </nav>
    </div>
  );
};

export default FoundItemsPage;
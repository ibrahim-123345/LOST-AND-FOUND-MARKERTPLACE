import React, { useState, useEffect } from "react";
import { Container, Card, Row, Col, Pagination, InputGroup, FormControl } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaHome, FaSignOutAlt, FaUser, FaSearch } from "react-icons/fa";
import moment from "moment";
import useThemeStore from "../store/colorStore";
import axiosInstance from "../../axiosInstance";

const FoundItemsPage = () => {
  const [lostItems, setLostItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const itemsPerPage = 6;
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    document.body.style.backgroundColor = isDarkMode ? "#121212" : "#f8f9fa";
    document.body.style.color = isDarkMode ? "#ffffff" : "#000000";
  }, [isDarkMode]);

  // Fetch lost items from API
  const fetchLostItems = async () => {
    try {
      const response = await axiosInstance.get("foundItems");
      setLostItems(response.data || []);
    } catch (error) {
      console.error("Error fetching lost items:", error);
    }
  };

  useEffect(() => {
    fetchLostItems();
  }, []);

  // Filtered items based on search query
  const filteredItems = lostItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.contactInfo.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <Container className="mt-5" style={{ paddingBottom: "80px", backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff", color: isDarkMode ? "#ffffff" : "#000000" }}>
        <h3 className="text-center mb-4">Browse Found Items</h3>

        {filteredItems.length === 0 ? (
          <p className="text-center text-muted mt-3">No lost items available.</p>
        ) : (
          <>
            <Row>
              {currentItems.map((item, index) => (
                <Col md={4} key={index} style={{ padding: "0 20px" }}>
                  <Card
                    style={{
                      marginBottom: "20px",
                      boxShadow: "4px 4px 12px rgba(0,0,0,0.1)",
                      borderRadius: "12px",
                      overflow: "hidden",
                      transition: "0.3s",
                      height: showSearch ? "500px" : "300px",
                      backgroundColor: isDarkMode ? "#2c2c2c" : "#ffffff",
                      color: isDarkMode ? "#ffffff" : "#000000"
                    }}
                    className="hover-shadow"
                  >
                    <Card.Img
                      variant="top"
                      src={`${item.image}`}
                      alt="No image"
                      onError={(e) => (e.target.src = "#")}
                      style={{
                        height: showSearch ? "250px" : "150px",
                        objectFit: "cover", 
                        borderRadius: "12px 12px 0 0",
                        minHeight: showSearch ? "250px" : "150px"
                      }}
                    />
                    <Card.Body>
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text>
                        <strong>Contact:</strong> {item.contactInfo}
                      </Card.Text>
                      <Link to={`/foundid/${item._id}`} style={{ textDecoration: "none", color: "blue", fontWeight: "bold" }}>
                        View Details
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            <Pagination className="justify-content-center">
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => setCurrentPage(index + 1)}>
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </>
        )}
      </Container>

      {/* Bottom Navigation Bar */}
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          background: isDarkMode ? "#444" : "#343a40",
          padding: "10px 0",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          boxShadow: "0px -2px 10px rgba(0,0,0,0.2)",
          zIndex: 1000,
        }}
      >
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          <FaHome size={24} />
        </Link>
        <Link to="/account" style={{ color: "white", textDecoration: "none" }}>
          <FaUser size={24} />
        </Link>
        <Link to="/logout" onClick={() => { localStorage.removeItem("token"); window.location.reload(); }} style={{ color: "white", textDecoration: "none" }}>
          <FaSignOutAlt size={24} />
        </Link>

        {/* Search Input */}
        <InputGroup className="mb-0" style={{ width: "50%" }}>
          <FormControl
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              backgroundColor: isDarkMode ? "#333" : "#f8f9fa",
              color: isDarkMode ? "#fff" : "#000",
              border: "1px solid",
              borderColor: isDarkMode ? "#555" : "#ccc",
              height: "35px",
              fontSize: "14px",
            }}
          />
          <InputGroup.Text style={{
            backgroundColor: isDarkMode ? "#333" : "#f8f9fa", 
            border: "1px solid", 
            borderColor: isDarkMode ? "#555" : "#ccc",
            color: isDarkMode ? "#fff" : "#000",
            height: "35px",
            display: "flex",
            alignItems: "center",
            padding: "0 10px"
          }}>
            <FaSearch size={18} />
          </InputGroup.Text>
        </InputGroup>
      </nav>
    </>
  );
};

export default FoundItemsPage;

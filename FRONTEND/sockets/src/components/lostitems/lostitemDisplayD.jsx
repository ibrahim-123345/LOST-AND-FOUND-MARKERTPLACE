import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Container } from "react-bootstrap";
import { FaHome, FaUser, FaSignOutAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";
import useThemeStore from "../store/colorStore"; 
import axiosInstance from "../../axiosInstance";


const LostItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  // Accessing the theme state from the Zustand store
  const { isDarkMode, toggleTheme } = useThemeStore();

  const HandleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axiosInstance.get(`lostItem/${id}`);
        setItem(response.data);
      } catch (error) {
        console.error("Error fetching item details:", error);
      }
    };
    fetchItem();
  }, [id]);

  useEffect(() => {
    // Update the entire body's background color based on theme
    document.body.style.backgroundColor = isDarkMode ? "#333" : "#f5f5f5";
  }, [isDarkMode]); // Runs every time the theme changes

  if (!item) {
    return <p className="text-center mt-5">Loading item details...</p>;
  }

  return (
    <>
      <Container
        className="mt-5 p-4"
        style={{
          maxWidth: "800px",
          margin: "auto",
          boxShadow: "0px 4px 15px rgba(0,0,0,0.2)",
          borderRadius: "10px",
          background: isDarkMode ? "#444" : "#ffffff", // Adjust background of the card
          color: isDarkMode ? "#f5f5f5" : "#333", // Adjust text color for contrast
          lineHeight: "1.8",
        }}
      >
        <img
          src={item.image || "https://via.placeholder.com/800"}
          alt="Lost Item"
          style={{
            width: "100%",
            maxHeight: "400px",
            objectFit: "cover",
            borderRadius: "10px",
            marginBottom: "15px",
          }}
        />
        <h2 style={{ fontWeight: "bold" }}>{item.name}</h2>
        <p>{moment(item.dateLost).fromNow() + " ago" || "Unknown Date"}</p>
        <hr />
        <p style={{ fontSize: "1.1rem" }}>
          <strong>Description:</strong> {item.description}
        </p>
        <p style={{ fontSize: "1.1rem" }}>
          <strong>Contact Founder:</strong>
          <a
            href="https://contact-owner.example.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#007bff", textDecoration: "underline", marginLeft: "5px" }}
          >
            ....
          </a>
        </p>
      </Container>

      {/* Bottom Navigation Bar */}
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          background: isDarkMode ? "#444" : "#343a40", // Adjust nav bar background based on theme
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
        <Link
          to="/logout"
         
          style={{ color: "white", textDecoration: "none" }}
        >
          <FaSignOutAlt size={24} />
        </Link>
      
      </nav>
    </>
  );
};

export default LostItemDetails;

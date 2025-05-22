import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import { IoMdChatboxes } from "react-icons/io";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";
import useThemeStore from "../store/colorStore";
import axiosInstance from "../../axiosInstance";

const LostItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const { isDarkMode } = useThemeStore();

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
    document.body.style.backgroundColor = isDarkMode ? "#1a1a1a" : "#f8f9fa";
  }, [isDarkMode]);

  if (!item) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Container
      className="py-4"
      style={{
        maxWidth: "800px",
        margin: "auto",
      }}
    >
      {/* Simple back button */}
      <div className="mb-4">
        <Link
          to="/"
          className="d-flex align-items-center text-decoration-none"
          style={{ color: isDarkMode ? "#f5f5f5" : "#333" }}
        >
          <FaArrowLeft className="me-2" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Item Card */}
      <div
        style={{
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: isDarkMode
            ? "0 10px 20px rgba(0, 0, 0, 0.3)"
            : "0 10px 20px rgba(0, 0, 0, 0.1)",
          background: isDarkMode ? "#2d2d2d" : "#ffffff",
          color: isDarkMode ? "#f5f5f5" : "#333",
          transition: "all 0.3s ease",
        }}
      >
        {/* Item Image */}
        <div
          style={{
            height: "400px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <img
            src={item.image}
            alt="Lost Item"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Item Details */}
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h2
                style={{
                  fontWeight: "700",
                  marginBottom: "0.5rem",
                  color: isDarkMode ? "#ffffff" : "#212529",
                }}
              >
                {item.name}
              </h2>
              <p
                style={{
                  color: isDarkMode ? "#adb5bd" : "#6c757d",
                  fontSize: "0.9rem",
                }}
              >
                {moment(item.dateFound).fromNow()}
              </p>
            </div>
            {item.status === "found" && (
              <Button
                variant={isDarkMode ? "outline-light" : "outline-primary"}
                className="d-flex align-items-center"
                as={Link}
                to="/"
              >
                <IoMdChatboxes className="me-2" />
                Chat
              </Button>
            )}
          </div>

          <hr style={{ borderColor: isDarkMode ? "#495057" : "#e9ecef" }} />

          <div className="mb-4">
            <h5
              style={{
                fontWeight: "600",
                marginBottom: "1rem",
                color: isDarkMode ? "#f8f9fa" : "#343a40",
              }}
            >
              Description
            </h5>
            <p
              style={{
                fontSize: "1.05rem",
                lineHeight: "1.7",
                color: isDarkMode ? "#e9ecef" : "#495057",
              }}
            >
              {item.description}
            </p>
          </div>

          <div className="mb-3">
            <h5
              style={{
                fontWeight: "600",
                marginBottom: "1rem",
                color: isDarkMode ? "#f8f9fa" : "#343a40",
              }}
            >
              Lost Location
            </h5>
            <p
              style={{
                fontSize: "1.05rem",
                color: isDarkMode ? "#e9ecef" : "#495057",
              }}
            >
              {item.location || "Not specified"}
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default LostItemDetails;
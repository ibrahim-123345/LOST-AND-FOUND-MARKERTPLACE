import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import useThemeStore from "../store/colorStore";
import axiosInstance from "../../axiosInstance";
import useAuthStore from "../store/authStore";
import { FiUpload, FiCalendar, FiMapPin, FiMail, FiBox } from "react-icons/fi";
import { motion } from "framer-motion";

const url = "/foundItems";

const FoundItem = () => {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [dateLost, setDateLost] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [contactInfo, setContact] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { isDarkMode } = useThemeStore();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    const userid = localStorage.getItem("userid");
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append("name", itemName);
    formData.append("description", description);
    formData.append("dateFound", dateLost);
    formData.append("location", location);
    formData.append("category", category);
    formData.append("contactInfo", contactInfo);
    formData.append("user", userid);
    
    if (image) formData.append("image", image);

    try {
      const response = await axiosInstance.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Success:", response.data);
      setSuccess(true);
      // Reset form
      setItemName("");
      setDescription("");
      setDateLost("");
      setLocation("");
      setCategory("");
      setContact("");
      setImage(null);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to upload item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center py-5"
      style={{
        backgroundColor: isDarkMode ? "#121212" : "#f8f9fa",
        color: isDarkMode ? "#ffffff" : "#000000",
        minHeight: "100vh",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card shadow-lg border-0 overflow-hidden"
        style={{
          width: "100%",
          maxWidth: "500px",
          borderRadius: "16px",
          backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
          border: isDarkMode ? "1px solid #333" : "1px solid #e9ecef",
        }}
      >
        <div 
          className="card-header py-4 text-center"
          style={{
            backgroundColor: isDarkMode ? "#2a2a2a" : "#f8f9fa",
            borderBottom: isDarkMode ? "1px solid #333" : "1px solid #e9ecef",
          }}
        >
          <h3 className="mb-0 fw-bold" style={{ color: isDarkMode ? "#fff" : "#333" }}>
            Report Found Item
          </h3>
          <p className="mb-0 mt-2 text-muted">
            Help reunite lost items with their owners
          </p>
        </div>

        <div className="card-body p-4">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="alert alert-danger text-center p-3 mb-4 rounded-lg"
              style={{
                backgroundColor: isDarkMode ? "#3a1d1d" : "#f8d7da",
                border: "none",
              }}
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="alert alert-success text-center p-3 mb-4 rounded-lg"
              style={{
                backgroundColor: isDarkMode ? "#1d3a1d" : "#d4edda",
                border: "none",
              }}
            >
              Item successfully uploaded! Thank you for your kindness.
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-medium mb-2" style={{ color: isDarkMode ? "#ddd" : "#495057" }}>
                Item Name
              </label>
              <div className="input-group">
                <span 
                  className="input-group-text" 
                  style={{
                    backgroundColor: isDarkMode ? "#333" : "#f8f9fa",
                    borderColor: isDarkMode ? "#444" : "#ced4da",
                  }}
                >
                  <FiBox color={isDarkMode ? "#aaa" : "#6c757d"} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Black Wallet, iPhone 12, etc."
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  required
                  style={{
                    borderRadius: "0 8px 8px 0",
                    backgroundColor: isDarkMode ? "#2a2a2a" : "#ffffff",
                    color: isDarkMode ? "#fff" : "#000",
                    borderColor: isDarkMode ? "#444" : "#ced4da",
                  }}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-medium mb-2" style={{ color: isDarkMode ? "#ddd" : "#495057" }}>
                Description
              </label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Detailed description of the item (color, brand, distinguishing features)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                style={{
                  borderRadius: "8px",
                  backgroundColor: isDarkMode ? "#2a2a2a" : "#ffffff",
                  color: isDarkMode ? "#fff" : "#000",
                  borderColor: isDarkMode ? "#444" : "#ced4da",
                  minHeight: "100px",
                }}
              ></textarea>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label fw-medium mb-2" style={{ color: isDarkMode ? "#ddd" : "#495057" }}>
                  Date Found
                </label>
                <div className="input-group">
                  <span 
                    className="input-group-text" 
                    style={{
                      backgroundColor: isDarkMode ? "#333" : "#f8f9fa",
                      borderColor: isDarkMode ? "#444" : "#ced4da",
                    }}
                  >
                    <FiCalendar color={isDarkMode ? "#aaa" : "#6c757d"} />
                  </span>
                  <input
                    type="date"
                    className="form-control"
                    value={dateLost}
                    onChange={(e) => setDateLost(e.target.value)}
                    required
                    style={{
                      borderRadius: "0 8px 8px 0",
                      backgroundColor: isDarkMode ? "#2a2a2a" : "#ffffff",
                      color: isDarkMode ? "#fff" : "#000",
                      borderColor: isDarkMode ? "#444" : "#ced4da",
                    }}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-medium mb-2" style={{ color: isDarkMode ? "#ddd" : "#495057" }}>
                  Location
                </label>
                <div className="input-group">
                  <span 
                    className="input-group-text" 
                    style={{
                      backgroundColor: isDarkMode ? "#333" : "#f8f9fa",
                      borderColor: isDarkMode ? "#444" : "#ced4da",
                    }}
                  >
                    <FiMapPin color={isDarkMode ? "#aaa" : "#6c757d"} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Where was it found?"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    style={{
                      borderRadius: "0 8px 8px 0",
                      backgroundColor: isDarkMode ? "#2a2a2a" : "#ffffff",
                      color: isDarkMode ? "#fff" : "#000",
                      borderColor: isDarkMode ? "#444" : "#ced4da",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-medium mb-2" style={{ color: isDarkMode ? "#ddd" : "#495057" }}>
                Category
              </label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                style={{
                  borderRadius: "8px",
                  backgroundColor: isDarkMode ? "#2a2a2a" : "#ffffff",
                  color: isDarkMode ? "#fff" : "#000",
                  borderColor: isDarkMode ? "#444" : "#ced4da",
                  padding: "10px 15px",
                }}
              >
                <option value="">Select a category</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing & Accessories</option>
                <option value="documents">Documents & IDs</option>
                <option value="jewelry">Jewelry & Watches</option>
                <option value="bags">Bags & Wallets</option>
                <option value="keys">Keys</option>
                <option value="others">Others</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label fw-medium mb-2" style={{ color: isDarkMode ? "#ddd" : "#495057" }}>
                Your Contact Information
              </label>
              <div className="input-group">
                <span 
                  className="input-group-text" 
                  style={{
                    backgroundColor: isDarkMode ? "#333" : "#f8f9fa",
                    borderColor: isDarkMode ? "#444" : "#ced4da",
                  }}
                >
                  <FiMail color={isDarkMode ? "#aaa" : "#6c757d"} />
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Your email address"
                  value={contactInfo}
                  onChange={(e) => setContact(e.target.value)}
                  required
                  style={{
                    borderRadius: "0 8px 8px 0",
                    backgroundColor: isDarkMode ? "#2a2a2a" : "#ffffff",
                    color: isDarkMode ? "#fff" : "#000",
                    borderColor: isDarkMode ? "#444" : "#ced4da",
                  }}
                />
              </div>
              <small className="text-muted" style={{ color: isDarkMode ? "#aaa" : "#6c757d" }}>
                This will be shared with the owner to contact you
              </small>
            </div>

            <div className="mb-4">
              <label className="form-label fw-medium mb-2" style={{ color: isDarkMode ? "#ddd" : "#495057" }}>
                Upload Image
              </label>
              <div className="d-flex align-items-center">
                <label
                  htmlFor="image-upload"
                  className="btn btn-outline-secondary me-3 d-flex align-items-center"
                  style={{
                    borderRadius: "8px",
                    borderColor: isDarkMode ? "#444" : "#ced4da",
                    backgroundColor: isDarkMode ? "#2a2a2a" : "#f8f9fa",
                    color: isDarkMode ? "#ddd" : "#495057",
                    cursor: "pointer",
                  }}
                >
                  <FiUpload className="me-2" />
                  Choose File
                </label>
                <input
                  id="image-upload"
                  type="file"
                  className="d-none"
                  onChange={handleImageChange}
                />
                {image && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-truncate"
                    style={{
                      maxWidth: "150px",
                      color: isDarkMode ? "#ddd" : "#495057",
                    }}
                  >
                    {image.name}
                  </motion.span>
                )}
              </div>
              <small className="text-muted" style={{ color: isDarkMode ? "#aaa" : "#6c757d" }}>
                Upload a clear photo of the item (optional but recommended)
              </small>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="btn btn-primary w-100 py-3 fw-bold rounded-pill"
              disabled={loading}
              style={{
                backgroundColor: loading 
                  ? (isDarkMode ? "#3a3a3a" : "#e9ecef") 
                  : (isDarkMode ? "#4e44ce" : "#0d6efd"),
                border: "none",
                fontSize: "1rem",
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Submitting...
                </>
              ) : (
                "Submit Found Item"
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default FoundItem;
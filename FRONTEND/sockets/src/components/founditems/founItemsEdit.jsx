import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import useThemeStore from "../store/colorStore";
import axiosInstance from "../../axiosInstance";
import { FiUpload, FiCalendar, FiMapPin, FiMail, FiBox } from "react-icons/fi";
import { motion } from "framer-motion";

const EditFoundItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dateFound: "",
    location: "",
    category: "",
    contactInfo: "",
    image: null,
    existingImage: ""
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await axiosInstance.get(`/foundone/${id}`);
        const item = response.data;
        setFormData({
          name: item.name || "",
          description: item.description || "",
          dateFound: item.dateFound ? item.dateFound.split('T')[0] : "",
          location: item.location || "",
          category: item.category || "",
          contactInfo: item.contactInfo || "",
          image: null,
          existingImage: item.image || ""
        });
      } catch (error) {
        console.error("Error fetching item details:", error);
        setError("Failed to load item details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [id]);

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
      existingImage: ""
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("dateFound", formData.dateFound);
    data.append("location", formData.location);
    data.append("category", formData.category);
    data.append("contactInfo", formData.contactInfo);
    
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      const response = await axiosInstance.put(`/found/update/${id}`, data);

      console.log(data)
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/foundItems'); 
      }, 1500);
    } catch (error) {
      console.error("Error updating item:", error);
      setError(error.response?.data?.message || "Failed to update item. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div 
        className="d-flex justify-content-center align-items-center" 
        style={{
          minHeight: "100vh",
          backgroundColor: isDarkMode ? "#121212" : "#f8f9fa"
        }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

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
            Edit Found Item
          </h3>
          <p className="mb-0 mt-2 text-muted">
            Update the details of this found item
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
              Item successfully updated! Redirecting...
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
                  name="name"
                  className="form-control"
                  placeholder="e.g. Black Wallet, iPhone 12, etc."
                  value={formData.name}
                  onChange={handleChange}
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
                name="description"
                className="form-control"
                rows="3"
                placeholder="Detailed description of the item (color, brand, distinguishing features)"
                value={formData.description}
                onChange={handleChange}
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
                    name="dateFound"
                    className="form-control"
                    value={formData.dateFound}
                    onChange={handleChange}
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
                    name="location"
                    className="form-control"
                    placeholder="Where was it found?"
                    value={formData.location}
                    onChange={handleChange}
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
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
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
                  name="contactInfo"
                  className="form-control"
                  placeholder="Your email address"
                  value={formData.contactInfo}
                  onChange={handleChange}
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
                Item Image
              </label>
              {formData.existingImage && !formData.image && (
                <div className="mb-3">
                  <img 
                    src={formData.existingImage} 
                    alt="Current item" 
                    className="img-thumbnail mb-2"
                    style={{
                      maxHeight: "150px",
                      backgroundColor: isDarkMode ? "#333" : "#f8f9fa"
                    }}
                  />
                  <p className="text-muted small" style={{ color: isDarkMode ? "#aaa" : "#6c757d" }}>
                    Current image
                  </p>
                </div>
              )}
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
                  {formData.image ? "Change File" : "Upload New Image"}
                </label>
                <input
                  id="image-upload"
                  type="file"
                  className="d-none"
                  onChange={handleImageChange}
                  accept="image/*"
                />
                {formData.image && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-truncate"
                    style={{
                      maxWidth: "150px",
                      color: isDarkMode ? "#ddd" : "#495057",
                    }}
                  >
                    {formData.image.name}
                  </motion.span>
                )}
              </div>
              <small className="text-muted" style={{ color: isDarkMode ? "#aaa" : "#6c757d" }}>
                {formData.image ? "New image will replace the current one" : "Leave blank to keep current image"}
              </small>
            </div>

            <div className="d-flex justify-content-between">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="btn btn-outline-secondary py-2 px-4 fw-bold rounded-pill"
                onClick={() => navigate(-1)}
                style={{
                  borderColor: isDarkMode ? "#444" : "#ced4da",
                  color: isDarkMode ? "#ddd" : "#495057",
                  backgroundColor: isDarkMode ? "#2a2a2a" : "#f8f9fa",
                }}
              >
                Cancel
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="btn btn-primary py-2 px-4 fw-bold rounded-pill"
                disabled={submitting}
                style={{
                  backgroundColor: submitting 
                    ? (isDarkMode ? "#3a3a3a" : "#e9ecef") 
                    : (isDarkMode ? "#4e44ce" : "#0d6efd"),
                  border: "none",
                }}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Updating...
                  </>
                ) : (
                  "Update Item"
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default EditFoundItem;
import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import useThemeStore from "../store/colorStore";
import axiosInstance from "../../axiosInstance";
import useAuthStore from "../store/authStore";

const url = "/foundItems"; 

const FoundItem = () => {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [dateLost, setDateLost] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [contactInfo, setContact] = useState("");
  const [image, setImage] = useState(null); // To store the selected image file
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { isDarkMode } = useThemeStore(); // Retrieve dark mode status from store

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Get the first image from the file input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(); // Create FormData object to handle both text and file data
    formData.append("name", itemName);
    formData.append("description", description);
    formData.append("dateFound", dateLost);
    formData.append("location", location);
    formData.append("category", category);
    formData.append("contactInfo", contactInfo);
    formData.append("user","67e2b6c813fe80a3ca4d8fd5")
    if (image) formData.append("image", image); // Append image if it exists

    try {
      const response = await axiosInstance.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data", 
        },
      });
      console.log("Success:", response.data);
      alert("Item successfully uploaded!");
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to upload item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundColor: isDarkMode ? "#121212" : "#f8f9fa", 
        color: isDarkMode ? "#ffffff" : "#000000",
        minHeight: "100vh", // Ensure background covers full viewport
      }}
    >
      <div
        className="card shadow p-3"
        style={{
          width: "400px", // Slightly smaller container width for a balanced look
          minHeight: "auto", // Let the height adjust based on content
          padding: "20px", // Adjust padding to avoid excessive empty space
          borderRadius: "12px", // Rounded corners for the container
          backgroundColor: isDarkMode ? "#2c2c2c" : "#ffffff", // Adjust background color based on the theme
          color: isDarkMode ? "#ffffff" : "#000000", // Ensure text is readable
        }}
      >
        <h4 className="text-center mb-3">Upload Item You've Found</h4>

        {error && <div className="alert alert-danger text-center p-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Item Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Item name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
              style={{
                borderRadius: "8px", // Rounded corners for inputs
                backgroundColor: isDarkMode ? "#333" : "#ffffff", // Input background color
                color: isDarkMode ? "#fff" : "#000", // Input text color
                border: `1px solid ${isDarkMode ? "#444" : "#ccc"}` // Border color
              }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Describe item"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={{
                borderRadius: "8px",
                backgroundColor: isDarkMode ? "#333" : "#ffffff",
                color: isDarkMode ? "#fff" : "#000",
                border: `1px solid ${isDarkMode ? "#444" : "#ccc"}`,
              }}
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">Date Lost</label>
            <input
              type="date"
              className="form-control"
              value={dateLost}
              onChange={(e) => setDateLost(e.target.value)}
              required
              style={{
                borderRadius: "8px",
                backgroundColor: isDarkMode ? "#333" : "#ffffff",
                color: isDarkMode ? "#fff" : "#000",
                border: `1px solid ${isDarkMode ? "#444" : "#ccc"}`,
              }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              style={{
                borderRadius: "8px",
                backgroundColor: isDarkMode ? "#333" : "#ffffff",
                color: isDarkMode ? "#fff" : "#000",
                border: `1px solid ${isDarkMode ? "#444" : "#ccc"}`,
              }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              style={{
                borderRadius: "8px",
                backgroundColor: isDarkMode ? "#333" : "#ffffff",
                color: isDarkMode ? "#fff" : "#000",
                border: `1px solid ${isDarkMode ? "#444" : "#ccc"}`,
              }}
            >
              <option value="">Select category</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="documents">Documents</option>
              <option value="others">Others</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Contact Information</label>
            <input
              type="email"
              className="form-control"
              placeholder="Your email"
              value={contactInfo}
              onChange={(e) => setContact(e.target.value)}
              required
              style={{
                borderRadius: "8px",
                backgroundColor: isDarkMode ? "#333" : "#ffffff",
                color: isDarkMode ? "#fff" : "#000",
                border: `1px solid ${isDarkMode ? "#444" : "#ccc"}`,
              }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Upload Image</label>
            <input
              type="file"
              className="form-control"
              onChange={handleImageChange}
              style={{
                borderRadius: "8px",
                backgroundColor: isDarkMode ? "#333" : "#ffffff",
                color: isDarkMode ? "#fff" : "#000",
                border: `1px solid ${isDarkMode ? "#444" : "#ccc"}`,
              }}
            />
          </div>

          <button type="submit" className="btn btn-success w-100" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FoundItem;

import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../../axiosInstance";

const url = "post/lostItem"; // Make sure this matches your backend route

const LostItem = () => {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [dateLost, setDateLost] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [contactInfo, setContact] = useState("");
  const [image, setImage] = useState(null); // To store the selected image file
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const user=localStorage.getItem("userid")
    setImage(e.target.files[0]); // Get the first image from the file input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(); // Create FormData object to handle both text and file data
    formData.append("name", itemName);
    formData.append("description", description);
    formData.append("dateLost", dateLost);
    formData.append("location", location);
    formData.append("category", category);
    formData.append("contactInfo", contactInfo);
    formData.append("user",user)
    if (image) formData.append("image", image);

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
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="card shadow p-4"
        style={{
          width: "600px", // Wider container
          padding: "15px",
          borderRadius: "10px",
          minHeight: "auto",
        }}
      >
        <h4 className="text-center mb-3">Upload Lost Item</h4>

        {error && <div className="alert alert-danger text-center p-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="form-label">Item Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Item name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="2"
              placeholder="Describe item"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="mb-2">
            <label className="form-label">Date Lost</label>
            <input
              type="date"
              className="form-control"
              value={dateLost}
              onChange={(e) => setDateLost(e.target.value)}
              required
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select category</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="documents">Documents</option>
              <option value="others">Others</option>
            </select>
          </div>

          <div className="mb-2">
            <label className="form-label">Contact Information</label>
            <input
              type="email"
              className="form-control"
              placeholder="Your email"
              value={contactInfo}
              onChange={(e) => setContact(e.target.value)}
              required
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Upload Image</label>
            <input
              type="file"
              className="form-control"
              onChange={handleImageChange}
              
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

export default LostItem;

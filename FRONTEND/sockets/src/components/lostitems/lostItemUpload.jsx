import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../../axiosInstance";
import { FaUpload, FaCalendarAlt, FaMapMarkerAlt, FaEnvelope, FaBox } from "react-icons/fa";
import { Row, Col } from "react-bootstrap";
import useThemeStore from "../store/colorStore";
import compareAllPairs from "../matchingUtility/comparisonUtility";

const LostItemUpload = () => {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [dateLost, setDateLost] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [contactInfo, setContact] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    document.body.style.backgroundColor = isDarkMode ? "#121212" : "#f8f9fa";
    document.body.style.color = isDarkMode ? "#e0e0e0" : "#212529";
  }, [isDarkMode]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    const user = localStorage.getItem("userid");
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", itemName);
    formData.append("description", description);
    formData.append("dateLost", dateLost);
    formData.append("location", location);
    formData.append("category", category);
    formData.append("contactInfo", contactInfo);
    formData.append("user", user);
    if (image) formData.append("image", image);

    try {
      const response = await axiosInstance.post("/post/lostItem", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Success:", response.data);

      const [foundItemsResponse, lostItemsResponse] = await Promise.all([
        axiosInstance.get("/foundItems"),
        axiosInstance.get("/lostItems"),
      ]);

      const batchSize = 10;

      const allLostItems = lostItemsResponse.data?.map(item => ({
        id: item._id,
        name: item.name,
        description: item.description,
        category: item.category,
        location: item.location,
        dateLost: item.dateLost,
        contactInfo: item.contactInfo,
        status: item.status,
        image: item.image,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        user: {
          id: item.user?._id,
          username: item.user?.username,
          email: item.user?.email,
          country: item.user?.country,
          pinCode: item.user?.pinCode,
          profileImage: item.user?.profileImage,
          role: item.user?.role,
          createdAt: item.user?.createdAt,
        }
      })) || [];

      const allFoundItems = foundItemsResponse.data?.map(item => ({
        id: item._id,
        name: item.name,
        description: item.description,
        category: item.category,
        location: item.location,
        dateFound: item.dateFound,
        contactInfo: item.contactInfo,
        status: item.status,
        image: item.image,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        user: {
          id: item.user?._id,
          username: item.user?.username,
          email: item.user?.email,
          country: item.user?.country,
          pinCode: item.user?.pinCode,
          profileImage: item.user?.profileImage,
          role: item.user?.role,
          createdAt: item.user?.createdAt,
        }
      })) || [];

      const filteredLostItems = allLostItems.filter(item => item.status !== "found");

      const matches = await compareAllPairs(filteredLostItems, allFoundItems);
      console.log("Matches:", matches);

      if (matches.length > 0) {
        console.log("Potential matches found:", matches);
      }

      alert("Item successfully uploaded!");
      setItemName("");
      setDescription("");
      setDateLost("");
      setLocation("");
      setCategory("");
      setContact("");
      setImage(null);
      setImagePreview(null);

    } catch (error) {
      console.error("Error:", error);
      setError(error.response?.data?.message || "Failed to upload item. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div 
      className="d-flex justify-content-center align-items-center min-vh-100 py-4" 
      style={{ 
        backgroundColor: isDarkMode ? "#121212" : "#f8f9fa",
        color: isDarkMode ? "#e0e0e0" : "#212529"
      }}
    >
      <div
        className="card shadow-lg border-0"
        style={{
          width: "100%",
          maxWidth: "700px",
          borderRadius: "12px",
          overflow: "hidden",
          backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
          border: isDarkMode ? "1px solid #444" : "1px solid #dee2e6"
        }}
      >
        <div 
          className="card-header py-3"
          style={{
            background: isDarkMode 
              ? "linear-gradient(135deg, #2c3e50, #4ca1af)" 
              : "linear-gradient(135deg, #667eea, #764ba2)",
            color: "white"
          }}
        >
          <h4 className="mb-0 text-center">
            <FaBox className="me-2" />
            Report Lost Item
          </h4>
        </div>
        
        <div className="card-body p-4">
          {error && (
            <div 
              className="alert alert-danger alert-dismissible fade show"
              style={{
                backgroundColor: isDarkMode ? "#2c2c2c" : "#f8d7da",
                borderColor: isDarkMode ? "#444" : "#f5c6cb",
                color: isDarkMode ? "#ffffff" : "#721c24"
              }}
            >
              {error}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setError(null)}
                aria-label="Close"
                style={{
                  filter: isDarkMode ? "invert(1)" : "none"
                }}
              ></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <div className="mb-3">
                  <label className="form-label fw-medium" style={{ color: isDarkMode ? "#e0e0e0" : "#212529" }}>
                    Item Name
                  </label>
                  <div className="input-group">
                    <span 
                      className="input-group-text"
                      style={{
                        backgroundColor: isDarkMode ? "#2c2c2c" : "#f8f9fa",
                        borderColor: isDarkMode ? "#444" : "#ced4da",
                        color: isDarkMode ? "#ffffff" : "#495057"
                      }}
                    >
                      <FaBox color={isDarkMode ? "#ffffff" : "#495057"} />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Black Wallet, iPhone 12"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      required
                      style={{
                        backgroundColor: isDarkMode ? "#2c2c2c" : "#ffffff",
                        borderColor: isDarkMode ? "#444" : "#ced4da",
                        color: isDarkMode ? "#ffffff" : "#212529"
                      }}
                    />
                  </div>
                </div>
              </Col>
              
              <Col md={6}>
                <div className="mb-3">
                  <label className="form-label fw-medium" style={{ color: isDarkMode ? "#e0e0e0" : "#212529" }}>
                    Category
                  </label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    style={{
                      backgroundColor: isDarkMode ? "#2c2c2c" : "#ffffff",
                      borderColor: isDarkMode ? "#444" : "#ced4da",
                      color: isDarkMode ? "#ffffff" : "#212529"
                    }}
                  >
                    <option value="">Select category</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing & Accessories</option>
                    <option value="documents">Documents & IDs</option>
                    <option value="jewelry">Jewelry & Watches</option>
                    <option value="others">Others</option>
                  </select>
                </div>
              </Col>
            </Row>

            <div className="mb-3">
              <label className="form-label fw-medium" style={{ color: isDarkMode ? "#e0e0e0" : "#212529" }}>
                Description
              </label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Detailed description (color, brand, distinguishing features)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                style={{ 
                  minHeight: "100px",
                  backgroundColor: isDarkMode ? "#2c2c2c" : "#ffffff",
                  borderColor: isDarkMode ? "#444" : "#ced4da",
                  color: isDarkMode ? "#ffffff" : "#212529"
                }}
              ></textarea>
            </div>

            <Row>
              <Col md={6}>
                <div className="mb-3">
                  <label className="form-label fw-medium" style={{ color: isDarkMode ? "#e0e0e0" : "#212529" }}>
                    Date Lost
                  </label>
                  <div className="input-group">
                    <span 
                      className="input-group-text"
                      style={{
                        backgroundColor: isDarkMode ? "#2c2c2c" : "#f8f9fa",
                        borderColor: isDarkMode ? "#444" : "#ced4da",
                        color: isDarkMode ? "#ffffff" : "#495057"
                      }}
                    >
                      <FaCalendarAlt color={isDarkMode ? "#ffffff" : "#495057"} />
                    </span>
                    <input
                      type="date"
                      className="form-control"
                      value={dateLost}
                      onChange={(e) => setDateLost(e.target.value)}
                      required
                      style={{
                        backgroundColor: isDarkMode ? "#2c2c2c" : "#ffffff",
                        borderColor: isDarkMode ? "#444" : "#ced4da",
                        color: isDarkMode ? "#ffffff" : "#212529"
                      }}
                    />
                  </div>
                </div>
              </Col>
              
              <Col md={6}>
                <div className="mb-3">
                  <label className="form-label fw-medium" style={{ color: isDarkMode ? "#e0e0e0" : "#212529" }}>
                    Location
                  </label>
                  <div className="input-group">
                    <span 
                      className="input-group-text"
                      style={{
                        backgroundColor: isDarkMode ? "#2c2c2c" : "#f8f9fa",
                        borderColor: isDarkMode ? "#444" : "#ced4da",
                        color: isDarkMode ? "#ffffff" : "#495057"
                      }}
                    >
                      <FaMapMarkerAlt color={isDarkMode ? "#ffffff" : "#495057"} />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Where was it lost?"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                      style={{
                        backgroundColor: isDarkMode ? "#2c2c2c" : "#ffffff",
                        borderColor: isDarkMode ? "#444" : "#ced4da",
                        color: isDarkMode ? "#ffffff" : "#212529"
                      }}
                    />
                  </div>
                </div>
              </Col>
            </Row>

            <div className="mb-3">
              <label className="form-label fw-medium" style={{ color: isDarkMode ? "#e0e0e0" : "#212529" }}>
                Contact Information
              </label>
              <div className="input-group">
                <span 
                  className="input-group-text"
                  style={{
                    backgroundColor: isDarkMode ? "#2c2c2c" : "#f8f9fa",
                    borderColor: isDarkMode ? "#444" : "#ced4da",
                    color: isDarkMode ? "#ffffff" : "#495057"
                  }}
                >
                  <FaEnvelope color={isDarkMode ? "#ffffff" : "#495057"} />
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Your email address"
                  value={contactInfo}
                  onChange={(e) => setContact(e.target.value)}
                  required
                  style={{
                    backgroundColor: isDarkMode ? "#2c2c2c" : "#ffffff",
                    borderColor: isDarkMode ? "#444" : "#ced4da",
                    color: isDarkMode ? "#ffffff" : "#212529"
                  }}
                />
              </div>
              <small style={{ color: isDarkMode ? "#aaaaaa" : "#6c757d" }}>
                This will be shared with potential finders
              </small>
            </div>

            <div className="mb-4">
              <label className="form-label fw-medium" style={{ color: isDarkMode ? "#e0e0e0" : "#212529" }}>
                Upload Image
              </label>
              <div className="d-flex flex-column flex-md-row gap-3 align-items-md-center">
                <div className="flex-shrink-0">
                  <label className="d-block cursor-pointer">
                    <div 
                      className="border rounded p-3 text-center"
                      style={{ 
                        width: "150px",
                        backgroundColor: isDarkMode ? "#2c2c2c" : "#f8f9fa",
                        borderColor: isDarkMode ? "#444" : "#ced4da"
                      }}
                    >
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="img-fluid rounded"
                          style={{ maxHeight: "100px" }}
                        />
                      ) : (
                        <div className="py-4">
                          <FaUpload 
                            size={24} 
                            color={isDarkMode ? "#ffffff" : "#6c757d"} 
                            className="mb-2" 
                          />
                          <div 
                            className="small"
                            style={{ color: isDarkMode ? "#aaaaaa" : "#6c757d" }}
                          >
                            Choose File
                          </div>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      className="d-none"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </label>
                </div>
                <div className="flex-grow-1">
                  <small 
                    style={{ color: isDarkMode ? "#aaaaaa" : "#6c757d" }}
                  >
                    {image ? image.name : "Upload a clear photo of the item (optional but recommended)"}
                  </small>
                </div>
              </div>
            </div>

            <div className="d-grid">
              <button 
                type="submit" 
                className="btn btn-primary btn-lg fw-medium py-2"
                disabled={loading}
                style={{
                  background: isDarkMode 
                    ? "linear-gradient(135deg, #4ca1af, #2c3e50)" 
                    : "linear-gradient(135deg, #667eea, #764ba2)",
                  border: "none"
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Submitting...
                  </>
                ) : (
                  "Submit Lost Item"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LostItemUpload;
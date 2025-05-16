import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser, FaLock, FaEnvelope, FaGlobeAfrica, FaMapPin, FaUpload } from "react-icons/fa";
import { Row, Col } from "react-bootstrap";
import useThemeStore from "../store/colorStore";
import axiosInstance from "../../axiosInstance";
const url = "/auth/createUser";

const Register = () => {
  const navigate = useNavigate();
  // State variables for all inputs
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("Tanzania");
  const [pinCode, setPinCode] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { isDarkMode } = useThemeStore();

  // Set theme with proper contrast
  useEffect(() => {
    document.body.style.backgroundColor = isDarkMode ? "#121212" : "#f8f9fa";
    document.body.style.color = isDarkMode ? "#e0e0e0" : "#212529";
  }, [isDarkMode]);

  // Redirect after successful registration
  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.length < 4) {
      newErrors.username = "Username must be at least 4 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!pinCode) {
      newErrors.pinCode = "PIN code is required";
    } else if (!/^\d+$/.test(pinCode)) {
      newErrors.pinCode = "PIN code must contain only numbers";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate image type and size
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 15 * 1024 * 1024; // 2MB
      
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          profileImage: "Only JPEG, PNG or GIF images are allowed"
        }));
        return;
      }
      
      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          profileImage: "Image size must be less than 2MB"
        }));
        return;
      }

      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
      
      // Clear any previous image errors
      setErrors(prev => ({
        ...prev,
        profileImage: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Create FormData instance
      const formData = new FormData();
      
      // Append all form data to FormData instance
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("country", country);
      formData.append("pinCode", pinCode);
      
      // Append the image file if it exists
      if (profileImage) {
        formData.append('Image', profileImage);
        console.log(formData.get("Image")); // should show the file object
      }

      const response = await axiosInstance.post(url, formData 
      );
      
      console.log("Registration successful:", response.data);
      setSubmitSuccess(true);
      
      // Reset form
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setCountry("Tanzania");
      setPinCode("");
      setProfileImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({
        server: error.response?.data?.message || "Registration failed. Please try again."
      });
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
            <FaUser className="me-2" />
            Create Account
          </h4>
        </div>
        
        <div className="card-body p-4">
          {submitSuccess && (
            <div 
              className="alert alert-success alert-dismissible fade show"
              style={{
                backgroundColor: isDarkMode ? "#1a3a1a" : "#d4edda",
                borderColor: isDarkMode ? "#2e5c2e" : "#c3e6cb",
                color: isDarkMode ? "#e0e0e0" : "#155724"
              }}
            >
              Registration successful! Redirecting to login page...
            </div>
          )}

          {errors.server && (
            <div 
              className="alert alert-danger alert-dismissible fade show"
              style={{
                backgroundColor: isDarkMode ? "#2c2c2c" : "#f8d7da",
                borderColor: isDarkMode ? "#444" : "#f5c6cb",
                color: isDarkMode ? "#ffffff" : "#721c24"
              }}
            >
              {errors.server}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setErrors(prev => ({ ...prev, server: "" }))}
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
                    Username
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
                      <FaUser color={isDarkMode ? "#ffffff" : "#495057"} />
                    </span>
                    <input
                      type="text"
                      name="username"
                      className={`form-control ${errors.username ? "is-invalid" : ""}`}
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      style={{
                        backgroundColor: isDarkMode ? "#2c2c2c" : "#ffffff",
                        borderColor: isDarkMode ? "#444" : "#ced4da",
                        color: isDarkMode ? "#ffffff" : "#212529"
                      }}
                    />
                  </div>
                  {errors.username && (
                    <div className="invalid-feedback d-block" style={{ color: "#dc3545" }}>
                      {errors.username}
                    </div>
                  )}
                </div>
              </Col>
              
              <Col md={6}>
                <div className="mb-3">
                  <label className="form-label fw-medium" style={{ color: isDarkMode ? "#e0e0e0" : "#212529" }}>
                    Email
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
                      name="email"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        backgroundColor: isDarkMode ? "#2c2c2c" : "#ffffff",
                        borderColor: isDarkMode ? "#444" : "#ced4da",
                        color: isDarkMode ? "#ffffff" : "#212529"
                      }}
                    />
                  </div>
                  {errors.email && (
                    <div className="invalid-feedback d-block" style={{ color: "#dc3545" }}>
                      {errors.email}
                    </div>
                  )}
                </div>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <div className="mb-3">
                  <label className="form-label fw-medium" style={{ color: isDarkMode ? "#e0e0e0" : "#212529" }}>
                    Password
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
                      <FaLock color={isDarkMode ? "#ffffff" : "#495057"} />
                    </span>
                    <input
                      type="password"
                      name="password"
                      className={`form-control ${errors.password ? "is-invalid" : ""}`}
                      placeholder="Create password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        backgroundColor: isDarkMode ? "#2c2c2c" : "#ffffff",
                        borderColor: isDarkMode ? "#444" : "#ced4da",
                        color: isDarkMode ? "#ffffff" : "#212529"
                      }}
                    />
                  </div>
                  {errors.password && (
                    <div className="invalid-feedback d-block" style={{ color: "#dc3545" }}>
                      {errors.password}
                    </div>
                  )}
                </div>
              </Col>
              
              <Col md={6}>
                <div className="mb-3">
                  <label className="form-label fw-medium" style={{ color: isDarkMode ? "#e0e0e0" : "#212529" }}>
                    Confirm Password
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
                      <FaLock color={isDarkMode ? "#ffffff" : "#495057"} />
                    </span>
                    <input
                      type="password"
                      name="confirmPassword"
                      className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{
                        backgroundColor: isDarkMode ? "#2c2c2c" : "#ffffff",
                        borderColor: isDarkMode ? "#444" : "#ced4da",
                        color: isDarkMode ? "#ffffff" : "#212529"
                      }}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <div className="invalid-feedback d-block" style={{ color: "#dc3545" }}>
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <div className="mb-3">
                  <label className="form-label fw-medium" style={{ color: isDarkMode ? "#e0e0e0" : "#212529" }}>
                    Country
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
                      <FaGlobeAfrica color={isDarkMode ? "#ffffff" : "#495057"} />
                    </span>
                    <input
                      type="text"
                      name="country"
                      className="form-control"
                      value={country}
                      readOnly
                      style={{
                        backgroundColor: isDarkMode ? "#2c2c2c" : "#e9ecef",
                        borderColor: isDarkMode ? "#444" : "#ced4da",
                        color: isDarkMode ? "#ffffff" : "#212529",
                        cursor: "not-allowed"
                      }}
                    />
                  </div>
                </div>
              </Col>
              
              <Col md={6}>
                <div className="mb-3">
                  <label className="form-label fw-medium" style={{ color: isDarkMode ? "#e0e0e0" : "#212529" }}>
                    PIN Code
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
                      <FaMapPin color={isDarkMode ? "#ffffff" : "#495057"} />
                    </span>
                    <input
                      type="text"
                      name="pinCode"
                      className={`form-control ${errors.pinCode ? "is-invalid" : ""}`}
                      placeholder="Enter your PIN code"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      style={{
                        backgroundColor: isDarkMode ? "#2c2c2c" : "#ffffff",
                        borderColor: isDarkMode ? "#444" : "#ced4da",
                        color: isDarkMode ? "#ffffff" : "#212529"
                      }}
                    />
                  </div>
                  {errors.pinCode && (
                    <div className="invalid-feedback d-block" style={{ color: "#dc3545" }}>
                      {errors.pinCode}
                    </div>
                  )}
                </div>
              </Col>
            </Row>

            <div className="mb-4">
              <label className="form-label fw-medium" style={{ color: isDarkMode ? "#e0e0e0" : "#212529" }}>
                Profile Image
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
                            Choose Image
                          </div>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      className="d-none"
                      onChange={handleImageChange}
                      accept="image/*"
                      name="Image"
                    />
                  </label>
                </div>
                <div className="flex-grow-1">
                  <small 
                    style={{ color: isDarkMode ? "#aaaaaa" : "#6c757d" }}
                  >
                    {profileImage ? profileImage.name : "Upload a profile picture (optional)"}
                  </small>
                  {errors.profileImage && (
                    <div className="invalid-feedback d-block" style={{ color: "#dc3545" }}>
                      {errors.profileImage}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="d-grid">
              <button 
                type="submit" 
                className="btn btn-primary btn-lg fw-medium py-2"
                disabled={loading || submitSuccess}
                style={{
                  background: isDarkMode 
                    ? "linear-gradient(135deg, #4ca1af, #2c3e50)" 
                    : "linear-gradient(135deg, #667eea, #764ba2)",
                  border: "none",
                  opacity: submitSuccess ? 0.7 : 1
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Registering...
                  </>
                ) : submitSuccess ? (
                  "Registration Successful!"
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
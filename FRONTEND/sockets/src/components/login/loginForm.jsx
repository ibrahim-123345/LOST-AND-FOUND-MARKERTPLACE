import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaLock, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import useAuthStore from "../store/authStore";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [loading, setLoading] = useState(false); // New loading state

  const setToken = useAuthStore((state) => state.setToken); // Zustand store for token
  const navigate = useNavigate(); 

  
  const isDarkMode = localStorage.getItem("isDarkMode") === "true";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      
      setIsAuthorized(false);
      navigate("/"); 
    }
  }, [navigate]); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    try {

      
      const response = await axios.post("http://localhost:7000/auth/login", {
        username,
        password,
      });

      setPassword("");
      setUsername("");

      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);

      navigate("/"); 
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) {
    return null; 
  }

  return (
    <div
      style={{
        ...styles.container,
        backgroundColor: isDarkMode ? "#333" : "#fff", // Update background color based on dark mode
      }}
    >
      <div style={styles.form}>
        <h2 style={{ ...styles.heading, color: isDarkMode ? "#fff" : "#333" }}>
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label
              style={{ ...styles.label, color: isDarkMode ? "#fff" : "#555" }}
              htmlFor="username"
            >
              <FaUser style={styles.icon} /> Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label
              style={{ ...styles.label, color: isDarkMode ? "#fff" : "#555" }}
              htmlFor="password"
            >
              <FaLock style={styles.icon} /> Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={{ ...styles.button, backgroundColor: isDarkMode ? "#555" : "#667eea" }}>
            {loading ? (
              <FaSpinner style={styles.spinner} className="fa-spin" />
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// Inline CSS styles
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    transition: "background-color 0.3s ease", // Smooth transition for background color
  },
  form: {
    background: "white",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    width: "350px",
  },
  heading: {
    marginBottom: "1rem",
  },
  formGroup: {
    marginBottom: "1rem",
    textAlign: "left",
  },
  label: {
    display: "flex",
    alignItems: "center",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  icon: {
    marginRight: "8px",
    color: "#667eea",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "2px solid #ddd",
    borderRadius: "8px",
    outline: "none",
    fontSize: "16px",
    transition: "0.3s ease",
  },
  button: {
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "25px",
    color: "white",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s ease",
    marginTop: "10px",
  },
  spinner: {
    fontSize: "24px",
    color: "white",
  },
};

export default LoginForm;

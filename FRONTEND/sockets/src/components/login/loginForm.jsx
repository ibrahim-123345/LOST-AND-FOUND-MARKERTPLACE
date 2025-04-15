import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaLock, FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [bgColor, setBgColor] = useState("#f8f9fa");
  const [textColor, setTextColor] = useState("#212529");

  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthorized(false);
      navigate("/");
    }

    // Dynamic background and text color based on dark mode
    const isDarkMode = localStorage.getItem("isDarkMode") === "true";
    setBgColor(isDarkMode ? "#121212" : "#f8f9fa");
    setTextColor(isDarkMode ? "#e0e0e0" : "#212529");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:7000/auth/login", {
        username,
        password,
      });

      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) return null;

  return (
    <div style={{
      ...styles.container,
      backgroundColor: bgColor,
      transition: "background-color 0.5s ease",
    }}>
      <div style={{
        ...styles.form,
        background: `linear-gradient(145deg, ${textColor === "#e0e0e0" ? "#2a2a2a" : "#ffffff"}, ${textColor === "#e0e0e0" ? "#1e1e1e" : "#f9f9f9"})`,
        boxShadow: `0 15px 35px ${textColor === "#e0e0e0" ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"}`,
        border: `1px solid ${textColor === "#e0e0e0" ? "#444" : "#eee"}`
      }}>
        <div style={styles.logoContainer}>
       
          <h2 style={{ ...styles.heading, color: textColor }}>Welcome Back</h2>
          <p style={{ color: textColor === "#e0e0e0" ? "#aaa" : "#777", marginTop: "4px" }}>
            Please enter your credentials
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <div style={{
              ...styles.inputContainer,
              borderColor: textColor === "#e0e0e0" ? "#444" : "#ddd",
              backgroundColor: textColor === "#e0e0e0" ? "#2a2a2a" : "#fff"
            }}>
              <FaUser style={{
                ...styles.inputIcon,
                color: textColor === "#e0e0e0" ? "#aaa" : "#667eea"
              }} />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  ...styles.input,
                  color: textColor,
                  backgroundColor: "transparent"
                }}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <div style={{
              ...styles.inputContainer,
              borderColor: textColor === "#e0e0e0" ? "#444" : "#ddd",
              backgroundColor: textColor === "#e0e0e0" ? "#2a2a2a" : "#fff"
            }}>
              <FaLock style={{
                ...styles.inputIcon,
                color: textColor === "#e0e0e0" ? "#aaa" : "#667eea"
              }} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  ...styles.input,
                  color: textColor,
                  backgroundColor: "transparent"
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.togglePassword}
              >
                {showPassword ? (
                  <FaEyeSlash color={textColor === "#e0e0e0" ? "#aaa" : "#667eea"} />
                ) : (
                  <FaEye color={textColor === "#e0e0e0" ? "#aaa" : "#667eea"} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              opacity: loading ? 0.8 : 1
            }}
            disabled={loading}
          >
            {loading ? (
              <FaSpinner style={styles.spinner} className="fa-spin" />
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <p style={{ color: textColor === "#e0e0e0" ? "#aaa" : "#777" }}>
            Don't have an account?{" "}
            <a href="/register" style={{ color: "#667eea", textDecoration: "none" }}>
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "20px",
  },
  form: {
    width: "100%",
    maxWidth: "420px",
    padding: "40px",
    borderRadius: "16px",
    transition: "all 0.3s ease",
  },
  logoContainer: {
    textAlign: "center",
    marginBottom: "30px",
  },
  logo: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px",
    fontSize: "24px",
    fontWeight: "bold",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "8px",
    transition: "color 0.3s ease",
  },
  formGroup: {
    marginBottom: "20px",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    border: "1px solid",
    borderRadius: "12px",
    padding: "0 15px",
    transition: "all 0.3s ease",
  },
  inputIcon: {
    marginRight: "12px",
    fontSize: "16px",
  },
  input: {
    flex: 1,
    height: "50px",
    border: "none",
    outline: "none",
    fontSize: "15px",
    padding: "0",
    "&::placeholder": {
      color: "#aaa",
    },
  },
  togglePassword: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0",
    marginLeft: "10px",
  },
  button: {
    width: "100%",
    height: "50px",
    border: "none",
    borderRadius: "12px",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "10px",
    boxShadow: "0 4px 14px rgba(102, 126, 234, 0.3)",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
    },
  },
  spinner: {
    fontSize: "20px",
    color: "white",
  },
};

export default LoginForm;
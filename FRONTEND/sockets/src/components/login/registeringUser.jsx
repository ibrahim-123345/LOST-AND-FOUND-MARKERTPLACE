import React, { useState } from 'react';
import { FaUpload, FaUser, FaEnvelope, FaLock, FaGlobe, FaMapMarkerAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import axiosInstance from '../../axiosInstance';
import { useNavigate } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    country: '',
    streetCode: '',
    profilePicture: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]+$/;

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (!usernameRegex.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.streetCode.trim()) newErrors.streetCode = 'Street code is required';
    if (!formData.profilePicture) newErrors.profilePicture = 'Profile picture is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'profilePicture') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          data.append(key, value);
        }
      });

      const response = await axios.post('http://localhost:7000/auth/createUser', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status >= 200 && response.status < 300) {
        setSuccessMessage('Registration successful! Redirecting...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        throw new Error(response.data?.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = error.response.data.message || 'Username already exists';
        } else if (error.response.data?.errors) {
          // Handle backend validation errors
          setErrors(error.response.data.errors);
          errorMessage = 'Please fix the form errors';
        } else {
          errorMessage = error.response.data?.message || errorMessage;
        }
      }
      
      setErrors(prev => ({ ...prev, form: errorMessage }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2>Create an Account</h2>
          <p className="subtitle">Join Lost & Found Community Today</p>
        </div>

        {errors.form && (
          <div className="error-message">
            {errors.form}
          </div>
        )}

        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="fullName">
              <FaUser className="input-icon" />
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="moh"
              className={errors.fullName ? 'error' : ''}
            />
            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="username">
              <FaUser className="input-icon" />
              Username *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="moh@123"
              className={errors.username ? 'error' : ''}
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope className="input-icon" />
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="moh@example.com"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <FaLock className="input-icon" />
              Password *
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={errors.password ? 'error' : ''}
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="country">
                <FaGlobe className="input-icon" />
                Country *
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Your country"
                className={errors.country ? 'error' : ''}
              />
              {errors.country && <span className="error-text">{errors.country}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="streetCode">
                <FaMapMarkerAlt className="input-icon" />
                Street Code *
              </label>
              <input
                type="text"
                id="streetCode"
                name="streetCode"
                value={formData.streetCode}
                onChange={handleChange}
                placeholder="123 Main St"
                className={errors.streetCode ? 'error' : ''}
              />
              {errors.streetCode && <span className="error-text">{errors.streetCode}</span>}
            </div>
          </div>

          <div className="form-group file-upload">
            <label>
              <FaUpload className="input-icon" />
              Profile Picture *
            </label>
            <div className="upload-area">
              <label className={`upload-button ${errors.profilePicture ? 'error' : ''}`}>
                Choose File
                <input
                  type="file"
                  id="profilePicture"
                  name="profilePicture"
                  accept="image/*"
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />
              </label>
              {formData.profilePicture && (
                <span className="file-name">{formData.profilePicture.name}</span>
              )}
            </div>
            {errors.profilePicture && <span className="error-text">{errors.profilePicture}</span>}
          </div>

          <button 
            type="submit" 
            className="submit-button" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <PulseLoader color="#ffffff" size={8} />
            ) : (
              'Register'
            )}
          </button>
        </form>
      </div>

      <style jsx>{`
        .register-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 2rem;
        }
        
        .register-card {
          width: 100%;
          max-width: 500px;
          background: #fff;
          padding: 2.5rem;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }
        
        .register-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        h2 {
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
          color: #2d3748;
        }
        
        .subtitle {
          color: #718096;
          font-size: 0.95rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
          position: relative;
        }
        
        .form-row {
          display: flex;
          gap: 1rem;
        }
        
        .form-row .form-group {
          flex: 1;
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          font-weight: 500;
          color: #4a5568;
          display: flex;
          align-items: center;
        }
        
        .input-icon {
          margin-right: 0.5rem;
          color: #667eea;
          font-size: 0.9rem;
        }
        
        input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.3s;
        }
        
        input.error {
          border-color: #e53e3e;
        }
        
        input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .error-text {
          color: #e53e3e;
          font-size: 0.8rem;
          margin-top: 0.25rem;
          display: block;
        }
        
        .error-message {
          color: #e53e3e;
          background-color: #fff5f5;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          border: 1px solid #fed7d7;
          font-size: 0.9rem;
        }
        
        .success-message {
          color: #38a169;
          background-color: #f0fff4;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          border: 1px solid #c6f6d5;
          font-size: 0.9rem;
        }
        
        .file-upload {
          margin-top: 1.5rem;
        }
        
        .upload-area {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .upload-button {
          padding: 0.6rem 1.2rem;
          background: #edf2f7;
          color: #4a5568;
          border-radius: 6px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border: 1px solid transparent;
        }
        
        .upload-button.error {
          border-color: #e53e3e;
          background-color: #fff5f5;
        }
        
        .upload-button:hover {
          background: #e2e8f0;
        }
        
        .file-name {
          font-size: 0.85rem;
          color: #718096;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 200px;
        }
        
        .password-input-container {
          position: relative;
        }
        
        .toggle-password {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #718096;
          cursor: pointer;
          padding: 0.5rem;
        }
        
        .submit-button {
          width: 100%;
          padding: 0.85rem;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .submit-button:hover {
          background: #5a67d8;
        }
        
        .submit-button:disabled {
          background: #a0aec0;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default Register;
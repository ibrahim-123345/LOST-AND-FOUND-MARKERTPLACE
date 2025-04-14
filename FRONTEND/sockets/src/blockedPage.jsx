import React from 'react';
import { Link } from 'react-router-dom';

const BlockedPage = () => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="container mt-5">
      <div className="alert alert-danger text-center">
        <h2>Account Blocked</h2>
        <p className="lead">
          Your account has been suspended due to policy violations. 
          Please contact the administrator to resolve this issue.
        </p>
        <div className="mt-4">
          <button onClick={handleLogout} className="btn btn-primary me-3">
            Return to Home
          </button>
          <a href="mailto:admin@example.com" className="btn btn-outline-dark">
            Contact Administrator
          </a>
        </div>
      </div>
    </div>
  );
};

export default BlockedPage;
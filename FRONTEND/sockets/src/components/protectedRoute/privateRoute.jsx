import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';


const PrivateRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) {

    return <Navigate to="/page-not-found" />;
  }

  
  return <Outlet />;
};

export default PrivateRoute;

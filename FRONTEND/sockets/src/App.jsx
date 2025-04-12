import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import LoginForm from './components/login/loginForm';
import HomePage from './home';
//import LostItem from './components/lostitems/lostItemUpload';
import FoundItem from './components/founditems/foundItemForm';
import LostItemsPage from './components/lostitems/lostitemDisplay';
import LostItemDetails from './components/lostitems/lostitemDisplayD';
import CommunityChat from './components/chat/communitychat/communityChat';
import Account from './components/acount/user/account';
import PageNotFound from './components/protectedRoute/pageNotFound';
import FoundItemsPage from "./components/founditems/founditemDisplay";
import FoundItemDetails from "./components/founditems/founditemDisplayD";
import Logout from "./components/login/logout";
import AdminDashboard from './components/acount/admin/admin dashboard';
import UserDashboard from './components/acount/user/account';
import LostAndFoundDashboard from './components/acount/user/account';
import LostItemUpload from './components/lostitems/lostItemUpload';

// Function to check if a user is authenticated
const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

// Function to get the user's role from localStorage
const getUserRole = () => {
  return localStorage.getItem("role");
};

// Protected Route Component (Role-Based)
const ProtectedRoute = ({ element, allowedRoles }) => {
  const role = getUserRole();
  
  // Check if the user is authenticated and if their role matches one of the allowed roles for the route
  return isAuthenticated() && allowedRoles.includes(role) ? element : <Navigate to="/page-not-found" replace />;
};

// Login Route Protection - if token exists, redirect to homepage
const LoginRedirect = () => {
  return isAuthenticated() ? <Navigate to="/" replace /> : <LoginForm />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginRedirect />} />

        {/* Protected Routes (Require Authentication) */}
        <Route path="/lost-itemsPost" element={<ProtectedRoute element={<LostItemUpload />} allowedRoles={['User', 'Admin']}  />} />
        <Route path="/foundItems" element={<ProtectedRoute element={<FoundItemsPage />} allowedRoles={['User', 'Admin']}  />} />
        <Route path="/foundItemReport" element={<ProtectedRoute element={<FoundItem />} allowedRoles={['User', 'Admin']}  />} />
        <Route path="/lostitems" element={<ProtectedRoute element={<LostItemsPage />} allowedRoles={['User', 'Admin']}  />} />
        <Route path="/lostitem/:id" element={<ProtectedRoute element={<LostItemDetails />} allowedRoles={['User', 'Admin']}  />} />
        <Route path="/foundid/:id" element={<ProtectedRoute element={<FoundItemDetails />} allowedRoles={['User', 'Admin']} />} />
        <Route path="/communitychat" element={<ProtectedRoute element={<CommunityChat />} allowedRoles={['User', 'Admin']} />} />
        <Route path="/account" element={<ProtectedRoute element={<Account />} allowedRoles={['User']} />} />
        <Route path="/logout" element={<ProtectedRoute element={<Logout />} allowedRoles={['User', 'Admin']} />} />

        {/* Admin Dashboard - Only Accessible by Admin */}
        <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={['Admin']} />} />

        {/* User Dashboard - Only Accessible by User */}
        <Route path="/user" element={<ProtectedRoute element={<UserDashboard />} allowedRoles={['User']} />} />

        {/* 404 Page for Unauthorized Access */}
        <Route path="/page-not-found" element={<PageNotFound />} />

     
      </Routes>
    </Router>
  );
};

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import LoginForm from './components/login/loginForm';
import HomePage from './home';
import LostItem from './components/lostitems/lostItemUpload';
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

// Function to check if a user is authenticated
const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/page-not-found" replace />;
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
        <Route path="/lost-itemsPost" element={<ProtectedRoute element={<LostItem />} />} />
        <Route path="/foundItems" element={<ProtectedRoute element={<FoundItemsPage />} />} />
        <Route path="/foundItemReport" element={<ProtectedRoute element={<FoundItem />} />} />
        <Route path="/lostitems" element={<ProtectedRoute element={<LostItemsPage />} />} />
        <Route path="/lostitem/:id" element={<ProtectedRoute element={<LostItemDetails />} />} />
        <Route path="/foundid/:id" element={<ProtectedRoute element={<FoundItemDetails />} />} />
        <Route path="/communitychat" element={<ProtectedRoute element={<CommunityChat />} />} />
        <Route path="/account" element={<ProtectedRoute element={<Account />} />} />
        <Route path="/logout" element={<ProtectedRoute element={<Logout />} />} />
        <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} />} />
        <Route path="/user" element={<ProtectedRoute element={<UserDashboard />} />} />

        {/* 404 Page for Unauthorized Access */}
        <Route path="/page-not-found" element={<PageNotFound />} />

        {/* Catch-All for Unknown Routes */}
        <Route path="*" element={<Navigate to="/page-not-found" replace />} />
      </Routes>
    </Router>
  );
};

export default App;

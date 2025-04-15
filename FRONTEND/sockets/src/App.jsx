import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import LoginForm from './components/login/loginForm';
import HomePage from './home';
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
import LostItemUpload from './components/lostitems/lostItemUpload'; 
import BlockedPage from './blockedPage';
import Register from './components/login/registeringUser';

// Authentication functions
const isAuthenticated = () => localStorage.getItem("token") !== null;
const getUserRole = () => localStorage.getItem("role");

// Protected Route Component (Role-Based)
const ProtectedRoute = ({ element, allowedRoles }) => {
  const role = getUserRole();
  return isAuthenticated() && allowedRoles.includes(role) ? element : <Navigate to="/page-not-found" replace />;
};

// Login Route Protection
const LoginRedirect = () => (isAuthenticated() ? <Navigate to="/" replace /> : <LoginForm />);

const App = () => {
  const status = localStorage.getItem("status");
  
  // If user is blocked, show blocked page for all routes
  if (status === "blocked") {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<BlockedPage />} />
        </Routes>
      </Router>
    );
  }

  // Normal routing for non-blocked users
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginRedirect />} />
        <Route path="/register" element={<Register/>} />

        {/* Protected Routes */}
        <Route path="/lost-itemsPost" element={<ProtectedRoute element={<LostItemUpload />} allowedRoles={['User', 'Admin']} />} />
        <Route path="/foundItems" element={<ProtectedRoute element={<FoundItemsPage />} allowedRoles={['User', 'Admin']} />} />
        <Route path="/foundItemReport" element={<ProtectedRoute element={<FoundItem />} allowedRoles={['User', 'Admin']} />} />
        <Route path="/lostitems" element={<ProtectedRoute element={<LostItemsPage />} allowedRoles={['User', 'Admin']} />} />
        <Route path="/lostitem/:id" element={<ProtectedRoute element={<LostItemDetails />} allowedRoles={['User', 'Admin']} />} />
        <Route path="/foundid/:id" element={<ProtectedRoute element={<FoundItemDetails />} allowedRoles={['User', 'Admin']} />} />
        <Route path="/communitychat" element={<ProtectedRoute element={<CommunityChat />} allowedRoles={['User', 'Admin']} />} />
        <Route path="/account" element={<ProtectedRoute element={<Account />} allowedRoles={['User']} />} />
        <Route path="/logout" element={<ProtectedRoute element={<Logout />} allowedRoles={['User', 'Admin']} />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={['Admin']} />} />

        {/* 404 Handling */}
        <Route path="/page-not-found" element={<PageNotFound />} />
        <Route path="*" element={<Navigate to="/page-not-found" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
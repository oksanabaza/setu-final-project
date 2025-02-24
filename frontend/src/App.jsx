import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import AddSiteForm from './components/AddSiteForm';
import { getToken } from './utils/api';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(getToken() !== null);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleSignup = () => {
    setIsAuthenticated(true); 
  };

  return (
    <Router>
      <Routes>
        {/* Default route for '/' */}
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/add-site" /> : <Navigate to="/login" />
        } />

        {/* Login route */}
        <Route path="/login" element={
          !isAuthenticated ? (
            <LoginForm onLogin={handleLogin} />
          ) : (
            <Navigate to="/add-site" />
          )
        } />

        {/* Signup route */}
        <Route path="/signup" element={
          !isAuthenticated ? (
            <SignupForm onSignup={handleSignup} />
          ) : (
            <Navigate to="/add-site" />
          )
        } />

        {/* Add website route */}
        <Route path="/add-site" element={
          isAuthenticated ? <AddSiteForm /> : <Navigate to="/login" />
        } />
      </Routes>
    </Router>
  );
};

export default App;

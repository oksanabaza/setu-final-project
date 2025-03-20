import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import ScraperDashboard from './components/ScraperDashboard';
import { getToken, removeToken } from './utils/api';
import './index.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());

  useEffect(() => {
    setIsAuthenticated(!!getToken());
  }, []);

  const handleLogin = (token) => {
    // saveToken(token);
    setIsAuthenticated(true);
  };

  const handleSignup = (token) => {
    // saveToken(token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    removeToken();
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />

        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginForm onLogin={handleLogin} />}
        />

        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignupForm onSignup={handleSignup} />}
        />

        <Route
          path="/dashboard"
          element={isAuthenticated ? <ScraperDashboard onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;

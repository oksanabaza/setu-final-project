import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import ScraperDashboard from './components/ScraperDashboard';
import { getToken, removeToken } from './utils/api';
import './index.css';
import WebsiteList from './components/WebsiteList';
import TemplateList from './components/TemplateList'
import TemplateDetail from './components/TemplateDetail'
import  AddWebsiteForm from './components/AddWebsiteForm'
import ScrapingTasks from './components/ScrapingTasks'
import ScrapingTaskDetail from './components/ScrapingTaskDetail'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());
  const [isLoggedOut, setIsLoggedOut] = useState(false); 

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
    setIsLoggedOut(true); 
  };

  return (

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
        <Route
          path="/websites"
          element={isAuthenticated ? <WebsiteList onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
         <Route
          path="/templates"
          element={isAuthenticated ? <TemplateList onLogout={handleLogout} /> : <Navigate to="/templates" />}
        />
        <Route
  path="/templates/:id"
  element={isAuthenticated ? <TemplateDetail onLogout={handleLogout} /> : <Navigate to="/login" />}
/>
<Route
  path="/websites/create"
  element={isAuthenticated ? <AddWebsiteForm onLogout={handleLogout} /> : <Navigate to="/websites/create" />}
/>
<Route
  path="/scraping-tasks"
  element={isAuthenticated ? <ScrapingTasks onLogout={handleLogout} /> : <Navigate to="/scraping-tasks" />}
/>
<Route
  path="/scraping-task/:id"
  element={isAuthenticated ? <ScrapingTaskDetail onLogout={handleLogout} /> : <Navigate to="/login" />}
/>

      </Routes>

  );
};

export default App;

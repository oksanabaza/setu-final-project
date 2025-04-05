import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import ScraperDashboard from './components/ScraperDashboard';
import { getToken, removeToken } from './utils/api';
import WebsiteList from './components/WebsiteList';
import TemplateList from './components/TemplateList';
import TemplateDetail from './components/TemplateDetail';
import AddWebsiteForm from './components/AddWebsiteForm';
import ScrapingTasks from './components/ScrapingTasks';
import ScrapingTaskDetail from './components/ScrapingTaskDetail';
import EditTemplate from './components/EditTemplate';
import RecentTasks from './components/RecentTasks';
import BaseLayout from './components/BaseLayout';
import RecentTaskDetails from './components/RecentTaskDetails'
import Charts from './components/Charts'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());

  useEffect(() => {
    setIsAuthenticated(!!getToken());
  }, []);

  const handleLogout = () => {
    removeToken();
    setIsAuthenticated(false);
  };

  return (
    <Routes>
      {/* Redirect to login or dashboard based on authentication */}
      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />

      {/* Public Routes */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginForm />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignupForm />} />

      {/* Protected Routes inside BaseLayout */}
      {isAuthenticated ? (
        <Route element={<BaseLayout onLogout={handleLogout}  />}>
          <Route path="/dashboard" element={<ScraperDashboard />} />
          <Route path="/websites" element={<WebsiteList />} />
          <Route path="/templates" element={<TemplateList />} />
          <Route path="/templates/:id" element={<TemplateDetail />} />
          <Route path="/websites/create" element={<AddWebsiteForm />} />
          <Route path="/scraping-tasks" element={<ScrapingTasks />} />
          <Route path="/scraping-task/:id" element={<ScrapingTaskDetail />} />
          <Route path="/templates/edit/:id" element={<EditTemplate />} />
          <Route path="/get-results" element={<RecentTasks />} />
          <Route path="/get-results/:task_id" element={<RecentTaskDetails />} />
          <Route path="/charts" element={<Charts />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  );
};

export default App;
    
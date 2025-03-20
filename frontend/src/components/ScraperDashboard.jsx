import React, { useEffect, useState } from 'react';
import { getSites } from '../utils/api';
import AddSiteForm from './AddSiteForm';

const ScraperDashboard = ({ onLogout }) => {
  const [websites, setWebsites] = useState([]);

  useEffect(() => {
    fetchWebsites();
  }, []);

  const fetchWebsites = async () => {
    try {
      const data = await getSites();
      setWebsites(data);
    } catch (err) {
      console.error("Error fetching websites:", err);
    }
  };

  return (
    <div>
      <h1>Website Scraper Dashboard</h1>
      <button onClick={onLogout}>Logout</button>

      <h2>Website List</h2>
      <ul>
        {websites.length > 0 ? (
          websites.map((site, index) => (
            <li key={site.website_id || index}> 
              <a href={site.url} target="_blank" rel="noopener noreferrer">
                {site.name}
              </a> - {site.is_active ? "Active" : "Inactive"}
            </li>
          ))
        ) : (
          <p>No websites found.</p>
        )}
      </ul>

      <h2>Add a New Website</h2>
      <AddSiteForm onSiteAdded={fetchWebsites} />
    </div>
  );
};

export default ScraperDashboard;

import React, { useEffect, useState } from 'react';
import { getDashboard } from '../services/api';

const Dashboard = ({ token }) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    getDashboard(token)
      .then((data) => setMessage(data.message))
      .catch((error) => console.error('Error:', error));
  }, [token]);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{message ? message : 'Loading...'}</p>
    </div>
  );
};

export default Dashboard;

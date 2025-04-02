import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const RecentTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchRecentTasks = async () => {
        try {
          const response = await fetch('http://localhost:8080/scraping-tasks', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (!response.ok) {
            throw new Error(`Failed to fetch templates (Status: ${response.status})`);
          }
  
          const data = await response.json();
          setTasks(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
    };

    fetchRecentTasks();
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Recent Tasks</h2>
      {tasks.length === 0 ? (
        <p>No recent tasks found</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.task_id}>
              <Link to={`/get-results/${task.task_id}`}>
                Task ID: {task.task_id} - Created At: {task.created_at}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentTasks;

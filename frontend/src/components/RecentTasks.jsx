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
        if (!token) {
          throw new Error('No authentication token found');
        }

        const taskId = 6; 
        const response = await fetch(`http://localhost:8080/get-results?task_id=${taskId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, 
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const data = await response.json();


        if (data.Result) {
          try {
            const parsedResult = JSON.parse(data.Result);

            if (Array.isArray(parsedResult)) {
              setTasks(parsedResult);
            } else {
              throw new Error('Result is not an array');
            }
          } catch (err) {
            throw new Error('Error parsing Result');
          }
        } else {
          throw new Error('Result field is missing in response');
        }
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
      {/* <h2>Recent Tasks</h2>
      {tasks.length === 0 ? (
        <p>No recent tasks found</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <>
            <li key={task.task_id}>
              <Link to={`/scraping-task/${task.task_id}`}>
                Task ID: {task.task_id} - Created At: {task.created_at}
              </Link>
            </li>
            
            </>
          ))}
        </ul>
      )} */}
      output
    </div>
  );
};

export default RecentTasks;

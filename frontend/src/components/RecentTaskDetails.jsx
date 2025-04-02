import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';

const RecentTaskDetails = () => {
  const { task_id } = useParams();  
  const [taskDetails, setTaskDetails] = useState(null);
  const token = useMemo(() => localStorage.getItem('token'), []);
console.log(token,'token')
  useEffect(() => {
    fetch(`http://localhost:8080/get-results/${task_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      }
    })
      .then(response => response.json())
      .then(data => setTaskDetails(data))
      .catch(error => console.error('Error fetching task details:', error));
  }, [task_id, token]); 

  if (!taskDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Task Details</h2>
  
   <div>{taskDetails.Result}</div>
    </div>
  );
};

export default RecentTaskDetails;

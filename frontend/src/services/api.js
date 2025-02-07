import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';  

export const getDashboard = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/dashboard/`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

const API_URL = 'http://localhost:8080'; 

export const login = async (email, password) => {
    const response = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
  
    const data = await response.json();

    localStorage.setItem('token', data.token);
  };
  
export const signup = async (email, password) => {
    const response = await fetch('http://localhost:8080/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  
    if (!response.ok) {
      throw new Error('Signup failed');
    }
  
    const data = await response.json();

    localStorage.setItem('token', data.token);
  };

export const getSites = async () => {
  const token = localStorage.getItem('token'); 
  const response = await fetch(`${API_URL}/websites`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`, 
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch sites');
  }

  return response.json();
};

export const addSite = async (siteData) => {
  const token = localStorage.getItem('token'); 

  const response = await fetch(`${API_URL}/websites/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
    },
    body: JSON.stringify(siteData),
  });

  if (!response.ok) {
    throw new Error('Failed to add site');
  }
};

// Function to get the JWT token from local storage
export const getToken = () => {
  return localStorage.getItem('token');
};
export const removeToken =()=>{
  return localStorage.removeItem('token')
}
const API_URL = 'http://localhost:8080'; 


export const fetchWithAuth = async (url, options = {}) => {
  const token = getToken();

  const headers = {
    ...(options.headers || {}),
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    removeToken();
    window.location.href = "/login";
    return null;
  }

  return response;
};

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
    localStorage.setItem('user_id', data.user_id);
    
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
export const fetchTemplateById = async (id) => {
  const token = localStorage.getItem('token'); 
  const response = await fetch(`http://localhost:8080/templates/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch template.');
  }

  return response.json();
};


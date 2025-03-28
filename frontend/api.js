const API_URL = 'http://localhost:8080';

export async function signup(email, password) {
  const response = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}

export async function login(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}

export async function addSite(token, url, xpath) {
  const response = await fetch(`${API_URL}/websites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, 
    },
    body: JSON.stringify({ url, xpath }),
  });
  return response.json();
}
export const fetchTemplateById = async (id) => {
  const response = await fetch(`http://localhost:8080/templates/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch template.");
  }
  const data = await response.json();
  return data;
};

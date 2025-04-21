// const API_URL = 'https://setu-final-project.onrender.com';

// export const getToken = () => localStorage.getItem("token");

// export const removeToken = () => localStorage.removeItem("token");

// export const fetchWithAuth = async (url, options = {}) => {
//   const token = getToken();

//   const headers = {
//     ...(options.headers || {}),
//     Authorization: token ? `Bearer ${token}` : "",
//     "Content-Type": "application/json",
//   };

//   const response = await fetch(url, {
//     ...options,
//     headers,
//   });

//   if (response.status === 401) {
//     removeToken();
//     window.location.href = "/login?expired=true";
//     return null;
//   }

//   return response;
// };

// export async function signup(email, password) {
//   const response = await fetch(`${API_URL}/signup`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ email, password }),
//   });
//   return response.json();
// }

// export async function login(email, password) {
//   const response = await fetch(`${API_URL}/login`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ email, password }),
//   });
//   return response.json();
// }

// export async function addSite(token, url, xpath) {
//   const response = await fetch(`${API_URL}/websites`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`, 
//     },
//     body: JSON.stringify({ url, xpath }),
//   });
//   return response.json();
// }
// export const fetchTemplateById = async (id) => {
//   const response = await fetch(`https://setu-final-project.onrender.com/templates/${id}`);
//   if (!response.ok) {
//     throw new Error("Failed to fetch template.");
//   }
//   const data = await response.json();
//   return data;
// };

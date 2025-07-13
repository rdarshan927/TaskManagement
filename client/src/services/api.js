import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with an error status
      console.error('Response error:', {
        data: error.response.data,
        status: error.response.status,
        headers: error.response.headers
      });
      
      // You could add specific handling based on status codes
      if (error.response.status === 401) {
        // Handle unauthorized (e.g., redirect to login)
        localStorage.removeItem('token');
        // window.location.href = '/login'; // Uncomment if you want auto-redirect
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request error - no response:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
import axios from 'axios';

// Create an instance of axios
const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_DOMAIN || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If the error is due to an expired token (401 Unauthorized)
    if (error.response && error.response.status === 401) {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
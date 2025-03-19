import axios from 'axios';
import { store } from '../redux/store';
import { logoutUser } from '../redux/features/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_DOMAIN,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
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

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && 
        error.response.status === 401 && 
        (error.response.data.message === "Token không hợp lệ" || 
         error.response.data.message === "Không tìm thấy token")) {
      
      // Đảm bảo xóa token và user data trước
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Sau đó dispatch action logout để cập nhật state
      store.dispatch(logoutUser());
      
      if (window.location.pathname !== '/login') {
        const returnUrl = window.location.pathname + window.location.search;
        window.location.href = `/login?returnUrl=${encodeURIComponent(returnUrl)}`;
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
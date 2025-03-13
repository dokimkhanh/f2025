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
    // Nếu lỗi là token không hợp lệ (401)
    if (error.response && 
        error.response.status === 401 && 
        (error.response.data.message === "Token không hợp lệ" || 
         error.response.data.message === "Không tìm thấy token")) {
      
      // Đăng xuất người dùng
      store.dispatch(logoutUser());
      
      // Chuyển hướng đến trang đăng nhập
      if (window.location.pathname !== '/login') {
        // Lưu URL hiện tại để sau khi đăng nhập có thể quay lại
        const returnUrl = window.location.pathname + window.location.search;
        window.location.href = `/login?returnUrl=${encodeURIComponent(returnUrl)}`;
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
import api from '../utils/axiosConfig';

// Lấy danh sách tất cả đơn hàng (cho admin)
export const getAllOrders = async (page = 1) => {
  try {
    const response = await api.get(`/orders?page=${page}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Lấy chi tiết đơn hàng theo ID
export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.put(`/orders/${orderId}`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Xóa đơn hàng
export const deleteOrder = async (orderId) => {
  try {
    const response = await api.delete(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
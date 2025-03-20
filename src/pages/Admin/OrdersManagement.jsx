import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllOrders, updateOrderStatus, deleteOrder } from '../../services/order';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/ui/ConfirmModal';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, orderId: null });
  const [statusModal, setStatusModal] = useState({ isOpen: false, orderId: null, currentStatus: '' });
  const { showToast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getAllOrders(currentPage);
      setOrders(response.orders);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Không thể tải danh sách đơn hàng');
      showToast('Không thể tải danh sách đơn hàng', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const openDeleteModal = (orderId) => {
    setDeleteModal({ isOpen: true, orderId });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, orderId: null });
  };

  const openStatusModal = (orderId, currentStatus) => {
    setStatusModal({ isOpen: true, orderId, currentStatus });
  };

  const closeStatusModal = () => {
    setStatusModal({ isOpen: false, orderId: null, currentStatus: '' });
  };

  const handleDeleteOrder = async () => {
    if (!deleteModal.orderId) return;

    try {
      await deleteOrder(deleteModal.orderId);
      showToast('Đơn hàng đã được xóa thành công', 'success');
      fetchOrders(); // Refresh the order list
    } catch (error) {
      console.error('Error deleting order:', error);
      showToast('Không thể xóa đơn hàng', 'error');
    } finally {
      closeDeleteModal();
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!statusModal.orderId) return;

    try {
      await updateOrderStatus(statusModal.orderId, newStatus);
      showToast('Đã cập nhật trạng thái đơn hàng', 'success');
      fetchOrders(); // Refresh the order list
    } catch (error) {
      console.error('Error updating order status:', error);
      showToast('Không thể cập nhật trạng thái đơn hàng', 'error');
    } finally {
      closeStatusModal();
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const translateStatus = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'processing':
        return 'Đang xử lý';
      case 'shipped':
        return 'Đang giao hàng';
      case 'delivered':
        return 'Đã giao hàng';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Lỗi!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Quản lý đơn hàng</h2>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã đơn hàng
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đặt
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phương thức thanh toán
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order._id.substring(0, 8)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.user?.email || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.totalAmount?.toLocaleString('vi-VN')}₫</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.paymentMethod === 'VNPay' ? 'VNPAY' :
                        order.paymentMethod === 'cod' ? 'Tiền mặt khi nhận hàng' :
                          order.paymentMethod}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}
                    >
                      {translateStatus(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => openStatusModal(order._id, order.status)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Cập nhật
                      </button>
                      <Link
                        to={`/admin/order/${order._id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Chi tiết
                      </Link>
                      <button
                        onClick={() => openDeleteModal(order._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              {[...Array(totalPages).keys()].map((page) => (
                <button
                  key={page + 1}
                  onClick={() => handlePageChange(page + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === page + 1 ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  {page + 1}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Xóa đơn hàng"
        message="Bạn có chắc chắn muốn xóa đơn hàng này không? Hành động này không thể hoàn tác."
        onConfirm={handleDeleteOrder}
        onCancel={closeDeleteModal}
        confirmText="Xóa"
        cancelText="Hủy"
      />

      {/* Status Update Modal */}
      {statusModal.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Cập nhật trạng thái đơn hàng
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-4">
                        Chọn trạng thái mới cho đơn hàng
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleUpdateStatus('pending')}
                          className={`px-4 py-2 rounded-md text-sm font-medium ${statusModal.currentStatus === 'pending' ? 'bg-yellow-200 text-yellow-800' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'}`}
                        >
                          Chờ xác nhận
                        </button>
                        <button
                          onClick={() => handleUpdateStatus('processing')}
                          className={`px-4 py-2 rounded-md text-sm font-medium ${statusModal.currentStatus === 'processing' ? 'bg-blue-200 text-blue-800' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
                        >
                          Đang xử lý
                        </button>
                        <button
                          onClick={() => handleUpdateStatus('shipped')}
                          className={`px-4 py-2 rounded-md text-sm font-medium ${statusModal.currentStatus === 'shipped' ? 'bg-purple-200 text-purple-800' : 'bg-purple-100 text-purple-800 hover:bg-purple-200'}`}
                        >
                          Đang giao hàng
                        </button>
                        <button
                          onClick={() => handleUpdateStatus('delivered')}
                          className={`px-4 py-2 rounded-md text-sm font-medium ${statusModal.currentStatus === 'delivered' ? 'bg-green-200 text-green-800' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                        >
                          Đã giao hàng
                        </button>
                        <button
                          onClick={() => handleUpdateStatus('completed')}
                          className={`px-4 py-2 rounded-md text-sm font-medium ${statusModal.currentStatus === 'completed' ? 'bg-green-200 text-green-800' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                        >
                          Hoàn thành
                        </button>
                        <button
                          onClick={() => handleUpdateStatus('cancelled')}
                          className={`px-4 py-2 rounded-md text-sm font-medium ${statusModal.currentStatus === 'cancelled' ? 'bg-red-200 text-red-800' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                        >
                          Đã hủy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={closeStatusModal}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
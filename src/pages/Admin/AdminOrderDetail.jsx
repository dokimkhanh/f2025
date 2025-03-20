import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import api from '../../utils/axiosConfig';
import { updateOrderStatus } from '../../services/order';

const AdminOrderDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusModal, setStatusModal] = useState(false);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await api.get(`/orders/${orderId}`);
                if (response.data.success) {
                    setOrder(response.data.order);
                } else {
                    showToast('Không thể tải thông tin đơn hàng', 'error');
                }
            } catch (error) {
                console.error('Error fetching order details:', error);
                showToast('Không thể tải thông tin đơn hàng', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId, showToast]);

    // Function to translate status to Vietnamese
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

    // Function to translate payment method to Vietnamese
    const translatePaymentMethod = (method) => {
        switch (method) {
            case 'VNPay':
                return 'VNPAY';
            case 'Momo':
                return 'Ví MoMo';
            case 'Tiền mặt':
                return 'Tiền mặt khi nhận hàng';
            default:
                return method;
        }
    };

    // Function to translate payment status to Vietnamese
    const translatePaymentStatus = (status) => {
        switch (status) {
            case 'pending':
                return 'Chờ thanh toán';
            case 'completed':
                return 'Đã thanh toán';
            case 'cancelled':
                return 'Đã hủy';
            default:
                return status;
        }
    };

    // Function to get status badge color
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

    // Function to get payment status badge color
    const getPaymentStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleUpdateStatus = async (newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            showToast('Đã cập nhật trạng thái đơn hàng', 'success');
            // Refresh order data
            const response = await api.get(`/orders/${orderId}`);
            if (response.data.success) {
                setOrder(response.data.order);
            }
            setStatusModal(false);
        } catch (error) {
            console.error('Error updating order status:', error);
            showToast('Không thể cập nhật trạng thái đơn hàng', 'error');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Lỗi!</strong>
                <span className="block sm:inline"> Không tìm thấy thông tin đơn hàng</span>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-semibold">Chi tiết đơn hàng</h1>
                    <button
                        onClick={() => navigate('/admin/orders')}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                    >
                        Quay lại
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded">
                        <h2 className="font-semibold mb-2">Thông tin đơn hàng</h2>
                        <p><span className="font-medium">Mã đơn hàng:</span> {order._id}</p>
                        <p><span className="font-medium">Ngày đặt:</span> {formatDate(order.createdAt)}</p>
                        <p className="mt-2">
                            <span className="font-medium">Trạng thái:</span>{' '}
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(order.status)}`}>
                                {translateStatus(order.status)}
                            </span>
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded">
                        <h2 className="font-semibold mb-2">Thông tin khách hàng</h2>
                        <p><span className="font-medium">Email:</span> {order.user?.email || 'N/A'}</p>
                        <p><span className="font-medium">ID người dùng:</span> {order.user?._id || 'N/A'}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded">
                        <h2 className="font-semibold mb-2">Thông tin thanh toán</h2>
                        <p>
                            <span className="font-medium">Phương thức:</span>{' '}
                            {translatePaymentMethod(order.paymentMethod)}
                        </p>
                        <p>
                            <span className="font-medium">Tổng tiền:</span>{' '}
                            {order.totalAmount?.toLocaleString('vi-VN')}₫
                        </p>
                        {order.paymentStatus && (
                            <p className="mt-2">
                                <span className="font-medium">Trạng thái thanh toán:</span>{' '}
                                <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusBadgeClass(order.paymentStatus)}`}>
                                    {translatePaymentStatus(order.paymentStatus)}
                                </span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Địa chỉ giao hàng */}
                <div className="bg-gray-50 p-4 rounded mb-6">
                    <h2 className="font-semibold mb-2">Địa chỉ giao hàng</h2>
                    <p>{order.address?.street}</p>
                    <p>{order.address?.city}, {order.address?.state}</p>
                    <p>{order.address?.zip}, {order.address?.country}</p>
                </div>

                {/* Danh sách sản phẩm */}
                <div className="mb-6">
                    <h2 className="font-semibold mb-4">Danh sách sản phẩm</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Sản phẩm
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Đơn giá
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Số lượng
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thành tiền
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {order.products && order.products.length > 0 ? order.products.map((item, index) => {
                                    const product = item.product;
                                    const selectedSize = product.sizes.find(size => size.size === item.size) || product.sizes[0];
                                    const price = selectedSize ? selectedSize.price : 0;

                                    return (
                                        <tr key={index}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {selectedSize && selectedSize.imageUrl && (
                                                        <img
                                                            src={selectedSize.imageUrl}
                                                            alt={product.name}
                                                            className="h-16 w-16 object-cover mr-4"
                                                        />
                                                    )}
                                                    <div>
                                                        <Link to={`/admin/products/edit/${product.slug}`} className="font-medium text-blue-600 hover:underline">
                                                            {product.name}
                                                        </Link>
                                                        <div className="text-sm text-gray-500">ID: {product._id}</div>
                                                        {item.size && <div className="text-sm text-gray-500">Size: {item.size}</div>}
                                                        <div className="text-sm text-gray-500">
                                                            Danh mục: <Link to={`/admin/categories/edit/${product.category.slug}`} className="text-blue-600 hover:underline">
                                                                {product.category.name}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {price.toLocaleString('vi-VN')}₫
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.quantity}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                                {(price * item.quantity).toLocaleString('vi-VN')}₫
                                            </td>
                                        </tr>
                                    );
                                }) : <tr><td colSpan="4" className="px-6 py-4 text-center">Không có sản phẩm nào</td></tr>
                                }

                            </tbody>
                            <tfoot className="bg-gray-50">
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-right font-medium">
                                        Tổng cộng:
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold">
                                        {order.totalAmount?.toLocaleString('vi-VN')}₫
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Cập nhật trạng thái */}
                <div className="mt-6 flex flex-col md:flex-row gap-4">
                    <button
                        onClick={() => setStatusModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Cập nhật trạng thái
                    </button>
                </div>

                {/* Modal cập nhật trạng thái */}
                {statusModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-lg font-semibold mb-4">Cập nhật trạng thái đơn hàng</h3>
                            <div className="space-y-3 mb-6">
                                <button
                                    onClick={() => handleUpdateStatus('pending')}
                                    className={`w-full py-2 px-4 rounded ${order.status === 'pending' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'}`}
                                >
                                    Chờ xác nhận
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus('processing')}
                                    className={`w-full py-2 px-4 rounded ${order.status === 'processing' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
                                >
                                    Đang xử lý
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus('shipped')}
                                    className={`w-full py-2 px-4 rounded ${order.status === 'shipped' ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-800 hover:bg-purple-200'}`}
                                >
                                    Đang giao hàng
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus('delivered')}
                                    className={`w-full py-2 px-4 rounded ${order.status === 'delivered' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                                >
                                    Đã giao hàng
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus('completed')}
                                    className={`w-full py-2 px-4 rounded ${order.status === 'completed' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                                >
                                    Hoàn thành
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus('cancelled')}
                                    className={`w-full py-2 px-4 rounded ${order.status === 'cancelled' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                                >
                                    Hủy đơn hàng
                                </button>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setStatusModal(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrderDetail;
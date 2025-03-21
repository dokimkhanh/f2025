import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import api from '../../utils/axiosConfig';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await api.get(`/orders/${orderId}`);
        setOrder(response.data.order);
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black mx-auto mb-6"></div>
        <h1 className="text-xl font-medium">Đang tải thông tin đơn hàng...</h1>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy đơn hàng</h1>
        <p className="text-gray-600 mb-8">Đơn hàng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <button 
          onClick={() => navigate('/account?tab=orders')}
          className="px-6 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors"
        >
          Quay lại đơn hàng của tôi
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate('/account?tab=orders')}
            className="flex items-center text-gray-600 hover:text-black"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Quay lại đơn hàng của tôi
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <h1 className="text-2xl font-bold mb-2">Chi tiết đơn hàng</h1>
                <p className="text-gray-600">Mã đơn hàng: {order.orderCode || order._id}</p>
                <p className="text-gray-600">Ngày đặt: {formatDate(order.createdAt)}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                  {translateStatus(order.status)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold mb-4">Thông tin sản phẩm</h2>
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
                  {order.products.map((item, index) => {
                    const product = item.product;
                    const selectedSize = product.sizes.find(size => size.size === item.size) || product.sizes[0];

                    return (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {selectedSize && selectedSize.imageUrl && (
                              <img 
                                src={selectedSize.imageUrl} 
                                alt={product.name} 
                                className="h-16 w-16 object-cover mr-4"
                              />
                            )}
                            <div>
                              <Link to={`/product/${product.slug}`} className="font-medium text-gray-900 hover:underline">
                                {product.name}
                              </Link>
                              {item.size && <div className="text-sm text-gray-500">Size: {item.size}</div>}
                              {item.color && <div className="text-sm text-gray-500">Màu: {item.color}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {selectedSize ? selectedSize.price.toLocaleString('vi-VN') : 'N/A'}₫
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {(selectedSize ? selectedSize.price * item.quantity : 0).toLocaleString('vi-VN')}₫
                        </td>
                      </tr>
                    );
                  })}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Thông tin giao hàng</h2>
              <div className="bg-gray-50 p-4 rounded">
                <p className="font-medium">{order.user?.fullname}</p>
                <p>{order.address?.street}</p>
                <p>{order.address?.city}, {order.address?.state}</p>
                <p>{order.address?.zip}, {order.address?.country}</p>
                <p className="mt-2">{order.user?.phone}</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-4">Thông tin thanh toán</h2>
              <div className="bg-gray-50 p-4 rounded">
                <p><span className="font-medium">Phương thức thanh toán:</span> {
                  order.paymentMethod === 'VNPay' ? 'VNPAY' : 
                  order.paymentMethod === 'cod' ? 'Tiền mặt khi nhận hàng' : 
                  order.paymentMethod
                }</p>
                
                {order.transactionInfo && (
                  <>
                    <p className="mt-2 font-medium">Chi tiết giao dịch:</p>
                    <p><span className="font-medium">Mã giao dịch:</span> {order.transactionInfo.transactionNo || order.transactionId || 'N/A'}</p>
                    {order.transactionInfo.bankCode && <p><span className="font-medium">Ngân hàng:</span> {order.transactionInfo.bankCode}</p>}
                    {order.transactionInfo.cardType && <p><span className="font-medium">Loại thẻ:</span> {order.transactionInfo.cardType}</p>}
                    {order.transactionInfo.payDate && (
                      <p>
                        <span className="font-medium">Thời gian thanh toán:</span> {
                          order.transactionInfo.payDate.length === 14 
                            ? `${order.transactionInfo.payDate.substring(6, 8)}/${order.transactionInfo.payDate.substring(4, 6)}/${order.transactionInfo.payDate.substring(0, 4)} ${order.transactionInfo.payDate.substring(8, 10)}:${order.transactionInfo.payDate.substring(10, 12)}:${order.transactionInfo.payDate.substring(12, 14)}`
                            : order.transactionInfo.payDate
                        }
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
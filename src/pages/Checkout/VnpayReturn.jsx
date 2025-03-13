import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import api from '../../utils/axiosConfig';

const VnpayReturn = () => {
  const [status, setStatus] = useState('processing');
  const [orderInfo, setOrderInfo] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get all query parameters from the URL
        const queryParams = new URLSearchParams(location.search);
        const params = {};
        
        // Convert query parameters to an object
        for (const [key, value] of queryParams.entries()) {
          params[key] = value;
        }
        
        // Generate a unique key for this transaction
        const transactionKey = `vnpay_transaction_${params.vnp_TxnRef || ''}`;
        
        // Check if we already processed this transaction
        const savedTransaction = localStorage.getItem(transactionKey);
        
        if (savedTransaction) {
          // If we already processed this transaction, use the saved result
          const parsedTransaction = JSON.parse(savedTransaction);
          setStatus(parsedTransaction.status);
          setOrderInfo(parsedTransaction.orderInfo);
          setPaymentDetails(parsedTransaction.paymentDetails);
          return;
        }
        
        // Store payment details for display
        const paymentDetailsData = {
          amount: params.vnp_Amount ? parseInt(params.vnp_Amount) / 100 : 0, // VNPAY amount is in VND x 100
          bankCode: params.vnp_BankCode || 'N/A',
          bankTranNo: params.vnp_BankTranNo || 'N/A',
          cardType: params.vnp_CardType || 'N/A',
          orderInfo: params.vnp_OrderInfo || 'N/A',
          payDate: params.vnp_PayDate || 'N/A',
          transactionNo: params.vnp_TransactionNo || 'N/A',
        };
        
        setPaymentDetails(paymentDetailsData);
        
        // Only verify with backend if we haven't processed this transaction before
        const response = await api.post('/payment/vnpay/verify', params);
        
        if (response.data.success) {
          setStatus('success');
          setOrderInfo(response.data.order);
          showToast('Thanh toán thành công!', 'success');
          
          // Save the successful transaction result to localStorage
          localStorage.setItem(transactionKey, JSON.stringify({
            status: 'success',
            orderInfo: response.data.order,
            paymentDetails: paymentDetailsData
          }));
        } else {
          setStatus('failed');
          showToast('Thanh toán thất bại: ' + response.data.message, 'error');
          
          // Save the failed transaction result to localStorage
          localStorage.setItem(transactionKey, JSON.stringify({
            status: 'failed',
            orderInfo: null,
            paymentDetails: paymentDetailsData
          }));
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setStatus('failed');
        showToast('Đã xảy ra lỗi khi xác minh thanh toán', 'error');
        
        // Don't save errors to localStorage to allow retrying
      }
    };

    verifyPayment();
  }, [location.search, showToast]);

  // Format date string from VNPAY (yyyyMMddHHmmss)
  const formatVnpayDate = (dateString) => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    
    try {
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      const hour = dateString.substring(8, 10);
      const minute = dateString.substring(10, 12);
      const second = dateString.substring(12, 14);
      
      return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black mx-auto mb-6"></div>
            <h1 className="text-3xl font-bold mb-4">Đang xử lý thanh toán...</h1>
            <p className="text-gray-600 mb-8">
              Vui lòng đợi trong khi chúng tôi xác nhận thanh toán của bạn.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-4">Thanh toán thành công!</h1>
            <p className="text-gray-600 mb-8">
              Cảm ơn bạn đã mua hàng. Chúng tôi đã gửi email xác nhận đơn hàng đến địa chỉ email của bạn.
            </p>
            
            {orderInfo && (
              <div className="bg-gray-50 p-4 rounded-md text-left mb-8">
                <h3 className="font-bold mb-2">Thông tin đơn hàng:</h3>
                <p><span className="font-medium">Mã đơn hàng:</span> {orderInfo.orderCode || orderInfo._id}</p>
                <p><span className="font-medium">Tổng tiền:</span> {orderInfo.totalAmount?.toLocaleString('vi-VN') || paymentDetails?.amount?.toLocaleString('vi-VN')}₫</p>
                <p><span className="font-medium">Thời gian:</span> {orderInfo.createdAt ? new Date(orderInfo.createdAt).toLocaleString('vi-VN') : formatVnpayDate(paymentDetails?.payDate)}</p>
                
                {paymentDetails && (
                  <>
                    <h3 className="font-bold mt-4 mb-2">Chi tiết thanh toán:</h3>
                    <p><span className="font-medium">Ngân hàng:</span> {paymentDetails.bankCode}</p>
                    <p><span className="font-medium">Loại thẻ:</span> {paymentDetails.cardType}</p>
                    <p><span className="font-medium">Mã giao dịch:</span> {paymentDetails.transactionNo}</p>
                  </>
                )}
              </div>
            )}
            
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => navigate('/account?tab=orders')}
                className="px-6 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors"
              >
                Xem đơn hàng của tôi
              </button>
              <button 
                onClick={() => navigate('/shop')}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="bg-red-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-4">Thanh toán thất bại</h1>
            <p className="text-gray-600 mb-8">
              Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.
            </p>
            
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => navigate('/checkout')}
                className="px-6 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors"
              >
                Thử lại
              </button>
              <button 
                onClick={() => navigate('/cart')}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
              >
                Quay lại giỏ hàng
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VnpayReturn;
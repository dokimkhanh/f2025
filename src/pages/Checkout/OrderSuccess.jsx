import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Đặt hàng thành công!</h1>
        <p className="text-gray-600 mb-8">
          Cảm ơn bạn đã mua hàng. Chúng tôi đã gửi email xác nhận đơn hàng đến địa chỉ email của bạn.
        </p>
        
        <div className="flex flex-col space-y-4">
          <Link 
            to="/account?tab=orders" 
            className="px-6 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors"
          >
            Xem đơn hàng của tôi
          </Link>
          <Link 
            to="/shop" 
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
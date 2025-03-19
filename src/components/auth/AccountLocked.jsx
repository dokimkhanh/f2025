import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/features/authSlice';

const AccountLocked = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center mb-4">Tài khoản bị khóa</h2>
          
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">
              Tài khoản của bạn hiện đã bị khóa. Bạn không thể đăng nhập hoặc thực hiện các thao tác cho đến khi tài khoản được mở khóa.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Lý do có thể:</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Vi phạm điều khoản sử dụng</li>
              <li>Hoạt động đáng ngờ được phát hiện</li>
              <li>Yêu cầu từ chủ tài khoản</li>
              <li>Lý do bảo mật khác</li>
            </ul>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Cần hỗ trợ?</h3>
            <p className="text-gray-600">
              Vui lòng liên hệ với bộ phận hỗ trợ khách hàng của chúng tôi để biết thêm thông tin và mở khóa tài khoản của bạn.
            </p>
            <div className="mt-3">
              <p className="text-gray-600">
                <span className="font-medium">Email:</span> support@fashionshop.com
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Hotline:</span> 1900 1234
              </p>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Link
              to="/"
              className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Về trang chủ
            </Link>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountLocked;
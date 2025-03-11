import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile, selectUser, selectAuth } from '../../redux/features/authSlice';
import { useToast } from '../../context/ToastContext';

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { loading, error } = useSelector(selectAuth);
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    email: ''
  });
  
  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname || '',
        phone: user.phone || '',
        email: user.email || ''
      });
    }
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updateData = {
      fullname: formData.fullname,
      phone: formData.phone
    };
    
    const resultAction = await dispatch(updateUserProfile(updateData));
    
    if (updateUserProfile.fulfilled.match(resultAction)) {
      showToast('Cập nhật thông tin thành công!', 'success');
      navigate('/account');
    } else if (updateUserProfile.rejected.match(resultAction)) {
      showToast(resultAction.payload?.message || 'Cập nhật thông tin thất bại', 'error');
    }
  };
  
  const handleCancel = () => {
    navigate('/account');
  };
  
  if (!user) return <div className="container mx-auto px-4 py-12">Đang tải...</div>;
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Chỉnh sửa thông tin cá nhân</h1>
          <button 
            onClick={handleCancel}
            className="text-gray-600 hover:text-gray-900"
          >
            Quay lại
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                placeholder="Email của bạn"
              />
              <p className="mt-1 text-xs text-gray-500">Email không thể thay đổi</p>
            </div>
            
            <div>
              <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="Nhập họ và tên của bạn"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="Nhập số điện thoại của bạn"
              />
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-70"
              >
                {loading ? 'Đang xử lý...' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
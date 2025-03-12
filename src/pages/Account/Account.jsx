import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser, selectUser, fetchUserProfile } from '../../redux/features/authSlice';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { useToast } from '../../context/ToastContext';
import { setDefaultAddress, deleteUserAddress } from '../../redux/features/profileSlice';

const Account = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [activeTab, setActiveTab] = useState('profile');
  const { showToast } = useToast();

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    addressId: null
  });

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const handleEditAddress = (addressId) => {
    navigate(`/account/address/edit/${addressId}`);
  };

  const handleSetDefaultAddress = async (addressId) => {
    const resultAction = await dispatch(setDefaultAddress(addressId));

    if (setDefaultAddress.fulfilled.match(resultAction)) {
      showToast('Đã đặt địa chỉ mặc định thành công', 'success');
      dispatch(fetchUserProfile());
    } else {
      showToast('Không thể đặt địa chỉ mặc định', 'error');
    }
  };

  const openDeleteModal = (addressId) => {
    setDeleteModal({
      isOpen: true,
      addressId
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      addressId: null
    });
  };

  const confirmDeleteAddress = async () => {
    if (!deleteModal.addressId) return;

    const resultAction = await dispatch(deleteUserAddress(deleteModal.addressId));

    if (deleteUserAddress.fulfilled.match(resultAction)) {
      showToast('Đã xóa địa chỉ thành công', 'success');
      dispatch(fetchUserProfile());
    } else {
      showToast('Không thể xóa địa chỉ', 'error');
    }

    closeDeleteModal();
  };

  if (!user) return <div className="container mx-auto px-4 py-12">Đang tải...</div>;

  const addresses = user.address || [];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Tài khoản của tôi</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-gray-50 border-b">
                <h2 className="font-semibold">Xin chào, {user.fullname || 'Khách hàng'}</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>

              <div className="p-4">
                <ul className="space-y-2">
                  <li>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md ${activeTab === 'profile' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
                      onClick={() => setActiveTab('profile')}
                    >
                      Thông tin cá nhân
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md ${activeTab === 'addresses' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
                      onClick={() => setActiveTab('addresses')}
                    >
                      Địa chỉ của tôi
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md ${activeTab === 'orders' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
                      onClick={() => setActiveTab('orders')}
                    >
                      Đơn hàng của tôi
                    </button>
                  </li>
                  {user.role === 'admin' && (
                    <li>
                      <button
                        className="w-full text-left px-3 py-2 rounded-md text-blue-600 hover:bg-blue-50"
                        onClick={() => navigate('/admin')}
                      >
                        Trang quản trị
                      </button>
                    </li>
                  )}
                  <li>
                    <button
                      className="w-full text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:w-3/4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>
                    <button
                      className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                      onClick={() => navigate('/account/edit')}>
                      Chỉnh sửa
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-600 text-sm">Họ và tên</p>
                      <p className="font-medium">{user.fullname || 'Chưa cập nhật'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Số điện thoại</p>
                      <p className="font-medium">{user.phone || 'Chưa cập nhật'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Vai trò</p>
                      <p className="font-medium capitalize">{user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Trạng thái</p>
                      <p className="font-medium">
                        {user.status === 'active' ? (
                          <span className="text-green-600">Hoạt động</span>
                        ) : (
                          <span className="text-red-600">Đã khóa</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Ngày tham gia</p>
                      <p className="font-medium">{new Date(user.createdAt).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Địa chỉ của tôi</h2>
                    <button
                      className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                      onClick={() => navigate('/account/address/add')}
                    >
                      Thêm địa chỉ mới
                    </button>
                  </div>

                  {addresses && addresses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((addr, index) => (
                        <div key={addr._id} className="border rounded-lg p-4 relative">
                          {index === 0 && (
                            <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              Mặc định
                            </span>
                          )}
                          <p className="font-medium">{user.fullname}</p>
                          <p className="text-gray-700">{addr.street}</p>
                          <p className="text-gray-700">{addr.city}, {addr.state}</p>
                          <p className="text-gray-700">{addr.zip}, {addr.country}</p>
                          <p className="text-gray-700 mt-1">{user.phone}</p>

                          <div className="mt-4 flex space-x-3">
                            <button
                              className="text-sm text-gray-600 hover:text-gray-900"
                              onClick={() => handleEditAddress(addr._id)}
                            >
                              Chỉnh sửa
                            </button>
                            {index !== 0 && (
                              <>
                                <span className="text-gray-300">|</span>
                                <button
                                  className="text-sm text-gray-600 hover:text-gray-900"
                                  onClick={() => handleSetDefaultAddress(addr._id)}
                                >
                                  Đặt làm mặc định
                                </button>
                              </>
                            )}
                            <span className="text-gray-300">|</span>
                            <button
                              className="text-sm text-red-600 hover:text-red-800"
                              onClick={() => openDeleteModal(addr._id)}
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-100 p-8 text-center rounded">
                      <p className="text-gray-600">Bạn chưa có địa chỉ nào.</p>
                      <button
                        className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                        onClick={() => navigate('/account/address/add')}
                      >
                        Thêm địa chỉ mới
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Confirmation Modal */}
              <ConfirmModal
                isOpen={deleteModal.isOpen}
                title="Xóa địa chỉ"
                message="Bạn có chắc chắn muốn xóa địa chỉ này không? Hành động này không thể hoàn tác."
                onConfirm={confirmDeleteAddress}
                onCancel={closeDeleteModal}
                confirmText="Xóa"
                cancelText="Hủy"
              />
              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Đơn hàng của tôi</h2>
                  <div className="bg-gray-100 p-8 text-center rounded">
                    <p className="text-gray-600">Bạn chưa có đơn hàng nào.</p>
                    <button
                      className="mt-4 bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
                      onClick={() => navigate('/shop')}
                    >
                      Mua sắm ngay
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
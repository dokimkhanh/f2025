import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { ListAllUsers, DeleteUser, UpdateUser } from '../../services/user';
import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, userId: null });
  const [statusModal, setStatusModal] = useState({ isOpen: false, userId: null, currentStatus: null });
  const { showToast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await ListAllUsers();
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Không thể tải danh sách người dùng');
      showToast('Không thể tải danh sách người dùng', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (userId) => {
    setDeleteModal({ isOpen: true, userId });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, userId: null });
  };

  const openStatusModal = (userId, currentStatus) => {
    setStatusModal({ isOpen: true, userId, currentStatus });
  };

  const closeStatusModal = () => {
    setStatusModal({ isOpen: false, userId: null, currentStatus: null });
  };

  const handleToggleUserStatus = async () => {
    if (!statusModal.userId) return;

    const newStatus = statusModal.currentStatus === 'active' ? 'locked' : 'active';
    
    try {
      const response = await UpdateUser(statusModal.userId, { status: newStatus });
      showToast(
        newStatus === 'active' 
          ? 'Tài khoản đã được mở khóa thành công' 
          : 'Tài khoản đã được khóa thành công', 
        'success'
      );
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error updating user status:', error);
      showToast(error.response?.data?.message || 'Không thể cập nhật trạng thái người dùng', 'error');
    } finally {
      closeStatusModal();
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteModal.userId) return;

    try {
      const response = await DeleteUser(deleteModal.userId);
      showToast(response.message || 'Người dùng đã được xóa thành công', 'success');
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error deleting user:', error);
      showToast(error.response?.data?.message || 'Không thể xóa người dùng', 'error');
    } finally {
      closeDeleteModal();
    }
  };

  const getRoleBadgeClass = (role) => {
    return role === 'admin' 
      ? 'bg-red-100 text-red-800' 
      : 'bg-blue-100 text-blue-800';
  };

  const getStatusBadgeClass = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error && users.length === 0) {
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
          <h2 className="text-xl font-semibold">Quản lý người dùng</h2>
          <Link
            to="/admin/users/add"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Thêm người dùng mới
          </Link>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Địa chỉ
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(users) && users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.fullname || 'Chưa cập nhật'}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-sm text-gray-500">{user.phone || 'Chưa cập nhật'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                      {user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(user.status)}`}>
                      {user.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {user.address && user.address.length > 0 
                        ? `${user.address.length} địa chỉ` 
                        : 'Chưa có địa chỉ'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => openStatusModal(user._id, user.status)}
                        className={`flex items-center ${user.status === 'active' ? 'text-amber-600 hover:text-amber-900' : 'text-green-600 hover:text-green-900'}`}
                        title={user.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                      >
                        {user.status === 'active' ? (
                          <>
                            <LockClosedIcon className="h-4 w-4 mr-1" />
                            Khóa
                          </>
                        ) : (
                          <>
                            <LockOpenIcon className="h-4 w-4 mr-1" />
                            Mở khóa
                          </>
                        )}
                      </button>
                      <Link
                        to={`/admin/users/edit/${user._id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Sửa
                      </Link>
                      <button
                        onClick={() => openDeleteModal(user._id)}
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
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Xóa người dùng"
        message="Bạn có chắc chắn muốn xóa người dùng này không? Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan đến người dùng này."
        onConfirm={handleDeleteUser}
        onCancel={closeDeleteModal}
        confirmText="Xóa"
        cancelText="Hủy"
      />

      {/* Status Toggle Confirmation Modal */}
      <ConfirmModal
        isOpen={statusModal.isOpen}
        title={statusModal.currentStatus === 'active' ? "Khóa tài khoản" : "Mở khóa tài khoản"}
        message={statusModal.currentStatus === 'active' 
          ? "Bạn có chắc chắn muốn khóa tài khoản này không? Người dùng sẽ không thể đăng nhập vào hệ thống khi bị khóa."
          : "Bạn có chắc chắn muốn mở khóa tài khoản này không? Người dùng sẽ có thể đăng nhập vào hệ thống sau khi được mở khóa."}
        onConfirm={handleToggleUserStatus}
        onCancel={closeStatusModal}
        confirmText={statusModal.currentStatus === 'active' ? "Khóa" : "Mở khóa"}
        cancelText="Hủy"
      />
    </div>
  );
};

export default UsersManagement;
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { GetUserById, UpdateUser } from '../../services/user';

const EditUser = () => {
    const [formData, setFormData] = useState({
        email: '',
        fullname: '',
        phone: '',
        role: 'customer',
        status: 'active'
    });
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const navigate = useNavigate();
    const { userId } = useParams();
    const { showToast } = useToast();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await GetUserById(userId);
                if (response && response.user) {
                    const { email, fullname, phone, role, status } = response.user;
                    setFormData({
                        email: email || '',
                        fullname: fullname || '',
                        phone: phone || '',
                        role: role || 'customer',
                        status: status || 'active'
                    });
                } else {
                    showToast('Không tìm thấy người dùng', 'error');
                    navigate('/admin/users');
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                showToast('Không thể tải thông tin người dùng', 'error');
                navigate('/admin/users');
            } finally {
                setFetchLoading(false);
            }
        };

        if (userId) {
            fetchUser();
        }
    }, [userId, navigate, showToast]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            showToast('Không tìm thấy ID người dùng', 'error');
            return;
        }

        setLoading(true);
        try {
            const response = await UpdateUser(userId, formData);
            showToast(response.message || 'Cập nhật người dùng thành công', 'success');
            navigate('/admin/users');
        } catch (error) {
            console.error('Error updating user:', error);
            showToast(error.response?.data?.message || 'Không thể cập nhật người dùng', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Chỉnh sửa người dùng</h2>
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Quay lại
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                            placeholder="Email không thể thay đổi"
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập họ và tên"
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập số điện thoại"
                        />
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                            Vai trò <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="customer">Khách hàng</option>
                            <option value="admin">Quản trị viên</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                            Trạng thái <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="active">Hoạt động</option>
                            <option value="locked">Bị khóa</option>
                        </select>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <span className="inline-block mr-2 animate-spin">&#9696;</span>
                                    Đang xử lý...
                                </>
                            ) : (
                                'Cập nhật người dùng'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUser;
import React from 'react';
import { Link, Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  HomeIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  TagIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

const AdminLayout = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  // Check if user is admin
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const menuItems = [
    { name: 'Dashboard', icon: HomeIcon, path: '/admin' },
    { name: 'Sản phẩm', icon: ShoppingBagIcon, path: '/admin/products' },
    { name: 'Đơn hàng', icon: TagIcon, path: '/admin/orders' },
    { name: 'Người dùng', icon: UserGroupIcon, path: '/admin/users' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <Link to="/" className="flex items-center">
            <span className="font-display text-xl font-bold">FASHION<span className="text-primary-600">2025</span></span>
          </Link>
        </div>
        
        <nav className="mt-6">
          <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">
            Quản trị
          </div>
          
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-colors"
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span>{item.name}</span>
            </Link>
          ))}
          
          <div className="px-4 py-2 mt-6 text-xs font-semibold text-gray-400 uppercase">
            Tài khoản
          </div>
          
          <Link
            to="/"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-colors"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
            <span>Quay lại cửa hàng</span>
          </Link>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
          </div>
        </header>
        
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
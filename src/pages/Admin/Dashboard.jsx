import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '../../redux/slices/dashboardSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, recentOrders, topProducts } = useSelector(state => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  // Helper function to format currency
  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M₫`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K₫`;
    }
    return `${amount}₫`;
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-500">Đơn hàng</p>
              <h3 className="text-2xl font-semibold">
                {stats.loading ? 'Loading...' : stats.orderCount}
              </h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-500">Doanh thu</p>
              <h3 className="text-2xl font-semibold">
                {stats.loading ? 'Loading...' : formatCurrency(stats.revenue)}
              </h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-500">Sản phẩm</p>
              <h3 className="text-2xl font-semibold">
                {stats.loading ? 'Loading...' : stats.productCount}
              </h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-500">Người dùng</p>
              <h3 className="text-2xl font-semibold">
                {stats.loading ? 'Loading...' : stats.userCount}
              </h3>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Đơn hàng gần đây</h2>
          <div className="overflow-x-auto">
            {recentOrders.loading ? (
              <p>Loading orders...</p>
            ) : recentOrders.error ? (
              <p className="text-red-500">Error: {recentOrders.error}</p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.data.map((order) => (
                    <tr key={order._id}>
                      <td className="px-4 py-3 whitespace-nowrap">{order._id}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{order.user.fullname}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status === 'completed' ? 'Hoàn thành' : 
                           order.status === 'processing' ? 'Đang xử lý' :
                           order.status === 'cancelled' ? 'Đã hủy' : order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{formatCurrency(order.totalAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Sản phẩm bán chạy</h2>
          {topProducts.loading ? (
            <p>Loading products...</p>
          ) : topProducts.error ? (
            <p className="text-red-500">Error: {topProducts.error}</p>
          ) : topProducts.data && topProducts.data.length > 0 ? (
            <div className="space-y-4">
              {topProducts.data.map((product) => (
                <div key={product._id} className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-md flex-shrink-0">
                    {product.imageUrl && (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-md" />
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium">{product.name}</h3>
                    <div className="flex justify-between mt-1">
                      <span className="text-sm text-gray-500">Đã bán: {product.totalOrders || 0}</span>
                      <span className="text-sm font-medium">{formatCurrency(product.price)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Không có sản phẩm bán chạy</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
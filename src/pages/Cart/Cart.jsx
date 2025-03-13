import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromCart, updateCartItemQuantity } from '../../redux/slices/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const { items, totalQuantity, totalAmount } = useSelector((state) => state.cart);

  const handleRemoveItem = (id, size, color) => {
    dispatch(removeFromCart({ id, size, color }));
  };

  const handleQuantityChange = (id, size, color, quantity) => {
    dispatch(updateCartItemQuantity({ id, size, color, quantity }));
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Giỏ hàng của bạn</h1>
        <div className="bg-gray-50 rounded-lg p-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p className="text-xl text-gray-600 mb-6">Giỏ hàng của bạn đang trống</p>
          <Link to="/" className="inline-block px-6 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="hidden md:grid md:grid-cols-5 bg-gray-50 p-4 font-medium text-gray-600">
              <div className="col-span-2">Sản phẩm</div>
              <div className="text-center">Giá</div>
              <div className="text-center">Số lượng</div>
              <div className="text-center">Tổng</div>
            </div>
            
            {items.map((item) => (
              <div key={`${item.id}-${item.size}-${item.color}`} className="border-t border-gray-200 p-4">
                <div className="md:grid md:grid-cols-5 md:gap-4 md:items-center">
                  {/* Product */}
                  <div className="flex gap-4 col-span-2 mb-4 md:mb-0">
                    <div className="w-20 h-20 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-md" />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <div className="text-sm text-gray-500 mt-1">
                        {item.size && <span className="mr-2">Size: {item.size}</span>}
                        {item.color && <span>Màu: {item.color}</span>}
                      </div>
                      <button 
                        onClick={() => handleRemoveItem(item.id, item.size, item.color)}
                        className="text-red-500 text-sm mt-2 hover:text-red-700"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="text-center mb-4 md:mb-0">
                    {item.price.toLocaleString('vi-VN')}₫
                  </div>
                  
                  {/* Quantity */}
                  <div className="flex justify-center mb-4 md:mb-0">
                    <div className="flex items-center">
                      <button
                        className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        onClick={() => item.quantity > 1 && handleQuantityChange(item.id, item.size, item.color, item.quantity - 1)}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, item.size, item.color, Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-12 h-8 border-t border-b border-gray-300 text-center"
                      />
                      <button
                        className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        onClick={() => handleQuantityChange(item.id, item.size, item.color, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  {/* Total */}
                  <div className="text-center font-medium">
                    {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-between">
            <Link to="/" className="px-6 py-3 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between mb-2">
                <span>Tạm tính ({totalQuantity} sản phẩm)</span>
                <span>{totalAmount.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Tổng cộng</span>
                <span>{totalAmount.toLocaleString('vi-VN')}₫</span>
              </div>
              <p className="text-gray-500 text-sm mt-1">Đã bao gồm VAT (nếu có)</p>
            </div>
            
            <Link to="/checkout" className="w-full mt-6 px-6 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors text-center block">
              Tiến hành thanh toán
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { selectUser, fetchUserProfile } from '../../redux/features/authSlice';
import { useToast } from '../../context/ToastContext';
import api from '../../utils/axiosConfig';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const user = useSelector(selectUser);
  const { items, totalQuantity, totalAmount } = useSelector((state) => state.cart);
  
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);
  
  // Kiểm tra nếu tài khoản bị khóa
  useEffect(() => {
    if (user && user.status === 'locked') {
      navigate('/account-locked');
    }
  }, [user, navigate]);
  
  useEffect(() => {
    if (user && user.address && user.address.length > 0) {
      setSelectedAddress(user.address[0]._id);
    }
  }, [user]);
  
  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);
  
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };
  
  const handleAddressChange = (e) => {
    setSelectedAddress(e.target.value);
  };
  
  const getSelectedAddressDetails = () => {
    if (!user || !user.address || !selectedAddress) return null;
    return user.address.find(addr => addr._id === selectedAddress);
  };
  
  const handleCheckout = async () => {
    if (!selectedAddress) {
      showToast('Vui lòng chọn địa chỉ giao hàng', 'error');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Get the selected address details
      const addressDetails = getSelectedAddressDetails();
      
      const productsData = items.map(item => ({
        product: item.id,
        quantity: item.quantity,
        ...(item.size && { size: item.size }),
        ...(item.color && { color: item.color })
      }));
      
      if (paymentMethod === 'vnpay') {
        const response = await api.post('/payment/vnpay/', {
          amount: totalAmount,
          products: productsData,
          address: {
            street: addressDetails.street,
            city: addressDetails.city,
            state: addressDetails.state,
            zip: addressDetails.zip,
            country: addressDetails.country
          }
        });
        
        if (response.data && response.data.paymentUrl) {
          window.location.href = response.data.paymentUrl;
          return;
        }
      } else if (paymentMethod === 'momo') {
        showToast('Phương thức thanh toán MOMO đang được phát triển', 'info');
      } else {
        showToast('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.', 'success');
        navigate('/order-success');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      showToast('Có lỗi xảy ra khi xử lý thanh toán', 'error');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const selectedAddressDetails = getSelectedAddressDetails();
  
  if (!user) return <div className="container mx-auto px-4 py-12">Đang tải...</div>;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="lg:w-2/3">
          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Địa chỉ giao hàng</h2>
              <Link to="/account/address/add" className="text-blue-600 hover:text-blue-800">
                + Thêm địa chỉ mới
              </Link>
            </div>
            
            {user.address && user.address.length > 0 ? (
              <div className="space-y-4">
                {user.address.map((addr) => (
                  <div key={addr._id} className="border rounded-lg p-4 relative">
                    <input
                      type="radio"
                      id={`address-${addr._id}`}
                      name="shipping-address"
                      value={addr._id}
                      checked={selectedAddress === addr._id}
                      onChange={handleAddressChange}
                      className="absolute top-4 right-4"
                    />
                    <label htmlFor={`address-${addr._id}`} className="block cursor-pointer">
                      <p className="font-medium">{user.fullname}</p>
                      <p className="text-gray-700">{addr.street}</p>
                      <p className="text-gray-700">{addr.city}, {addr.state}</p>
                      <p className="text-gray-700">{addr.zip}, {addr.country}</p>
                      <p className="text-gray-700 mt-1">{user.phone}</p>
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-100 p-6 text-center rounded">
                <p className="text-gray-600 mb-4">Bạn chưa có địa chỉ nào.</p>
                <Link 
                  to="/account/address/add" 
                  className="inline-block px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  Thêm địa chỉ mới
                </Link>
              </div>
            )}
          </div>
          
          {/* Payment Methods */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Phương thức thanh toán</h2>
            
            <div className="space-y-4">
              <div 
                className={`border rounded-lg p-4 cursor-pointer ${paymentMethod === 'cash' ? 'border-black' : ''}`}
                onClick={() => handlePaymentMethodChange('cash')}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="payment-cash"
                    name="payment-method"
                    checked={paymentMethod === 'cash'}
                    onChange={() => handlePaymentMethodChange('cash')}
                    className="mr-3"
                  />
                  <label htmlFor="payment-cash" className="flex items-center cursor-pointer">
                    <span className="font-medium">Thanh toán khi nhận hàng (COD)</span>
                  </label>
                </div>
                {paymentMethod === 'cash' && (
                  <p className="text-gray-600 text-sm mt-2 ml-6">
                    Bạn sẽ thanh toán bằng tiền mặt khi nhận hàng.
                  </p>
                )}
              </div>
              
              <div 
                className={`border rounded-lg p-4 cursor-pointer ${paymentMethod === 'vnpay' ? 'border-black' : ''}`}
                onClick={() => handlePaymentMethodChange('vnpay')}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="payment-vnpay"
                    name="payment-method"
                    checked={paymentMethod === 'vnpay'}
                    onChange={() => handlePaymentMethodChange('vnpay')}
                    className="mr-3"
                  />
                  <label htmlFor="payment-vnpay" className="flex items-center cursor-pointer">
                    <span className="font-medium mr-2">VNPAY</span>
                    <img src="/images/vnpay-logo.png" alt="VNPAY" className="h-6" />
                  </label>
                </div>
                {paymentMethod === 'vnpay' && (
                  <p className="text-gray-600 text-sm mt-2 ml-6">
                    Thanh toán trực tuyến qua VNPAY (ATM/Visa/Master/JCB/QR Code)
                  </p>
                )}
              </div>
              
              <div 
                className={`border rounded-lg p-4 cursor-pointer ${paymentMethod === 'momo' ? 'border-black' : ''}`}
                onClick={() => handlePaymentMethodChange('momo')}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="payment-momo"
                    name="payment-method"
                    checked={paymentMethod === 'momo'}
                    onChange={() => handlePaymentMethodChange('momo')}
                    className="mr-3"
                  />
                  <label htmlFor="payment-momo" className="flex items-center cursor-pointer">
                    <span className="font-medium mr-2">MoMo</span>
                    <img src="/images/momo-logo.png" alt="MoMo" className="h-6" />
                  </label>
                </div>
                {paymentMethod === 'momo' && (
                  <p className="text-gray-600 text-sm mt-2 ml-6">
                    Thanh toán qua ví điện tử MoMo
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Order Review */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Xem lại đơn hàng</h2>
            
            <div className="divide-y">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="py-4 flex">
                  <div className="w-16 h-16 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-md" />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{item.name}</h3>
                      <span className="font-medium">{(item.price * item.quantity).toLocaleString('vi-VN')}₫</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {item.size && <span className="mr-2">Size: {item.size}</span>}
                      {item.color && <span className="mr-2">Màu: {item.color}</span>}
                      <span>SL: {item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between mb-2">
                <span>Tạm tính ({totalQuantity} sản phẩm)</span>
                <span>{totalAmount.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Phí vận chuyển</span>
                <span className="text-green-600">Miễn phí</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Tổng cộng</span>
                <span>{totalAmount.toLocaleString('vi-VN')}₫</span>
              </div>
              <p className="text-gray-500 text-sm mt-1">Đã bao gồm VAT (nếu có)</p>
            </div>
            
            {selectedAddressDetails && (
              <div className="mt-6 border-t border-gray-200 pt-4">
                <h3 className="font-medium mb-2">Giao đến:</h3>
                <p className="text-gray-700">{user.fullname}</p>
                <p className="text-gray-700">{selectedAddressDetails.street}</p>
                <p className="text-gray-700">{selectedAddressDetails.city}, {selectedAddressDetails.state}</p>
                <p className="text-gray-700">{selectedAddressDetails.zip}, {selectedAddressDetails.country}</p>
                <p className="text-gray-700">{user.phone}</p>
              </div>
            )}
            
            <button 
              onClick={handleCheckout}
              disabled={isProcessing || !selectedAddress}
              className={`w-full mt-6 px-6 py-3 bg-black text-white rounded-md font-medium transition-colors ${
                isProcessing || !selectedAddress ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
              }`}
            >
              {isProcessing ? 'Đang xử lý...' : 'Thanh toán'}
            </button>
            
            <div className="mt-4 text-center">
              <Link to="/cart" className="text-gray-600 hover:text-gray-900">
                Quay lại giỏ hàng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
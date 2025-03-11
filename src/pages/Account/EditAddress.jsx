import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateUserAddress, selectProfileUser } from '../../redux/features/profileSlice';
import { selectUser } from '../../redux/features/authSlice';
import AddressForm from '../../components/account/AddressForm';
import { useToast } from '../../context/ToastContext';

const EditAddress = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addressId } = useParams();
  const user = useSelector(selectUser);
  const profileUser = useSelector(selectProfileUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    // Find the address in the user's addresses
    const currentUser = profileUser || user;
    if (currentUser && currentUser.address) {
      const foundAddress = currentUser.address.find(addr => addr._id === addressId);
      if (foundAddress) {
        setAddress(foundAddress);
      } else {
        setError('Không tìm thấy địa chỉ');
      }
    }
  }, [addressId, user, profileUser]);

  const handleSubmit = async (addressData) => {
    setLoading(true);
    setError(null);
    
    try {
      const resultAction = await dispatch(updateUserAddress({
        addressId,
        addressData
      }));
      
      if (updateUserAddress.fulfilled.match(resultAction)) {
        showToast('Cập nhật địa chỉ thành công!', 'success');
        navigate('/account');
      } else {
        setError(resultAction.payload?.message || 'Cập nhật địa chỉ thất bại');
        showToast('Cập nhật địa chỉ thất bại', 'error');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi cập nhật địa chỉ');
      showToast('Đã xảy ra lỗi khi cập nhật địa chỉ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/account');
  };

  if (!address && !error) {
    return <div className="container mx-auto px-4 py-12">Đang tải...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Chỉnh sửa địa chỉ</h1>
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
          <div className="p-6">
            {address ? (
              <AddressForm 
                initialData={address}
                onSubmit={handleSubmit} 
                onCancel={handleCancel} 
                isSubmitting={loading} 
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-red-600">Không tìm thấy địa chỉ hoặc đã xảy ra lỗi.</p>
                <button
                  className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                  onClick={handleCancel}
                >
                  Quay lại
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAddress;
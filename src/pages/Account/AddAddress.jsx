import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addUserAddress } from '../../redux/features/profileSlice';
import AddressForm from '../../components/account/AddressForm';
import { useToast } from '../../context/ToastContext';

const AddAddress = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const handleSubmit = async (addressData) => {
    setLoading(true);
    setError(null);
    
    try {
      const resultAction = await dispatch(addUserAddress(addressData));
      
      if (addUserAddress.fulfilled.match(resultAction)) {
        showToast('Thêm địa chỉ thành công!', 'success');
        navigate('/account');
      } else {
        setError(resultAction.payload?.message || 'Thêm địa chỉ thất bại');
        showToast('Thêm địa chỉ thất bại', 'error');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi thêm địa chỉ');
      showToast('Đã xảy ra lỗi khi thêm địa chỉ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/account');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Thêm địa chỉ mới</h1>
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
            <AddressForm 
              onSubmit={handleSubmit} 
              onCancel={handleCancel} 
              isSubmitting={loading} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAddress;
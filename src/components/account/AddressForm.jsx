import React, { useState, useEffect } from 'react';

const AddressForm = ({ initialData = {}, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'Việt Nam'
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        street: initialData.street || '',
        city: initialData.city || '',
        state: initialData.state || '',
        zip: initialData.zip || '',
        country: initialData.country || 'Việt Nam'
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
          Địa chỉ đường
        </label>
        <input
          type="text"
          id="street"
          name="street"
          value={formData.street}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
          placeholder="Số nhà, tên đường, phường/xã"
        />
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
          Thành phố
        </label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
          placeholder="Thành phố"
        />
      </div>

      <div>
        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
          Tỉnh/Thành phố
        </label>
        <input
          type="text"
          id="state"
          name="state"
          value={formData.state}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
          placeholder="Tỉnh/Thành phố"
        />
      </div>

      <div>
        <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
          Mã bưu điện
        </label>
        <input
          type="text"
          id="zip"
          name="zip"
          value={formData.zip}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
          placeholder="Mã bưu điện"
        />
      </div>

      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
          Quốc gia
        </label>
        <input
          type="text"
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
          placeholder="Quốc gia"
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-70"
        >
          {isSubmitting ? 'Đang xử lý...' : 'Lưu địa chỉ'}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
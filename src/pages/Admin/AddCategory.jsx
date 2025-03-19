import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { CreateCategory } from '../../services/category';
import api from '../../utils/axiosConfig';
import { uploadImage, createImagePreview } from '../../utils/imageHelper';

const AddCategory = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      createImagePreview(file, (preview) => {
        setImagePreview(preview);
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showToast('Tên danh mục không được để trống', 'error');
      return;
    }

    setLoading(true);
    try {
      // Upload image if selected
      let categoryData = { ...formData };
      
      if (imageFile) {
        try {
          const imageUrl = await uploadImage(imageFile);
          categoryData.image = imageUrl;
        } catch (error) {
          console.error('Error uploading image:', error);
          showToast('Không thể tải lên hình ảnh', 'error');
          setLoading(false);
          return;
        }
      }

      const response = await CreateCategory(categoryData);
      showToast(response.message || 'Tạo danh mục thành công', 'success');
      navigate('/admin/categories');
    } catch (error) {
      console.error('Error creating category:', error);
      showToast(error.response?.data?.message || 'Không thể tạo danh mục', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Thêm danh mục mới</h2>
          <button
            onClick={() => navigate('/admin/categories')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Quay lại
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Tên danh mục <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tên danh mục"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mô tả cho danh mục"
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Hình ảnh
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {imagePreview && (
              <div className="mt-2">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-40 h-40 object-cover border rounded-md" 
                />
              </div>
            )}
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
                'Tạo danh mục'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
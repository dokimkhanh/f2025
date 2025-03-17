import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/axiosConfig';
import { useToast } from '../../context/ToastContext';
import { ListAllCategories } from '../../services/category';

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    stock: 0,
    isActive: true,
    sizes: [
      { size: 'S', price: 0, imageUrl: '', imageFile: null },
      { size: 'M', price: 0, imageUrl: '', imageFile: null },
      { size: 'L', price: 0, imageUrl: '', imageFile: null },
      { size: 'XL', price: 0, imageUrl: '', imageFile: null }
    ]
  });

  // Fetch product and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchLoading(true);
        // Fetch categories
        const categoriesData = await ListAllCategories();
        setCategories(categoriesData || []);
        
        // Fetch product
        const response = await api.get(`/products/${productId}`);
        const product = response.data.product;
        
        // Map product data to form state
        setFormData({
          name: product.name,
          description: product.description,
          category: product.category._id,
          stock: product.stock,
          isActive: product.isActive,
          sizes: product.sizes.map(size => ({
            size: size.size,
            price: size.price,
            imageUrl: size.imageUrl,
            imageFile: null
          }))
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        showToast('Không thể tải thông tin sản phẩm', 'error');
        navigate('/admin/products');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchData();
  }, [productId, navigate, showToast]);

  // Handle input changes for basic fields
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle input changes for size fields
  const handleSizeChange = (index, field, value) => {
    const updatedSizes = [...formData.sizes];
    updatedSizes[index] = { ...updatedSizes[index], [field]: value };
    setFormData({ ...formData, sizes: updatedSizes });
  };

  // Handle image selection
  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedSizes = [...formData.sizes];
      updatedSizes[index] = { 
        ...updatedSizes[index], 
        imageFile: file,
        imagePreview: reader.result 
      };
      setFormData({ ...formData, sizes: updatedSizes });
    };
    reader.readAsDataURL(file);
  };

  // Upload image to server
  const uploadImage = async (file) => {
    try {
      // Convert file to base64
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const base64String = reader.result.split(',')[1]; // Remove data:image/jpeg;base64,
          
          // Upload to server
          api.post('/helpers/upload-image', { image: base64String })
            .then(response => {
              resolve(response.data.imageUrl);
            })
            .catch(error => {
              console.error('Error uploading image:', error);
              reject(error);
            });
        };
        reader.onerror = error => reject(error);
      });
    } catch (error) {
      console.error('Error processing image:', error);
      throw error;
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (!formData.name || !formData.description || !formData.category) {
        showToast('Vui lòng điền đầy đủ thông tin sản phẩm', 'error');
        setLoading(false);
        return;
      }

      // Upload images and get URLs
      const sizesWithImages = await Promise.all(
        formData.sizes.map(async (sizeData) => {
          if (sizeData.imageFile) {
            const imageUrl = await uploadImage(sizeData.imageFile);
            return {
              size: sizeData.size,
              price: Number(sizeData.price),
              imageUrl
            };
          }
          return {
            size: sizeData.size,
            price: Number(sizeData.price),
            imageUrl: sizeData.imageUrl
          };
        })
      );

      // Prepare data for API
      const productData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        stock: Number(formData.stock),
        isActive: formData.isActive,
        sizes: sizesWithImages
      };

      // Send to API
      await api.put(`/products/${productId}`, productData);
      showToast('Cập nhật sản phẩm thành công', 'success');
      navigate('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      showToast('Không thể cập nhật sản phẩm', 'error');
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
        <h2 className="text-xl font-semibold mb-6">Chỉnh sửa sản phẩm</h2>

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Thông tin cơ bản</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng trong kho</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Hiển thị sản phẩm (cho phép bán)
                </label>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả sản phẩm</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
              ></textarea>
            </div>
          </div>

          {/* Sizes and Prices */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Kích thước, giá và hình ảnh</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kích thước
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giá (VNĐ)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hình ảnh
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.sizes.map((size, index) => (
                    <tr key={size.size}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{size.size}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          value={size.price}
                          onChange={(e) => handleSizeChange(index, 'price', e.target.value)}
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-20 w-20 mr-4">
                            {size.imagePreview ? (
                              <img
                                src={size.imagePreview}
                                alt={`Size ${size.size} preview`}
                                className="h-20 w-20 object-cover rounded-md"
                              />
                            ) : size.imageUrl ? (
                              <img
                                src={size.imageUrl}
                                alt={`Size ${size.size}`}
                                className="h-20 w-20 object-cover rounded-md"
                              />
                            ) : (
                              <div className="h-20 w-20 bg-gray-200 rounded-md flex items-center justify-center">
                                <span className="text-xs text-gray-500">No image</span>
                              </div>
                            )}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(index, e)}
                            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mr-3">
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
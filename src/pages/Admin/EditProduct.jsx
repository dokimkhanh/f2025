import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/axiosConfig';
import { useToast } from '../../context/ToastContext';
import { ListAllCategories } from '../../services/category';
import { GetProductBySlug } from '../../services/product';

const EditProduct = () => {
  const navigate = useNavigate();
  const { productSlug } = useParams();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [productId, setProductId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    stock: 100,
    isActive: true,
    sizes: [
      { size: 'S', price: 0, imageUrl: '', imageFile: null }
    ]
  });

  const [availableSizes, setAvailableSizes] = useState(['M', 'L', 'XL', 'XXL', '2XL', '3XL']);

  useEffect(() => {
    const isMounted = true;
    
    const fetchData = async () => {
      try {
        const categoriesData = await ListAllCategories();
        if (isMounted) {
          setCategories(categoriesData || [])
        }

        if (productSlug) {
          const productData = await GetProductBySlug(productSlug);
          if (productData && isMounted) {
            setProductId(productData._id);

            // Set form data
            setFormData({
              name: productData.name,
              description: productData.description,
              category: productData.category._id,
              stock: productData.stock,
              isActive: productData.isActive,
              sizes: productData.sizes.map(size => ({
                size: size.size,
                price: size.price,
                imageUrl: size.imageUrl,
                imageFile: null,
                imagePreview: size.imageUrl
              }))
            });

            const usedSizes = productData.sizes.map(size => size.size);
            setAvailableSizes(prev => prev.filter(size => !usedSizes.includes(size)));
          } else if (isMounted) {
            showToast('Không tìm thấy sản phẩm', 'error');
            navigate('/admin/products');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (isMounted) {
          showToast('Không thể tải dữ liệu', 'error');
          navigate('/admin/products');
        }
      }
    };

    fetchData();
    
    // Cleanup function để tránh memory leaks và cập nhật state sau khi component unmount
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productSlug]); // Chỉ chạy lại khi productSlug thay đổi

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

  // Add a new size
  const handleAddSize = () => {
    if (availableSizes.length === 0) {
      showToast('Không còn kích thước nào để thêm', 'warning');
      return;
    }

    const newSize = availableSizes[0];
    setFormData({
      ...formData,
      sizes: [...formData.sizes, { size: newSize, price: 0, imageUrl: '', imageFile: null }]
    });

    setAvailableSizes(prevSizes => prevSizes.filter(size => size !== newSize));
    showToast(`Đã thêm kích thước ${newSize}`, 'success');
  };

  // Remove a size
  const handleRemoveSize = (index) => {
    const sizeToRemove = formData.sizes[index].size;
    const updatedSizes = formData.sizes.filter((_, i) => i !== index);

    if (updatedSizes.length === 0) {
      showToast('Phải có ít nhất một kích thước', 'warning');
      return;
    }

    setFormData({ ...formData, sizes: updatedSizes });

    // Add the removed size back to available sizes if it's not a custom size
    if (sizeToRemove !== 'Custom') {
      // Use functional update to ensure we're working with the latest state
      setAvailableSizes(prevSizes => [...prevSizes, sizeToRemove].sort());
    }
  };

  // Handle custom size input
  const handleCustomSizeChange = (index, value) => {
    const updatedSizes = [...formData.sizes];
    updatedSizes[index] = { ...updatedSizes[index], size: value };
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

      // Filter out sizes with incomplete information
      const validSizes = formData.sizes.filter(size =>
        size.price > 0 && (size.imageFile || size.imageUrl)
      );

      if (validSizes.length === 0) {
        showToast('Vui lòng thêm ít nhất một kích thước với giá và hình ảnh', 'error');
        setLoading(false);
        return;
      }

      // Upload images and get URLs
      const sizesWithImages = await Promise.all(
        validSizes.map(async (sizeData) => {
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

      // Send to API - use PUT for updating
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">Sửa sản phẩm</h2>

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
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Kích thước, giá và hình ảnh</h3>
              <button
                type="button"
                onClick={handleAddSize}
                disabled={availableSizes.length === 0}
                className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 ease-in-out gap-2"
              >
                Thêm kích thước ({availableSizes.length} còn lại)
              </button>
            </div>

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
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.sizes.map((size, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900 bg-primary-50 px-2 py-1 rounded-md">{size.size}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          value={size.price}
                          onChange={(e) => handleSizeChange(index, 'price', e.target.value)}
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
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
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          type="button"
                          onClick={() => handleRemoveSize(index)}
                          className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 hover:text-red-900 focus:outline-none"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 text-sm text-gray-500">
                <p>* Chỉ những kích thước có đầy đủ giá và hình ảnh mới được lưu</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mr-3"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3 flex items-center"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              Cập nhật sản phẩm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default EditProduct;
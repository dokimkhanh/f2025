import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axiosConfig';
import { useToast } from '../../context/ToastContext';
import { ListAllCategories } from '../../services/category';
import { uploadImage, createImagePreview } from '../../utils/imageHelper';

const AddProduct = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

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

    // Available size options
    const [availableSizes, setAvailableSizes] = useState(['M', 'L', 'XL', 'XXL', '2XL', '3XL']);

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await ListAllCategories();
                setCategories(data || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
                showToast('Không thể tải danh mục sản phẩm', 'error');
            }
        };

        fetchCategories();
    }, [showToast]);

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
        createImagePreview(file, (preview) => {
            const updatedSizes = [...formData.sizes];
            updatedSizes[index] = {
                ...updatedSizes[index],
                imageFile: file,
                imagePreview: preview
            };
            setFormData({ ...formData, sizes: updatedSizes });
        });
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

            // Send to API
            const response = await api.post('/products', productData);
            showToast(response.data.message || 'Sản phẩm đã được tạo thành công', 'success');
            navigate('/admin/products');
        } catch (error) {
            console.error('Error creating product:', error);
            showToast(error.response?.data?.message || 'Không thể tạo sản phẩm', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Thêm sản phẩm mới</h2>
                    <button
                        onClick={() => navigate('/admin/products')}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Quay lại
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Tên sản phẩm <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập tên sản phẩm"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                Danh mục <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Mô tả sản phẩm <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập mô tả sản phẩm"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                                Số lượng trong kho
                            </label>
                            <input
                                type="number"
                                id="stock"
                                name="stock"
                                value={formData.stock}
                                onChange={handleInputChange}
                                min="0"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                                Hiển thị sản phẩm (Đang hoạt động)
                            </label>
                        </div>
                    </div>

                    {/* Sizes Section */}
                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Kích thước và giá</h3>
                            <button
                                type="button"
                                onClick={handleAddSize}
                                className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                disabled={availableSizes.length === 0}
                            >
                                Thêm kích thước
                            </button>
                        </div>

                        {formData.sizes.map((size, index) => (
                            <div key={index} className="border rounded-md p-4 mb-4">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center">
                                        <span className="font-medium">Kích thước {index + 1}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSize(index)}
                                        className="text-red-600 hover:text-red-800"
                                        disabled={formData.sizes.length === 1}
                                    >
                                        Xóa
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Kích thước
                                        </label>
                                        {size.size === 'Custom' ? (
                                            <input
                                                type="text"
                                                value={size.customSize || ''}
                                                onChange={(e) => handleCustomSizeChange(index, e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Nhập kích thước tùy chỉnh"
                                            />
                                        ) : (
                                            <div className="px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                                                {size.size}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Giá (VNĐ) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={size.price}
                                            onChange={(e) => handleSizeChange(index, 'price', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Nhập giá"
                                            min="0"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Hình ảnh <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(index, e)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {(size.imagePreview || size.imageUrl) && (
                                        <div className="mt-2">
                                            <img
                                                src={size.imagePreview || size.imageUrl}
                                                alt={`Size ${size.size}`}
                                                className="w-40 h-40 object-cover border rounded-md"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
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
                                'Tạo sản phẩm'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
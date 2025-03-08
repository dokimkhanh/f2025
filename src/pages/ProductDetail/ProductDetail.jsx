import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import RelatedProducts from '../../components/product/RelatedProducts'
import { GetProductBySlug } from '../../services/product';

const ProductDetail = () => {
    const { slug } = useParams(); // Thay đổi từ id sang slug
    const dispatch = useDispatch();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [activeTab, setActiveTab] = useState('description');
    const [selectedSizeData, setSelectedSizeData] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const data = await GetProductBySlug(slug);
                setProduct(data);
                // Nếu có sizes, chọn size đầu tiên làm mặc định
                if (data.sizes && data.sizes.length > 0) {
                    setSelectedSize(data.sizes[0].size);
                    setSelectedSizeData(data.sizes[0]);
                }
                setLoading(false);
            } catch (err) {
                setError(err.message || 'Có lỗi xảy ra khi tải thông tin sản phẩm');
                setLoading(false);
            }
        };
        window.scrollTo(0, 0);
        fetchProduct();
    }, [slug]);

    const handleSizeChange = (size) => {
        setSelectedSize(size);
        const sizeData = product.sizes.find(s => s.size === size);
        setSelectedSizeData(sizeData);
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('Vui lòng chọn kích thước');
            return;
        }

        dispatch(addToCart({
            id: product._id,
            name: product.name,
            price: selectedSizeData ? selectedSizeData.price : product.sizes[0].price,
            image: selectedSizeData ? selectedSizeData.imageUrl : product.sizes[0].imageUrl,
            size: selectedSize,
            color: selectedColor,
            quantity: quantity
        }));

        alert('Sản phẩm đã được thêm vào giỏ hàng!');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-500 text-xl">Lỗi: {error}</div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-gray-500 text-xl">Không tìm thấy sản phẩm</div>
            </div>
        );
    }

    // Lấy danh sách hình ảnh từ các size
    const productImages = product.sizes.map(size => size.imageUrl);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Product Images */}
                <div className="md:w-1/2">
                    <div className="mb-4 overflow-hidden rounded-lg">
                        <img
                            src={productImages[selectedImage]}
                            alt={product.name}
                            className="w-full h-[500px] object-cover"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto">
                        {productImages.map((image, index) => (
                            <div
                                key={index}
                                className={`cursor-pointer border-2 rounded-md ${selectedImage === index ? 'border-black' : 'border-transparent'}`}
                                onClick={() => setSelectedImage(index)}
                            >
                                <img
                                    src={image}
                                    alt={`${product.name} - ${index + 1}`}
                                    className="w-20 h-20 object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="md:w-1/2">
                    <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

                    <div className="mb-6">
                        <span className="text-2xl font-bold text-gray-900">
                            {selectedSizeData ? selectedSizeData.price.toLocaleString('vi-VN') : product.sizes[0].price.toLocaleString('vi-VN')}₫
                        </span>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Mô tả</h3>
                        <p className="text-gray-700">{product.description}</p>
                    </div>

                    {product.sizes && product.sizes.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">Kích thước</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size._id}
                                        className={`px-4 py-2 border ${selectedSize === size.size
                                            ? 'border-black bg-black text-white'
                                            : 'border-gray-300 hover:border-gray-500'
                                            } rounded-md transition-colors`}
                                        onClick={() => handleSizeChange(size.size)}
                                    >
                                        {size.size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Số lượng</h3>
                        <div className="flex items-center">
                            <button
                                className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                            >
                                -
                            </button>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-16 h-10 border-t border-b border-gray-300 text-center"
                            />
                            <button
                                className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                onClick={() => setQuantity(quantity + 1)}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={handleAddToCart}
                            className="px-6 py-3 bg-white text-black border border-black hover:bg-gray-100 rounded-md font-medium transition-colors"
                        >
                            Thêm vào giỏ hàng
                        </button>
                        <button
                            className="px-6 py-3 bg-black text-white hover:bg-gray-800 rounded-md font-medium transition-colors"
                        >
                            Mua ngay
                        </button>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mt-6">
                        <div className="flex items-center mb-2">
                            <span className="text-sm font-medium text-gray-900 w-24">Danh mục:</span>
                            <span className="text-sm text-gray-600">{product.category.name}</span>
                        </div>
                        <div className="flex items-center mb-2">
                            <span className="text-sm font-medium text-gray-900 w-24">Tình trạng:</span>
                            <span className="text-sm text-gray-600">{product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product description tabs */}
            <div className="mt-16 border-t border-gray-200 pt-8">
                <div className="flex border-b border-gray-200">
                    <button
                        className={`py-4 px-6 text-sm font-medium ${activeTab === 'description'
                            ? 'border-b-2 border-black text-black'
                            : 'text-gray-500 hover:text-black'
                            }`}
                        onClick={() => setActiveTab('description')}
                    >
                        Mô tả chi tiết
                    </button>
                    <button
                        className={`py-4 px-6 text-sm font-medium ${activeTab === 'shipping'
                            ? 'border-b-2 border-black text-black'
                            : 'text-gray-500 hover:text-black'
                            }`}
                        onClick={() => setActiveTab('shipping')}
                    >
                        Thông tin vận chuyển
                    </button>
                    <button
                        className={`py-4 px-6 text-sm font-medium ${activeTab === 'size'
                            ? 'border-b-2 border-black text-black'
                            : 'text-gray-500 hover:text-black'
                            }`}
                        onClick={() => setActiveTab('size')}
                    >
                        Hướng dẫn chọn size
                    </button>
                </div>

                <div className="py-8">
                    {activeTab === 'description' && (
                        <div className="prose max-w-none">
                            <h3 className="text-lg font-semibold mb-4">Chi tiết sản phẩm</h3>
                            <p className="text-gray-600">{product.description}</p>
                            <ul className="list-disc pl-5 mt-4 text-gray-600">
                                <li>Chất liệu: Cotton cao cấp</li>
                                <li>Xuất xứ: Việt Nam</li>
                                <li>Bảo quản: Giặt máy ở nhiệt độ thường, không dùng chất tẩy</li>
                            </ul>
                        </div>
                    )}

                    {activeTab === 'shipping' && (
                        <div className="prose max-w-none">
                            <h3 className="text-lg font-semibold mb-4">Chính sách vận chuyển</h3>
                            <ul className="list-disc pl-5 text-gray-600">
                                <li>Miễn phí vận chuyển cho đơn hàng từ 500.000đ</li>
                                <li>Thời gian giao hàng: 2-4 ngày làm việc</li>
                                <li>Đổi trả miễn phí trong vòng 30 ngày</li>
                            </ul>
                        </div>
                    )}

                    {activeTab === 'size' && (
                        <div className="prose max-w-none">
                            <h3 className="text-lg font-semibold mb-4">Bảng size chuẩn</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full border-collapse border border-gray-200">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="border border-gray-200 px-4 py-2">Size</th>
                                            <th className="border border-gray-200 px-4 py-2">Vai (cm)</th>
                                            <th className="border border-gray-200 px-4 py-2">Ngực (cm)</th>
                                            <th className="border border-gray-200 px-4 py-2">Dài (cm)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-gray-200 px-4 py-2 text-center">S</td>
                                            <td className="border border-gray-200 px-4 py-2 text-center">40</td>
                                            <td className="border border-gray-200 px-4 py-2 text-center">94</td>
                                            <td className="border border-gray-200 px-4 py-2 text-center">65</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-200 px-4 py-2 text-center">M</td>
                                            <td className="border border-gray-200 px-4 py-2 text-center">42</td>
                                            <td className="border border-gray-200 px-4 py-2 text-center">98</td>
                                            <td className="border border-gray-200 px-4 py-2 text-center">67</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-200 px-4 py-2 text-center">L</td>
                                            <td className="border border-gray-200 px-4 py-2 text-center">44</td>
                                            <td className="border border-gray-200 px-4 py-2 text-center">102</td>
                                            <td className="border border-gray-200 px-4 py-2 text-center">69</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <RelatedProducts />
        </div>
    );
};

export default ProductDetail;
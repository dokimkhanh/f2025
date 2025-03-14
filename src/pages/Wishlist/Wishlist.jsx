import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromWishlist } from '../../redux/slices/wishlistSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import { useToast } from '../../context/ToastContext';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { items } = useSelector((state) => state.wishlist);

  const handleRemoveItem = (id) => {
    dispatch(removeFromWishlist(id));
    showToast('Đã xóa sản phẩm khỏi danh sách yêu thích', 'success');
  };

  const handleAddToCart = (product) => {
    const selectedSize = product.sizes[0]; // Default to first size
    dispatch(addToCart({
      id: product._id,
      name: product.name,
      price: selectedSize.price,
      image: selectedSize.imageUrl,
      size: selectedSize.size,
      quantity: 1
    }));
    showToast('Sản phẩm đã được thêm vào giỏ hàng!', 'success');
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Danh sách yêu thích</h1>
        <div className="bg-gray-50 rounded-lg p-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <p className="text-xl text-gray-600 mb-6">Danh sách yêu thích của bạn đang trống</p>
          <Link to="/" className="inline-block px-6 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors">
            Khám phá sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Danh sách yêu thích</h1>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="hidden md:grid md:grid-cols-4 bg-gray-50 p-4 font-medium text-gray-600">
          <div className="col-span-2">Sản phẩm</div>
          <div className="text-center">Giá</div>
          <div className="text-center">Thao tác</div>
        </div>
        
        {items.map((product) => {
          // Get the lowest price from sizes array
          const getLowestPrice = () => {
            if (!product.sizes || product.sizes.length === 0) return 0;
            return Math.min(...product.sizes.map(size => size.price));
          };
          
          // Get the first image from sizes array
          const productImage = product.sizes && product.sizes.length > 0 
            ? product.sizes[0].imageUrl 
            : 'https://via.placeholder.com/300';
            
          const lowestPrice = getLowestPrice();
          
          return (
            <div key={product._id} className="border-t border-gray-200 p-4">
              <div className="md:grid md:grid-cols-4 md:gap-4 md:items-center">
                {/* Product */}
                <div className="flex gap-4 col-span-2 mb-4 md:mb-0">
                  <div className="w-20 h-20 flex-shrink-0">
                    <img src={productImage} alt={product.name} className="w-full h-full object-cover rounded-md" />
                  </div>
                  <div>
                    <Link to={`/product/${product.slug}`} className="font-medium hover:underline">
                      {product.name}
                    </Link>
                    <div className="text-sm text-gray-500 mt-1">
                      {product.category?.name || "Không phân loại"}
                    </div>
                    <button 
                      onClick={() => handleRemoveItem(product._id)}
                      className="text-red-500 text-sm mt-2 hover:text-red-700"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
                
                {/* Price */}
                <div className="text-center mb-4 md:mb-0">
                  {lowestPrice.toLocaleString('vi-VN')}₫
                </div>
                
                {/* Actions */}
                <div className="flex justify-center">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 flex justify-between">
        <Link to="/" className="px-6 py-3 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
          Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
};

export default Wishlist;
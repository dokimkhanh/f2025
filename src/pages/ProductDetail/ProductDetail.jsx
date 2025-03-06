import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../../redux/slices/productSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import RelatedProducts from '../../components/product/RelatedProducts'

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProduct, loading, error } = useSelector((state) => state.product);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    
    if (!selectedColor && currentProduct.colors?.length > 0) {
      alert('Please select a color');
      return;
    }
    
    dispatch(addToCart({
      id: currentProduct.id,
      name: currentProduct.name,
      price: currentProduct.discountPrice || currentProduct.price,
      image: currentProduct.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity: quantity
    }));
    
    alert('Product added to cart successfully!');
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
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500 text-xl">Product not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Images */}
        <div className="md:w-1/2">
          <div className="mb-4 overflow-hidden rounded-lg">
            <img 
              src={currentProduct.images[selectedImage]} 
              alt={currentProduct.name} 
              className="w-full h-[500px] object-cover"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {currentProduct.images.map((image, index) => (
              <div 
                key={index} 
                className={`cursor-pointer border-2 rounded-md ${selectedImage === index ? 'border-black' : 'border-transparent'}`}
                onClick={() => setSelectedImage(index)}
              >
                <img 
                  src={image} 
                  alt={`${currentProduct.name} - ${index + 1}`} 
                  className="w-20 h-20 object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{currentProduct.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400">
              {'★'.repeat(Math.floor(currentProduct.rating))}
              {'☆'.repeat(5 - Math.floor(currentProduct.rating))}
            </div>
            <span className="ml-2 text-gray-600">({currentProduct.reviews} reviews)</span>
          </div>
          
          <div className="mb-6">
            {currentProduct.discountPrice ? (
              <div className="flex items-center">
                <span className="text-2xl font-bold text-red-600 mr-2">
                  {currentProduct.discountPrice.toLocaleString('vi-VN')}₫
                </span>
                <span className="text-gray-500 line-through">
                  {currentProduct.price.toLocaleString('vi-VN')}₫
                </span>
                <span className="ml-2 bg-red-600 text-white text-sm px-2 py-1 rounded">
                  {Math.round((1 - currentProduct.discountPrice / currentProduct.price) * 100)}% OFF
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold">
                {currentProduct.price.toLocaleString('vi-VN')}₫
              </span>
            )}
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{currentProduct.description}</p>
          </div>
          
          {currentProduct.sizes && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {currentProduct.sizes.map((size) => (
                  <button
                    key={size}
                    className={`px-4 py-2 border ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-gray-500'
                    } rounded-md transition-colors`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {currentProduct.colors && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Color</h3>
              <div className="flex flex-wrap gap-2">
                {currentProduct.colors.map((color) => (
                  <button
                    key={color}
                    className={`px-4 py-2 border ${
                      selectedColor === color
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-gray-500'
                    } rounded-md transition-colors`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Quantity</h3>
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
              Add to Cart
            </button>
            <button
              className="px-6 py-3 bg-black text-white hover:bg-gray-800 rounded-md font-medium transition-colors"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <RelatedProducts />
    </div>
  );
};

export default ProductDetail;
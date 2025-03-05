// src/components/product/ProductCard.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, ShoppingBagIcon } from '@heroicons/react/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/solid';

const ProductCard = ({ product }) => {
  const [isWishlist, setIsWishlist] = useState(false);
  
  return (
    <div className="group relative">
      {/* Product Image */}
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
        <Link to={`/product/${product.id}`}>
          <img 
            src={product.image} 
            alt={product.name} 
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        
        {/* Quick actions */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex space-x-2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md">
            <button 
              onClick={() => setIsWishlist(!isWishlist)} 
              className="p-2 rounded-full hover:bg-gray-100"
            >
              {isWishlist ? (
                <HeartSolidIcon className="h-5 w-5 text-red-500" />
              ) : (
                <HeartIcon className="h-5 w-5" />
              )}
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <ShoppingBagIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Badge */}
        {product.isNew && (
          <span className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">Mới</span>
        )}
        {product.discount && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">-{product.discount}%</span>
        )}
      </div>
      
      {/* Product Info */}
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-700">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="mt-1 text-sm text-gray-500">{product.category}</p>
        <div className="mt-1 flex items-center">
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through mr-2">
              {product.originalPrice.toLocaleString('vi-VN')}₫
            </span>
          )}
          <span className="text-sm font-medium text-gray-900">
            {product.price.toLocaleString('vi-VN')}₫
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

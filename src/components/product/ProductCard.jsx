// src/components/product/ProductCard.jsx
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
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
            <button className="p-2 rounded-full hover:bg-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Badge */}
        {product.isNew && (
          <span className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
            Mới
          </span>
        )}
        {product.discount && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            -{product.discount}%
          </span>
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
              {product.originalPrice.toLocaleString("vi-VN")}₫
            </span>
          )}
          <span className="text-sm font-medium text-gray-900">
            {product.price.toLocaleString("vi-VN")}₫
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

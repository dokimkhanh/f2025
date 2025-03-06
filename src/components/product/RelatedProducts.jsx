import React from "react";
import { Link } from "react-router-dom";

const RelatedProducts = () => {
  // Mock data for related products
  const relatedProducts = [
    {
      id: "1",
      name: "Áo Polo Nam",
      price: 299000,
      image:
        "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: "2",
      name: "Áo Sơ Mi Nữ",
      price: 350000,
      image:
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: "3",
      name: "Quần Jeans Nam",
      price: 450000,
      image:
        "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: "4",
      name: "Váy Đầm Nữ",
      price: 399000,
      image:
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop",
    },
  ];

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <Link
            to={`/product/${product.id}`}
            key={product.id}
            className="group"
          >
            <div className="overflow-hidden rounded-lg mb-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <h3 className="font-medium text-gray-800 group-hover:text-black">
              {product.name}
            </h3>
            <p className="text-gray-700 mt-1">
              {product.price.toLocaleString("vi-VN")}₫
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;

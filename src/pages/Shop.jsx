import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ProductCard from "../components/product/ProductCard";
import { GetAllProduct } from "../redux/slices/productSlice";
import { GetAllCategories } from "../redux/slices/categorySlice";

const Shop = () => {
  const { products, loading } = useSelector((state) => {
    return state.product;
  });
  const { categories } = useSelector((state) => state.category);
  const dispatch = useDispatch();

  // Filter states
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000000]); // Default price range in VND
  const [sortOption, setSortOption] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(GetAllProduct());
    dispatch(GetAllCategories());
  }, [dispatch]);

  useEffect(() => {
    if (products && products.length > 0) {
      applyFilters();
    } else {
      setFilteredProducts([]);
    }
  }, [products, selectedCategory, priceRange, sortOption, searchQuery]);

  const applyFilters = () => {
    if (!Array.isArray(products) || products.length === 0) {
      return;
    }

    let filtered = [...products];
    console.log("Bắt đầu lọc với", filtered.length, "sản phẩm");

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => 
        product.category && product.category._id === selectedCategory
      );
      console.log("Sau khi lọc danh mục:", filtered.length, "sản phẩm");
    }

    // Apply price range filter - Sửa lại phần này
    filtered = filtered.filter(product => {
      if (product.sizes && product.sizes.length > 0) {
        // Lấy giá thấp nhất từ tất cả các kích thước
        const minPrice = Math.min(...product.sizes.map(size => size.price));
        return minPrice >= priceRange[0] && minPrice <= priceRange[1];
      }
      return false; // Loại bỏ sản phẩm không có giá hợp lệ
    });
    console.log("Sau khi lọc giá:", filtered.length, "sản phẩm");

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) || 
        (product.description && product.description.toLowerCase().includes(query))
      );
      console.log("Sau khi tìm kiếm:", filtered.length, "sản phẩm");
    }

    // Apply sorting
    switch (sortOption) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case "price-low-high":
        filtered.sort((a, b) => {
          const minPriceA = a.sizes && a.sizes.length > 0 ? Math.min(...a.sizes.map(size => size.price)) : 0;
          const minPriceB = b.sizes && b.sizes.length > 0 ? Math.min(...b.sizes.map(size => size.price)) : 0;
          return minPriceA - minPriceB;
        });
        break;
      case "price-high-low":
        filtered.sort((a, b) => {
          const minPriceA = a.sizes && a.sizes.length > 0 ? Math.min(...a.sizes.map(size => size.price)) : 0;
          const minPriceB = b.sizes && b.sizes.length > 0 ? Math.min(...b.sizes.map(size => size.price)) : 0;
          return minPriceB - minPriceA;
        });
        break;
      case "name-a-z":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-z-a":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    setFilteredProducts(filtered);
  };

  const handlePriceChange = (e, index) => {
    const newPriceRange = [...priceRange];
    newPriceRange[index] = Number(e.target.value);
    setPriceRange(newPriceRange);
  };

  const resetFilters = () => {
    setSelectedCategory("");
    setPriceRange([0, 10000000]);
    setSortOption("newest");
    setSearchQuery("");
  };

  // Format price to VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h1 className="text-4xl font-display font-bold mb-4">Cửa hàng</h1>
            <p className="text-gray-600">
              Khám phá bộ sưu tập sản phẩm đa dạng của chúng tôi với nhiều phong cách và thiết kế độc đáo.
            </p>
          </div>
        </div>
      </section>

      {/* Shop Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-4">Tìm kiếm</h3>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tìm kiếm sản phẩm..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-4">Danh mục</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="all-categories"
                        name="category"
                        className="mr-2"
                        checked={selectedCategory === ""}
                        onChange={() => setSelectedCategory("")}
                      />
                      <label htmlFor="all-categories">Tất cả danh mục</label>
                    </div>
                    {categories && categories.map((category) => (
                      <div key={category._id} className="flex items-center">
                        <input
                          type="radio"
                          id={category._id}
                          name="category"
                          className="mr-2"
                          checked={selectedCategory === category._id}
                          onChange={() => setSelectedCategory(category._id)}
                        />
                        <label htmlFor={category._id}>{category.name}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-4">Giá</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Giá thấp nhất</label>
                      <input
                        type="range"
                        min="0"
                        max="10000000"
                        step="100000"
                        value={priceRange[0]}
                        onChange={(e) => handlePriceChange(e, 0)}
                        className="w-full"
                      />
                      <span className="text-sm">{formatPrice(priceRange[0])}</span>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Giá cao nhất</label>
                      <input
                        type="range"
                        min="0"
                        max="10000000"
                        step="100000"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceChange(e, 1)}
                        className="w-full"
                      />
                      <span className="text-sm">{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-4">Sắp xếp</h3>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="price-low-high">Giá: Thấp đến cao</option>
                    <option value="price-high-low">Giá: Cao đến thấp</option>
                    <option value="name-a-z">Tên: A-Z</option>
                    <option value="name-z-a">Tên: Z-A</option>
                  </select>
                </div>

                <button
                  onClick={resetFilters}
                  className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:w-3/4">
              {loading ? (
                // Loading skeleton
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(6).fill(0).map((_, index) => (
                    <div key={index} className="bg-gray-200 rounded-lg p-4 animate-pulse h-80"></div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="mb-6 flex justify-between items-center">
                    <p className="text-gray-600">Hiển thị {filteredProducts.length} sản phẩm</p>
                  </div>

                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                      ))}
                    </div>
                  ) : (
                    <div>
                      <div className="text-center py-12 bg-gray-50 rounded-lg mb-8">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 mx-auto text-gray-400 mb-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Không tìm thấy sản phẩm nào</h3>
                        <p className="text-gray-600 mb-4">Vui lòng thử lại với các bộ lọc khác</p>
                        <button
                          onClick={resetFilters}
                          className="inline-block bg-primary-600 text-white px-6 py-2 rounded-md font-medium hover:bg-primary-700 transition-colors"
                        >
                          Đặt lại bộ lọc
                        </button>
                      </div>
                      
                      {/* Hiển thị sản phẩm gốc nếu không có kết quả lọc */}
                      {products && products.length > 0 && (
                        <div>
                          <h3 className="text-lg font-bold mb-4">Tất cả sản phẩm:</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                              <ProductCard key={product._id} product={product} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold mb-4">
              Đăng ký nhận thông tin
            </h2>
            <p className="text-gray-600 mb-8">
              Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt trước khi mọi người.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Địa chỉ email của bạn"
                className="flex-1 px-4 py-3 rounded-md text-black ring-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                type="submit"
                className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shop;
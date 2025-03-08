import { Link } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";

import { GetAllProduct } from "../redux/slices/productSlice";
import { GetAllCategories } from "../redux/slices/categorySlice";

const Home = () => {
  const productSelector = useSelector((state) => state.product.products);
  const { categories, loading: categoryLoading } = useSelector((state) => state.category);

  const dispatch = useDispatch();
  const [categoryStartIndex, setCategoryStartIndex] = useState(0);
  useEffect(() => {
    getAllProduct();
    getAllCategories();
  }, []);

  const getAllProduct = () => {
    dispatch(GetAllProduct());
  };

  const getAllCategories = () => {
    dispatch(GetAllCategories());
  };

  const nextCategories = () => {
    if (categories && categoryStartIndex + 4 < categories.length) {
      setCategoryStartIndex(categoryStartIndex + 1);
    }
  };

  const prevCategories = () => {
    if (categoryStartIndex > 0) {
      setCategoryStartIndex(categoryStartIndex - 1);
    }
  };

  const categoriesContainerRef = useRef(null);

  // Check if navigation buttons should be enabled
  const hasNextCategories = categories && categoryStartIndex + 4 < categories.length;
  const hasPrevCategories = categoryStartIndex > 0;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] bg-gray-100">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10" />
        <img
          src="https://theme.hstatic.net/200000690725/1001078549/14/slide_1_img.jpg?v=666"
          alt="Fashion 2025"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">
              Xu hướng thời trang 2025
            </h1>
            <p className="text-lg text-white/90 mb-8">
              Khám phá bộ sưu tập mới nhất với thiết kế hiện đại, chất liệu cao
              cấp và phong cách độc đáo.
            </p>
            <div className="flex space-x-4">
              <Link
                to="/shop"
                className="inline-block bg-white text-gray-900 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors w-fit"
              >
                Mua sắm ngay
              </Link>
              <Link
                to="/collections"
                className="inline-block bg-white text-gray-900 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors w-fit"
              >
                Bộ sưu tập
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-display font-bold">
              Danh mục sản phẩm
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={prevCategories}
                disabled={!hasPrevCategories}
                className={`w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 
                  ${hasPrevCategories ? 'hover:bg-gray-100 text-gray-700' : 'text-gray-300 cursor-not-allowed'} transition-all duration-300`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={nextCategories}
                disabled={!hasNextCategories}
                className={`w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 
                  ${hasNextCategories ? 'hover:bg-gray-100 text-gray-700' : 'text-gray-300 cursor-not-allowed'} transition-all duration-300`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <div className="overflow-hidden">
            <div
              ref={categoriesContainerRef}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${categoryStartIndex * (100 / 4)}%)`,
                display: 'grid',
                gridTemplateColumns: `repeat(${categories ? categories.length : 4}, minmax(0, 1fr))`,
                width: `${categories ? (categories.length / 4) * 100 : 100}%`
              }}
            >
              {categoryLoading ? (
                // Loading skeleton
                Array(4).fill(0).map((_, index) => (
                  <div key={index} className="relative overflow-hidden rounded-lg bg-gray-200 animate-pulse">
                    <div className="aspect-w-1 aspect-h-1"></div>
                  </div>
                ))
              ) : (
                categories && categories.map((category) => (
                  <Link
                    key={category._id}
                    to={`/category/${category.slug}`}
                    className="group relative overflow-hidden rounded-lg transition-all duration-500 ease-in-out"
                  >
                    <div className="aspect-w-1 aspect-h-1">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4">
                      <h3 className="text-xl font-medium text-white">
                        {category.name}
                      </h3>
                      <p className="text-sm text-white/80">
                        {category.description}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-display font-bold">
              Sản phẩm nổi bật
            </h2>
            <Link
              to="/shop"
              className="flex items-center text-primary-600 font-medium hover:text-primary-700"
            >
              Xem tất cả
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productSelector.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Collections */}
      {categories && categories.length >= 2 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-display font-bold text-center mb-12">
              Bộ sưu tập mới
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {categories.slice(0, 2).map((category) => (
                <div
                  key={category._id}
                  className="relative overflow-hidden rounded-lg group"
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8">
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
                      {category.name}
                    </h3>
                    <p className="text-white/80 mb-4">{category.description}</p>
                    <Link
                      to={`/category/${category.slug}`}
                      className="inline-block bg-white text-gray-900 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors w-fit"
                    >
                      Khám phá ngay
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-16 bg-primary-600 text-black-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold mb-4">
              Đăng ký nhận thông tin
            </h2>
            <p className="text-black-200/90 mb-8">
              Nhận thông tin về bộ sưu tập mới và ưu đãi đặc biệt trước khi mọi
              người.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Địa chỉ email của bạn"
                className="flex-1 px-4 py-3 rounded-md text-black ring-1 hover:bg-gray-100 focus:outline-none  focus:ring-2 focus:ring-black"
              />
              <button
                type="submit"
                className="bg-white text-primary-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors border border-black"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-50 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Miễn phí vận chuyển</h3>
              <p className="text-gray-600">Cho đơn hàng từ 500.000đ</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-50 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Bảo hành 30 ngày</h3>
              <p className="text-gray-600">Đổi trả dễ dàng</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-50 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Thanh toán an toàn</h3>
              <p className="text-gray-600">Nhiều phương thức</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-50 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Hỗ trợ 24/7</h3>
              <p className="text-gray-600">Luôn sẵn sàng giúp đỡ</p>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">
              Instagram @fashionshop2025
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Theo dõi chúng tôi trên Instagram để cập nhật xu hướng thời trang
              mới nhất và các hoạt động của cửa hàng.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => {
              // Map each item to a specific image URL
              const imageUrl = item === 1 ? "https://i.ibb.co/6cHHGQk0/image.png" :
                item === 2 ? "https://i.ibb.co/WvVCgdrN/image.png" :
                  item === 3 ? "https://i.ibb.co/G3QC8LM7/image.png" :
                    item === 4 ? "https://i.ibb.co/mP8rQ9x/image.png" :
                      item === 5 ? "https://i.ibb.co/Cp49xrCv/image.png" :
                        "https://i.ibb.co/V5gVD8d/image.png";

              return (
                <a
                  key={item}
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden"
                >
                  <div className="aspect-w-1 aspect-h-1">
                    <img
                      src={imageUrl}
                      alt={`Instagram post ${item}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
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
                  </div>
                </a>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
            >
              Theo dõi chúng tôi trên Instagram
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Khách hàng nói gì về chúng tôi
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Tôi rất hài lòng với chất lượng sản phẩm và dịch vụ của Fashion
                Shop 2025. Quần áo đẹp, chất lượng và giao hàng nhanh chóng."
              </p>
              <div className="flex items-center">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Nguyễn Văn A"
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div>
                  <h4 className="font-medium">Nguyễn Văn A</h4>
                  <p className="text-sm text-gray-500">Khách hàng</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Thiết kế thời trang và hiện đại, phù hợp với xu hướng. Tôi đặc
                biệt thich bộ sưu tập mới nhất của shop, rất phù hợp với phong
                cách của tôi."
              </p>
              <div className="flex items-center">
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="Trần Thị B"
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div>
                  <h4 className="font-medium">Trần Thị B</h4>
                  <p className="text-sm text-gray-500">Khách hàng</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Dịch vụ khách hàng tuyệt vời! Tôi đã gặp vấn đề với size áo và
                đội ngũ hỗ trợ đã giải quyết nhanh chóng. Chắc chắn sẽ quay lại
                mua sắm."
              </p>
              <div className="flex items-center">
                <img
                  src="https://randomuser.me/api/portraits/men/67.jpg"
                  alt="Lê Văn C"
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div>
                  <h4 className="font-medium">Lê Văn C</h4>
                  <p className="text-sm text-gray-500">Khách hàng</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-display font-bold">
              Tin tức thời trang
            </h2>
            <Link
              to="/blog"
              className="flex items-center text-primary-600 font-medium hover:text-primary-700"
            >
              Xem tất cả
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <article className="bg-white rounded-lg overflow-hidden shadow-sm">
              <Link to="/blog/1" className="block overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="Xu hướng thời trang 2025"
                  className="w-full h-60 object-cover transition-transform duration-500 hover:scale-110"
                />
              </Link>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span>15 Tháng 3, 2025</span>
                  <span className="mx-2">•</span>
                  <span>Thời trang</span>
                </div>
                <h3 className="text-xl font-bold mb-2">
                  <Link
                    to="/blog/1"
                    className="hover:text-primary-600 transition-colors"
                  >
                    Xu hướng thời trang nổi bật năm 2025
                  </Link>
                </h3>
                <p className="text-gray-600 mb-4">
                  Khám phá những xu hướng thời trang mới nhất sẽ thống trị năm
                  2025, từ màu sắc đến kiểu dáng.
                </p>
                <Link
                  to="/blog/1"
                  className="text-primary-600 font-medium hover:text-primary-700 inline-flex items-center"
                >
                  Đọc tiếp
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </article>

            <article className="bg-white rounded-lg overflow-hidden shadow-sm">
              <Link to="/blog/2" className="block overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="Cách phối đồ mùa hè"
                  className="w-full h-60 object-cover transition-transform duration-500 hover:scale-110"
                />
              </Link>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span>10 Tháng 3, 2025</span>
                  <span className="mx-2">•</span>
                  <span>Phong cách</span>
                </div>
                <h3 className="text-xl font-bold mb-2">
                  <Link
                    to="/blog/2"
                    className="hover:text-primary-600 transition-colors"
                  >
                    5 cách phối đồ cho mùa hè năng động
                  </Link>
                </h3>
                <p className="text-gray-600 mb-4">
                  Những gợi ý phối đồ đơn giản nhưng hiệu quả giúp bạn tự tin và
                  thoải mái trong những ngày hè nóng bức.
                </p>
                <Link
                  to="/blog/2"
                  className="text-primary-600 font-medium hover:text-primary-700 inline-flex items-center"
                >
                  Đọc tiếp
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </article>

            <article className="bg-white rounded-lg overflow-hidden shadow-sm">
              <Link to="/blog/3" className="block overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="Chăm sóc quần áo"
                  className="w-full h-60 object-cover transition-transform duration-500 hover:scale-110"
                />
              </Link>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span>5 Tháng 3, 2025</span>
                  <span className="mx-2">•</span>
                  <span>Mẹo hay</span>
                </div>
                <h3 className="text-xl font-bold mb-2">
                  <Link
                    to="/blog/3"
                    className="hover:text-primary-600 transition-colors"
                  >
                    Bí quyết chăm sóc quần áo bền đẹp
                  </Link>
                </h3>
                <p className="text-gray-600 mb-4">
                  Những mẹo đơn giản giúp bảo quản quần áo luôn như mới, kéo dài
                  tuổi thọ cho trang phục yêu thích của bạn.
                </p>
                <Link
                  to="/blog/3"
                  className="text-primary-600 font-medium hover:text-primary-700 inline-flex items-center"
                >
                  Đọc tiếp
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>
      {/* Brands */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Thương hiệu đối tác
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {/* Using placeholder brand logos that are copyright-free */}
            <div className="grayscale hover:grayscale-0 transition-all duration-300">
              <img
                src="https://placehold.co/200x80/e2e8f0/64748b?text=Brand+One"
                alt="Fashion Partner"
                className="h-12 md:h-16"
              />
            </div>
            <div className="grayscale hover:grayscale-0 transition-all duration-300">
              <img
                src="https://placehold.co/200x80/e2e8f0/64748b?text=Brand+Two"
                alt="Style Co."
                className="h-12 md:h-16"
              />
            </div>
            <div className="grayscale hover:grayscale-0 transition-all duration-300">
              <img
                src="https://placehold.co/200x80/e2e8f0/64748b?text=Brand+Three"
                alt="Trend Mode"
                className="h-12 md:h-16"
              />
            </div>
            <div className="grayscale hover:grayscale-0 transition-all duration-300">
              <img
                src="https://placehold.co/200x80/e2e8f0/64748b?text=Brand+Four"
                alt="Fashion Hub"
                className="h-12 md:h-16"
              />
            </div>
            <div className="grayscale hover:grayscale-0 transition-all duration-300">
              <img
                src="https://placehold.co/200x80/e2e8f0/64748b?text=Brand+Five"
                alt="Elegant Wear"
                className="h-12 md:h-16"
              />
            </div>
            <div className="grayscale hover:grayscale-0 transition-all duration-300">
              <img
                src="https://placehold.co/200x80/e2e8f0/64748b?text=Brand+Six"
                alt="Modern Apparel"
                className="h-12 md:h-16"
              />
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="relative py-20 bg-gray-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://i.ibb.co/20dHSBjH/image.png"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Sẵn sàng nâng cấp phong cách của bạn?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Khám phá bộ sưu tập mới nhất của chúng tôi và tìm kiếm phong cách
              phù hợp với cá tính của bạn.
            </p>
            <Link
              to="/shop"
              className="inline-block bg-white text-gray-900 px-8 py-4 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              Mua sắm ngay
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

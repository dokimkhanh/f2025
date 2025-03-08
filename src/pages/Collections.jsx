import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { GetAllCategories } from "../redux/slices/categorySlice";

const Collections = () => {
  const { categories, loading } = useSelector((state) => state.category);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetAllCategories());
  }, [dispatch]);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h1 className="text-4xl font-display font-bold mb-4">Bộ sưu tập</h1>
            <p className="text-gray-600">
              Khám phá các bộ sưu tập thời trang đa dạng của chúng tôi, từ trang phục hàng ngày đến những thiết kế đặc biệt cho các dịp quan trọng.
            </p>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {loading ? (
            // Loading skeleton
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, index) => (
                <div key={index} className="relative overflow-hidden rounded-lg bg-gray-200 animate-pulse">
                  <div className="aspect-w-1 aspect-h-1"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {categories && categories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {categories.map((category) => (
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
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl text-gray-600">Không tìm thấy bộ sưu tập nào</h3>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold mb-4">
              Không tìm thấy điều bạn đang tìm kiếm?
            </h2>
            <p className="text-gray-600 mb-8">
              Khám phá cửa hàng của chúng tôi để xem tất cả các sản phẩm hoặc liên hệ với đội ngũ hỗ trợ khách hàng để được trợ giúp.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/shop"
                className="inline-block bg-primary-600 text-black px-6 py-3 rounded-md font-medium hover:bg-primary-700 transition-colors"
              >
                Xem tất cả sản phẩm
              </Link>
              <Link
                to="/contact"
                className="inline-block bg-white text-gray-900 px-6 py-3 rounded-md font-medium border border-gray-300 hover:bg-gray-100 transition-colors"
              >
                Liên hệ với chúng tôi
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Collections;
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProductCard from '../components/product/ProductCard';
import { GetCategoryBySlug } from '../services/category';
import { GetProductsByCategory } from '../services/product';

const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true);
        // First, get the category by slug
        const categoryData = await GetCategoryBySlug(slug);
        setCategory(categoryData);

        // Then, get all products in this category
        const productsData = await GetProductsByCategory(categoryData._id);
        setProducts(productsData.products);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching category or products:', err);
        setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu');
        setLoading(false);
      }
    };

    window.scrollTo(0, 0);
    fetchCategoryAndProducts();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-red-500 text-xl">Lỗi: {error}</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-gray-500 text-xl">Không tìm thấy danh mục</div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h1 className="text-4xl font-display font-bold mb-4">{category.name}</h1>
            <p className="text-gray-600">
              {category.description}
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex text-sm">
          <ol className="flex items-center space-x-1">
            <li>
              <Link to="/" className="text-gray-500 hover:text-gray-900">
                Trang chủ
              </Link>
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <Link to="/collections" className="text-gray-500 hover:text-gray-900">
                Bộ sưu tập
              </Link>
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <span className="text-gray-900 font-medium">{category.name}</span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Products Grid */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl text-gray-600">Không có sản phẩm nào trong danh mục này</h3>
              <Link 
                to="/shop" 
                className="mt-4 inline-block bg-primary-600 text-black px-6 py-3 rounded-md font-medium hover:bg-primary-700 transition-colors"
              >
                Xem tất cả sản phẩm
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold mb-4">
              Khám phá thêm các sản phẩm khác
            </h2>
            <p className="text-gray-600 mb-8">
              Chúng tôi có nhiều sản phẩm đa dạng phù hợp với mọi phong cách và nhu cầu của bạn.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/shop"
                className="inline-block bg-primary-600 text-black px-6 py-3 rounded-md font-medium hover:bg-primary-700 transition-colors"
              >
                Xem tất cả sản phẩm
              </Link>
              <Link
                to="/collections"
                className="inline-block bg-white text-gray-900 px-6 py-3 rounded-md font-medium border border-gray-300 hover:bg-gray-100 transition-colors"
              >
                Xem các bộ sưu tập
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
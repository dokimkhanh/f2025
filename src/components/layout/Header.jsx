// src/components/layout/Header.jsx
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  ShoppingBagIcon,
  UserIcon,
  Bars3Icon as MenuIcon,
  MagnifyingGlassIcon as SearchIcon,
  XMarkIcon as XIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { toggleMenu, selectIsMenuOpen } from '../../redux/features/menuSlice';
import { selectIsAuthenticated } from '../../redux/features/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const isMenuOpen = useSelector(selectIsMenuOpen);

  const cartQuantity = useSelector((state) => state.cart.totalQuantity);
  console.log('Cart quantity:', cartQuantity);

  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleToggleMenu = () => {
    dispatch(toggleMenu());
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="font-display text-2xl font-bold">FASHION<span className="text-primary-600">2025</span></Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="font-medium hover:text-primary-600 transition-colors">Trang chủ</Link>
            <Link to="/shop" className="font-medium hover:text-primary-600 transition-colors">Cửa hàng</Link>
            <Link to="/collections" className="font-medium hover:text-primary-600 transition-colors">Bộ sưu tập</Link>
            <Link to="/about" className="font-medium hover:text-primary-600 transition-colors">Giới thiệu</Link>
            <Link to="/contact" className="font-medium hover:text-primary-600 transition-colors">Liên hệ</Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:text-primary-600 transition-colors">
              <SearchIcon className="h-6 w-6" />
            </button>
            <Link to={isAuthenticated ? "/account" : "/login"} className="p-2 hover:text-primary-600 transition-colors">
              {isAuthenticated ? (
                <UserIcon className="h-6 w-6" />
              ) : (
                <UserCircleIcon className="h-6 w-6" />
              )}
            </Link>
            <Link to="/cart" className="p-2 hover:text-primary-600 transition-colors relative">
              <ShoppingBagIcon className="h-6 w-6" />
              {cartQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center z-10">
                  {cartQuantity}
                </span>
              )}
            </Link>
            <button
              className="p-2 md:hidden hover:text-primary-600 transition-colors"
              onClick={handleToggleMenu}
            >
              {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="font-medium hover:text-primary-600 transition-colors">Trang chủ</Link>
              <Link to="/shop" className="font-medium hover:text-primary-600 transition-colors">Cửa hàng</Link>
              <Link to="/collections" className="font-medium hover:text-primary-600 transition-colors">Bộ sưu tập</Link>
              <Link to="/about" className="font-medium hover:text-primary-600 transition-colors">Giới thiệu</Link>
              <Link to="/contact" className="font-medium hover:text-primary-600 transition-colors">Liên hệ</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

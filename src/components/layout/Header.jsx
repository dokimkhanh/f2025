// src/components/layout/Header.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBagIcon, UserIcon, MenuIcon, SearchIcon, XIcon } from '@heroicons/react/outline';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
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
            <Link to="/account" className="p-2 hover:text-primary-600 transition-colors">
              <UserIcon className="h-6 w-6" />
            </Link>
            <Link to="/cart" className="p-2 hover:text-primary-600 transition-colors relative">
              <ShoppingBagIcon className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
            </Link>
            <button 
              className="p-2 md:hidden hover:text-primary-600 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
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

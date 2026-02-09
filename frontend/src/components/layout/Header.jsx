import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Menu, X, ShoppingBag, LogIn } from 'lucide-react';
import { restaurantApi } from '../../services/api';

const Header = ({ cartItemCount = 0 }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: 'Panaghia',
    tagline: 'Autoservire Vatra Dornei',
    phone: '0746 254 162'
  });
  const location = useLocation();

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const info = await restaurantApi.getInfo();
        setRestaurantInfo(info);
      } catch (error) {
        console.error('Error fetching restaurant info:', error);
      }
    };
    fetchInfo();
  }, []);

  const navLinks = [
    { path: '/', label: 'Acasa' },
    { path: '/meniu', label: 'Meniu' },
    { path: '/echipa', label: 'Echipa' },
    { path: '/contact', label: 'Contact' }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm" data-testid="header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" data-testid="logo-link">
            <div className="w-12 h-12 bg-[#D4A847] rounded-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7H14C17.31 7 20 9.69 20 13V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V13C4 9.69 6.69 7 10 7H11V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2ZM6 13V20H18V13C18 10.79 16.21 9 14 9H10C7.79 9 6 10.79 6 13Z"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                {restaurantInfo.name}
              </span>
              <span className="text-xs text-gray-500">{restaurantInfo.tagline}</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" data-testid="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-[#D4A847] ${
                  isActive(link.path) ? 'text-[#D4A847]' : 'text-gray-700'
                }`}
                data-testid={`nav-link-${link.path.replace('/', '') || 'home'}`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/comanda" className="text-gray-700 hover:text-[#D4A847] transition-colors relative" data-testid="cart-link">
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#D4A847] text-white text-xs rounded-full flex items-center justify-center" data-testid="cart-count">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Phone Button & Login */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`tel:${restaurantInfo.phone?.replace(/\s/g, '')}`}
              className="flex items-center gap-2 bg-[#D4A847] text-white px-5 py-2.5 rounded-full hover:bg-[#c49a3d] transition-colors"
              data-testid="phone-btn"
            >
              <Phone className="w-4 h-4" />
              <span className="font-medium">{restaurantInfo.phone}</span>
            </a>
            <button className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:border-[#D4A847] hover:text-[#D4A847] transition-colors" data-testid="login-btn">
              <LogIn className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="mobile-menu-btn"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t" data-testid="mobile-menu">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-2 text-sm font-medium ${
                  isActive(link.path) ? 'text-[#D4A847]' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
                data-testid={`mobile-nav-link-${link.path.replace('/', '') || 'home'}`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/comanda"
              className="block py-2 text-sm font-medium text-gray-700"
              onClick={() => setIsMenuOpen(false)}
              data-testid="mobile-cart-link"
            >
              Coș ({cartItemCount})
            </Link>
            <a
              href={`tel:${restaurantInfo.phone?.replace(/\s/g, '')}`}
              className="flex items-center justify-center gap-2 bg-[#D4A847] text-white px-5 py-3 rounded-full mt-4"
              data-testid="mobile-phone-btn"
            >
              <Phone className="w-4 h-4" />
              <span className="font-medium">{restaurantInfo.phone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

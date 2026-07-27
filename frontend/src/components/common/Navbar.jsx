import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faShoppingBag,
  faHeart,
  faBars,
  faTimes,
  faSearch,
  faCrown,
  faUser
} from '@fortawesome/free-solid-svg-icons'
import { toggleMobileMenu, closeMobileMenu } from '../../redux/slices/uiSlice'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isMobileMenuOpen } = useSelector((state) => state.ui)
  const { totalItems } = useSelector((state) => state.cart)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`)
      setSearchQuery('')
      dispatch(closeMobileMenu())
    }
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Contact', path: '/contact' },
  ]

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-10 pt-4">
      <nav className="max-w-7xl mx-auto bg-white rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.06)] px-4 sm:px-5">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <FontAwesomeIcon icon={faCrown} className="text-gold-600 text-xl" />
            <span className="text-lg font-bold whitespace-nowrap hidden sm:inline">
              <span className="text-black">Inez</span>
              <span className="gold-text">Collections</span>
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden lg:flex items-center gap-7 flex-shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium text-black/70 hover:text-black transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Search pill */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-gray-100 rounded-full pl-5 pr-12 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-200"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:bg-black-800 transition-colors"
              >
                <FontAwesomeIcon icon={faSearch} className="text-xs" />
              </button>
            </div>
          </form>

          {/* Right icons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              to="/cart"
              aria-label="Cart"
              className="relative w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <FontAwesomeIcon icon={faShoppingBag} className="text-black/70 text-sm" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-600 text-white text-[10px] rounded-full w-4.5 h-4.5 min-w-[18px] h-[18px] flex items-center justify-center font-bold">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="hidden sm:flex w-10 h-10 rounded-full bg-rose-50 items-center justify-center hover:bg-rose-100 transition-colors"
            >
              <FontAwesomeIcon icon={faHeart} className="text-rose-500 text-sm" />
            </Link>

            <Link
              to="/admin-login"
              className="hidden sm:flex items-center gap-2 pl-1 pr-4 py-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <span className="w-9 h-9 rounded-full bg-gold-100 flex items-center justify-center overflow-hidden">
                <FontAwesomeIcon icon={faUser} className="text-gold-600 text-sm" />
              </span>
              <span className="text-sm font-medium text-black/80">Account</span>
            </Link>

            <button
              onClick={() => dispatch(toggleMobileMenu())}
              aria-label="Toggle menu"
              className="lg:hidden w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} className="text-black/70" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-[420px] opacity-100 pb-4' : 'max-h-0 opacity-0'
        }`}>
          <form onSubmit={handleSearch} className="px-1 mb-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-gray-100 rounded-full pl-5 pr-12 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-200"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black text-white flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faSearch} className="text-xs" />
              </button>
            </div>
          </form>
          <div className="space-y-1 px-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => dispatch(closeMobileMenu())}
                className="block py-2.5 px-4 text-black/70 hover:text-black hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/wishlist"
              onClick={() => dispatch(closeMobileMenu())}
              className="block py-2.5 px-4 text-black/70 hover:text-black hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              Wishlist
            </Link>
            <Link
              to="/admin"
              onClick={() => dispatch(closeMobileMenu())}
              className="block py-2.5 px-4 text-black/70 hover:text-black hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              Account
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar

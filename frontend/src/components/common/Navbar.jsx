import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faShoppingBag,
  faHeart,
  faBars,
  faTimes,
  faStar,
  faPaintBrush,
  faShoePrints,
  faSocks,
  faSearch,
  faCrown,
  faUser,
  faChevronDown,
  faSignOutAlt,
  faCog,
  faUserCircle,
  faStore,
  faBox,
  faEnvelope,
  faUsers,
  faChartLine,
  faPlus,
  faHome,
  faTag,
  faEnvelope as faEnvelopeIcon,
} from '@fortawesome/free-solid-svg-icons'
import { toggleMobileMenu, closeMobileMenu } from '../../redux/slices/uiSlice'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isMobileMenuOpen } = useSelector((state) => state.ui)
  const { totalItems } = useSelector((state) => state.cart)
  const [searchQuery, setSearchQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`)
      setSearchQuery('')
      dispatch(closeMobileMenu())
    }
  }

  // Main nav links with dropdown
  const navLinks = [
    { name: 'Home', path: '/', icon: faHome },
    { name: 'Products', path: '/products', icon: faTag },
    { name: 'Contact', path: '/contact', icon: faEnvelopeIcon },
  ]

  // Additional links for the navigation dropdown
  const navDropdownLinks = [
    // ============ CATEGORIES ============
    { name: 'Dresses', path: '/category/dresses', icon: faStar },
    { name: 'Wigs', path: '/category/wigs', icon: faCrown },
    { name: 'Lip Gloss', path: '/category/lip-gloss', icon: faPaintBrush },
    { name: 'Sandals', path: '/category/sandals', icon: faShoePrints },
    { name: 'Slippers', path: '/category/slippers', icon: faSocks },
    // ============ OTHER LINKS ============
    { name: 'New Arrivals', path: '/products?sort=new', icon: faPlus },
    { name: 'Sale', path: '/products?category=sale', icon: faTag },
    { name: 'Featured', path: '/products?featured=true', icon: faStar },
    { name: 'About Us', path: '/about', icon: faStore },
  ]

  // ALL dropdown links in ONE dropdown (Account + Management)
  const allDropdownLinks = [
    // Account section
    { name: 'Admin Dashboard', path: '/admin-login', icon: faUserCircle, section: 'Account' }
  ]

  // Group links by section for display
  const groupedLinks = allDropdownLinks.reduce((acc, link) => {
    if (!acc[link.section]) acc[link.section] = []
    acc[link.section].push(link)
    return acc
  }, {})

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false)
      }
      if (!e.target.closest('.nav-dropdown-container')) {
        setIsNavDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-10 pt-4 transition-all duration-300">
      <nav className="max-w-7xl mx-auto bg-white rounded-xl md:rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.06)] px-4 sm:px-5">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <FontAwesomeIcon icon={faCrown} className="text-gold-600 text-xl" />
            <span className="text-lg font-bold whitespace-nowrap hidden sm:inline">
              <span className="text-black">Inez</span>
              <span className="gold-text">Collections</span>
            </span>
          </Link>

          {/* Nav links with dropdown (only on large screens) */}
          <div className="hidden lg:flex items-center gap-1 flex-shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium text-black/70 hover:text-black transition-colors px-3 py-2"
              >
                {link.name}
              </Link>
            ))}

            {/* Navigation Dropdown - "More" button */}
            <div className="relative nav-dropdown-container">
              <button
                onClick={() => setIsNavDropdownOpen(!isNavDropdownOpen)}
                className="flex items-center gap-1 text-sm font-medium text-black/70 hover:text-black transition-colors px-3 py-2"
              >
                More
                <FontAwesomeIcon icon={faChevronDown} className={`text-black/40 text-[10px] transition-transform duration-200 ${isNavDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isNavDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-semibold text-black/40 uppercase tracking-wider">Explore</p>
                  </div>
                  {navDropdownLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsNavDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-black/70 hover:bg-gold-50 hover:text-black transition-colors"
                    >
                      <FontAwesomeIcon icon={link.icon} className="text-gold-600 text-sm w-5" />
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
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

            {/* Account Dropdown */}
            <div className="relative dropdown-container">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 pl-1 pr-3 py-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <span className="w-9 h-9 rounded-full bg-gold-100 flex items-center justify-center overflow-hidden">
                  <FontAwesomeIcon icon={faUser} className="text-gold-600 text-sm" />
                </span>
                <span className="text-sm font-medium text-black/80 hidden sm:inline">Account</span>
                <FontAwesomeIcon icon={faChevronDown} className={`text-black/40 text-xs transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in max-h-[80vh] overflow-y-auto">
                  {Object.keys(groupedLinks).map((section) => (
                    <div key={section}>
                      <div className="px-4 py-1.5">
                        <p className="text-[10px] font-semibold text-black/40 uppercase tracking-wider">{section}</p>
                      </div>
                      {groupedLinks[section].map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => {
                            setIsDropdownOpen(false)
                            dispatch(closeMobileMenu())
                          }}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-black/70 hover:bg-gold-50 hover:text-black transition-colors"
                        >
                          <FontAwesomeIcon icon={link.icon} className="text-gold-600 text-sm w-5" />
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => dispatch(toggleMobileMenu())}
              aria-label="Toggle menu"
              className="lg:hidden w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} className="text-black/70" />
            </button>
          </div>
        </div>

        {/* Mobile menu - NO rounded corners, white background, scrollable */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-white py-4 border-t border-gray-100 overflow-y-auto max-h-[70vh]">
            <form onSubmit={handleSearch} className="px-4 mb-4">
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
            
            <div className="space-y-0.5 px-4">
              {/* Mobile: Main Nav Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => dispatch(closeMobileMenu())}
                  className="block py-2.5 px-4 text-black/70 hover:text-black hover:bg-gray-100 font-medium transition-colors rounded-lg"
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Mobile: Navigation Dropdown Links */}
              <div className="border-t border-gray-100 my-2 pt-2">
                <p className="px-4 text-xs font-semibold text-black/40 uppercase tracking-wider py-1">Explore</p>
                {navDropdownLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => dispatch(closeMobileMenu())}
                    className="flex items-center gap-3 py-2.5 px-4 text-black/70 hover:text-black hover:bg-gray-100 font-medium transition-colors rounded-lg"
                  >
                    <FontAwesomeIcon icon={link.icon} className="text-gold-600 text-sm w-5" />
                    {link.name}
                  </Link>
                ))}
              </div>
              
              {/* Mobile: All Account & Management Links */}
              <div className="border-t border-gray-100 my-2 pt-2">
                {Object.keys(groupedLinks).map((section) => (
                  <div key={section}>
                    <p className="px-4 text-xs font-semibold text-black/40 uppercase tracking-wider py-1">{section}</p>
                    {groupedLinks[section].map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => dispatch(closeMobileMenu())}
                        className="flex items-center gap-3 py-2.5 px-4 text-black/70 hover:text-black hover:bg-gray-100 font-medium transition-colors rounded-lg"
                      >
                        <FontAwesomeIcon icon={link.icon} className="text-gold-600 text-sm w-5" />
                        {link.name}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
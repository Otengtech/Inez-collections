import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faYoutube,
  faTiktok,
  faPinterest,
} from '@fortawesome/free-brands-svg-icons'
import {
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faCrown,
  faArrowRight,
  faClock,
} from '@fortawesome/free-solid-svg-icons'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: faFacebook, label: 'Facebook', color: 'hover:bg-[#1877F2]' },
    { icon: faTwitter, label: 'Twitter', color: 'hover:bg-[#000000]' },
    { icon: faInstagram, label: 'Instagram', color: 'hover:bg-[#E4405F]' },
    { icon: faYoutube, label: 'YouTube', color: 'hover:bg-[#FF0000]' },
    { icon: faTiktok, label: 'TikTok', color: 'hover:bg-[#000000]' },
    { icon: faPinterest, label: 'Pinterest', color: 'hover:bg-[#E60023]' },
  ]

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Contact', path: '/contact' },
    { name: 'About Us', path: '/about' },
  ]

  const categories = [
    { name: 'Dresses', path: '/products?category=dresses' },
    { name: 'Wigs', path: '/products?category=wigs' },
    { name: 'Lip Gloss', path: '/products?category=lip-gloss' },
    { name: 'Sandals', path: '/products?category=sandals' },
    { name: 'Slippers', path: '/products?category=slippers' },
  ]

  return (
    <footer className="relative bg-gray-900 text-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-400 via-gold-600 to-gold-400"></div>
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold-600/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gold-600/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faCrown} className="text-black text-lg" />
              </div>
              <span className="text-2xl font-bold">
                <span className="text-white">Inez</span>
                <span className="text-gold-600">Collections</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              Your premier destination for luxury fashion. Discover elegance in every piece, curated with passion and precision.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-2 flex-wrap">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href="#"
                  aria-label={social.label}
                  className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all duration-300 hover:scale-110 hover:shadow-lg ${social.color}`}
                >
                  <FontAwesomeIcon icon={social.icon} className="text-gray-400 hover:text-white transition-colors text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-gold-600"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-gold-600 transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-gold-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-gold-600"></span>
              Categories
            </h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    to={category.path}
                    className="text-gray-400 hover:text-gold-600 transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-gold-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-gold-600"></span>
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-600/20 transition-colors">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gold-600 text-sm" />
                </div>
                <span className="text-gray-400 text-sm leading-relaxed">
                  123 Fashion Avenue, <br />New York, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-600/20 transition-colors">
                  <FontAwesomeIcon icon={faPhone} className="text-gold-600 text-sm" />
                </div>
                <span className="text-gray-400 text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-600/20 transition-colors">
                  <FontAwesomeIcon icon={faEnvelope} className="text-gold-600 text-sm" />
                </div>
                <span className="text-gray-400 text-sm">info@inezcollections.com</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-600/20 transition-colors">
                  <FontAwesomeIcon icon={faClock} className="text-gold-600 text-sm" />
                </div>
                <span className="text-gray-400 text-sm">Mon-Fri: 9am - 6pm</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Inez Collections. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-gold-600 transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-gold-600 transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-gold-600 transition-colors">Shipping Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
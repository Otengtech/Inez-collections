import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faInstagram,
  faSnapchat,
  faWhatsapp, // ✅ This is in brands package
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
    { 
      icon: faInstagram, 
      label: 'Instagram', 
      color: 'hover:bg-[#E4405F]',
      url: 'https://instagram.com/maame_esi67'
    },
    { 
      icon: faSnapchat, 
      label: 'Snapchat', 
      color: 'hover:bg-[#FFFC00]',
      url: 'https://snapchat.com/add/eee_nez'
    },
  ]

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Contact', path: '/contact' },
    { name: 'About Us', path: '/about' },
  ]

  const categories = [
    { name: 'Dresses', path: '/category/dresses' },
    { name: 'Wigs', path: '/category/wigs' },
    { name: 'Lip Gloss', path: '/category/lip-gloss' },
    { name: 'Sandals', path: '/category/sandals' },
    { name: 'Slippers', path: '/category/slippers' },
  ]

  return (
    <footer className="relative bg-gray-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-bold">
                <span className="text-white">Inez Collections</span>
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
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all duration-300 hover:scale-110 hover:shadow-lg ${social.color}`}
                >
                  <FontAwesomeIcon 
                    icon={social.icon} 
                    className={`text-gray-400 hover:text-white transition-colors text-sm ${
                      social.label === 'Snapchat' ? 'hover:text-black' : ''
                    }`} 
                  />
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
                  Accra, Koforidua
                  <br />
                  <span className="text-xs text-gray-500">Pickup/Delivery Available</span>
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-600/20 transition-colors">
                  <FontAwesomeIcon icon={faPhone} className="text-gold-600 text-sm" />
                </div>
                <div>
                  <span className="text-gray-400 text-sm block">050967170</span>
                  <span className="text-gray-400 text-sm block">0551390411</span>
                </div>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-[#25D366]/20 transition-colors">
                  <FontAwesomeIcon icon={faWhatsapp} className="text-[#25D366] text-sm" />
                </div>
                <a 
                  href="https://wa.me/0243903661" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#25D366] transition-colors text-sm"
                >
                  0243903661
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-600/20 transition-colors">
                  <FontAwesomeIcon icon={faEnvelope} className="text-gold-600 text-sm" />
                </div>
                <a 
                  href="mailto:emaame371@gmail.com"
                  className="text-gray-400 hover:text-gold-600 transition-colors text-sm"
                >
                  emaame371@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-600/20 transition-colors">
                  <FontAwesomeIcon icon={faClock} className="text-gold-600 text-sm" />
                </div>
                <div>
                  <span className="text-gray-400 text-sm block">Mon - Fri: 9:00AM - 6:00PM</span>
                  <span className="text-gray-400 text-sm block">Sat: 10:00AM - 4:00PM</span>
                  <span className="text-gray-500 text-xs block">Sun: Closed / DM for orders</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Inez Collections. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faHeart, faStar } from '@fortawesome/free-solid-svg-icons'
import {
  faCrown,
  faPaintBrush,
  faShoePrints,
  faSocks,
  faTshirt,
} from '@fortawesome/free-solid-svg-icons'
import {
  faTwitter,
  faTiktok,
  faInstagram,
  faLinkedin
} from '@fortawesome/free-brands-svg-icons'
import ScrollReveal from '../common/ScrollReveal'
import img from '../../assets/img1.jpg'
import img1 from '../../assets/img2.jpg'
import img3 from '../../assets/img3.jpg'

// Categories matching the Navbar structure
const categoryDots = [
  {
    name: 'Dresses',
    slug: 'dresses',
    color: '#C77DFF',
    icon: faStar,
    iconColor: '#FFFFFF'
  },
  {
    name: 'Wigs',
    slug: 'wigs',
    color: '#F4A261',
    icon: faCrown,
    iconColor: '#FFFFFF'
  },
  {
    name: 'Lip Gloss',
    slug: 'lip-gloss',
    color: '#E63946',
    icon: faPaintBrush,
    iconColor: '#FFFFFF'
  },
  {
    name: 'Sandals',
    slug: 'sandals',
    color: '#2A9D8F',
    icon: faShoePrints,
    iconColor: '#FFFFFF'
  },
  {
    name: 'Slippers',
    slug: 'slippers',
    color: '#457B9D',
    icon: faSocks,
    iconColor: '#FFFFFF'
  },
]

const ArrowUpRight = ({ className = '' }) => (
  <FontAwesomeIcon icon={faArrowRight} className={`-rotate-45 ${className}`} />
)

const HeroSection = () => {
  return (
    <section className="relative pt-28 pb-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-[2.5rem] bg-[#EDF1EC] p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] overflow-hidden">
          {/* faint decorative line */}
          <svg className="absolute -top-10 -right-10 w-72 h-72 opacity-[0.15] pointer-events-none" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#000" strokeWidth="0.5" />
            <line x1="0" y1="40" x2="200" y2="0" stroke="#000" strokeWidth="0.5" />
          </svg>

          <div className="relative grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-5">
            {/* Big left card */}
            <ScrollReveal direction="left">
              <div className="relative bg-white rounded-[2rem] p-6 sm:p-10 h-full min-h-[520px] flex flex-col overflow-hidden">
                <span className="inline-flex items-center gap-2 w-fit px-4 py-2 bg-[#F4F6F2] rounded-full text-sm font-medium text-black/70 mb-8">
                  🛍️ Fashion is Timeless
                </span>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] text-black mb-8 max-w-md relative z-10">
                  Effortless
                  <br />
                  Everyday Elegance.
                </h1>

                <div className="flex items-center gap-4 mb-8 relative z-10">
                  <span className="text-3xl font-light text-black/20">01</span>
                  <span className="h-px w-14 bg-black/20"></span>
                  <div>
                    <p className="font-semibold text-black text-sm">Premium Fabrics</p>
                    <p className="text-sm text-black/50 max-w-[15rem]">
                      Soft, durable materials that hold up to a second look.
                    </p>
                  </div>
                </div>

                <Link
                  to="/products"
                  className="inline-flex items-center gap-3 w-fit bg-[#D6F04C] text-black font-semibold pl-6 pr-2 py-2 rounded-full hover:brightness-95 transition-all mb-auto relative z-10"
                >
                  View All Products
                  <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                    <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                  </span>
                </Link>

                {/* Floating product image */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[45%] max-w-[20rem] pointer-events-none">
                  <img
                    src={img}
                    alt="Featured piece from this season's collection"
                    className="w-72 hidden sm:flex h-auto object-contain rounded-2xl"
                  />
                </div>

                <div className="flex items-center gap-3 mt-10 relative z-10">
                  <span className="text-sm text-black/50">Follow us on:</span>
                  {[faTwitter, faTiktok, faInstagram, faLinkedin].map((icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="w-8 h-8 rounded-full bg-[#F4F6F2] flex items-center justify-center hover:bg-gold-100 transition-colors"
                    >
                      <FontAwesomeIcon icon={icon} className="text-black/60 text-xs" />
                    </a>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Right column */}
            <div className="flex flex-col gap-5">
              {/* Popular Categories */}
              <ScrollReveal direction="right" delay={100}>
                <div className="bg-white rounded-[1.75rem] p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-semibold text-black text-lg">Popular Categories</p>
                    <Link
                      to="/products"
                      className="text-xs text-gold-600 hover:text-gold-700 font-medium transition-colors flex items-center gap-1"
                    >
                      View All
                      <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {categoryDots.map((c) => (
                      <Link
                        key={c.name}
                        to={`/category/${c.slug}`}
                        className="group flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                      >
                        <div
                          className="w-14 h-14 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 cursor-pointer"
                          style={{ backgroundColor: c.color }}
                        >
                          <FontAwesomeIcon
                            icon={c.icon}
                            className="text-white text-xl"
                          />
                        </div>
                        <span className="text-xs text-gray-600 font-medium text-center leading-tight">
                          {c.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-2 gap-5 flex-1">
                {/* New Arrivals */}
                <ScrollReveal direction="right" delay={150}>
                  <Link
                    to="/products?sort=new"
                    className="relative bg-white rounded-[1.75rem] p-5 h-full min-h-[10rem] flex flex-col justify-between overflow-hidden group"
                  >
                    <p className="font-semibold text-white text-sm leading-snug relative z-10">
                      New
                      <br />
                      Arrivals
                    </p>
                    <span className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center relative z-10 group-hover:bg-[#D6F04C] transition-colors">
                      <ArrowUpRight className="text-xs" />
                    </span>
                    <img
                      src={img1}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/0" />
                  </Link>
                </ScrollReveal>

                {/* Tall image card */}
                <ScrollReveal direction="right" delay={200}>
                  <Link
                    to="/category/wigs"
                    className="relative bg-black rounded-[1.75rem] h-full min-h-[10rem] flex flex-col justify-between p-5 overflow-hidden group"
                  >
                    <span className="self-end w-8 h-8 rounded-full bg-white/90 flex items-center justify-center relative z-10 group-hover:bg-[#D6F04C] transition-colors">
                      <ArrowUpRight className="text-xs" />
                    </span>
                    <div className="relative z-10">
                      <p className="text-white font-semibold text-sm leading-snug">
                        Wigs
                        <br />
                        Collection
                      </p>
                      <p className="text-white/50 text-xs mt-1">Autumn edit</p>
                    </div>
                    <img
                      src={img3}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </Link>
                </ScrollReveal>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
            {/* More Products */}
            <ScrollReveal direction="up" delay={100}>
              <div className="bg-white rounded-[1.75rem] p-6 h-full">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="font-semibold text-black">More Products</p>
                    <p className="text-sm text-black/50">300+ items</p>
                  </div>
                  <span className="w-9 h-9 rounded-full bg-rose-50 flex items-center justify-center">
                    <FontAwesomeIcon icon={faHeart} className="text-rose-500 text-xs" />
                  </span>
                </div>
                <div className="flex gap-3">
                  {[
                    'https://images.unsplash.com/photo-1596993100471-c3905dafa78e?auto=format&fit=crop&w=200&q=80',
                    'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=200&q=80',
                    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=200&q=80',
                  ].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="w-16 h-16 rounded-2xl object-cover"
                    />
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Stat card */}
            <ScrollReveal direction="up" delay={200}>
              <div className="bg-white rounded-[1.75rem] p-6 h-full flex flex-col items-center text-center">
                <div className="flex -space-x-3 mb-4">
                  {[
                    'https://randomuser.me/api/portraits/women/68.jpg',
                    'https://randomuser.me/api/portraits/men/32.jpg',
                    'https://randomuser.me/api/portraits/women/44.jpg',
                  ].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="w-9 h-9 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>
                <div className="w-28 h-28 rounded-full bg-gold-600 text-white flex flex-col items-center justify-center mb-4">
                  <span className="text-2xl font-bold leading-none">50K+</span>
                  <span className="text-[11px] text-white/80 mt-1">Customers</span>
                </div>
                <span className="inline-flex items-center gap-1 bg-[#F4F6F2] rounded-full px-3 py-1.5 text-xs font-medium text-black/70">
                  <FontAwesomeIcon icon={faStar} className="text-gold-500" />
                  4.9 rating
                </span>
              </div>
            </ScrollReveal>

            {/* New collection */}
            <ScrollReveal direction="up" delay={300}>
              <div className="bg-white rounded-[1.75rem] p-6 h-full">
                <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-500 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                  🔥 Popular
                </span>
                <p className="font-semibold text-black mb-1">New Collection Released</p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex -space-x-3">
                    {[
                      'https://randomuser.me/api/portraits/women/12.jpg',
                      'https://randomuser.me/api/portraits/men/45.jpg',
                    ].map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt=""
                        className="w-8 h-8 rounded-full border-2 border-white object-cover"
                      />
                    ))}
                  </div>
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=200&q=80"
                      alt=""
                      className="w-16 h-16 rounded-2xl object-cover"
                    />
                    <span className="absolute -bottom-2 -left-2 bg-white shadow rounded-full px-2 py-0.5 text-[10px] font-bold flex items-center gap-1">
                      <FontAwesomeIcon icon={faStar} className="text-gold-500 text-[9px]" />
                      4.8
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
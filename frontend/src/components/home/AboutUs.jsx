import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight,
  faGem,
  faCrown,
  faUsers,
  faAward,
  faShieldAlt,
  faStar,
} from '@fortawesome/free-solid-svg-icons'
import ScrollReveal from '../../components/common/ScrollReveal'
import aboutBg from '../../assets/img1.jpg' // Adjust path as needed

const ArrowUpRight = ({ className = '' }) => (
  <FontAwesomeIcon icon={faArrowRight} className={`-rotate-45 ${className}`} />
)

const AboutMini = () => {
  const stats = [
    { value: '20+', label: 'Happy Customers', icon: faUsers },
    { value: '500', label: 'Products', icon: faStar },
    { value: '4.9', label: 'Average Rating', icon: faStar },
    { value: '100%', label: 'Authentic', icon: faShieldAlt },
  ]

  return (
    <section className="relative px-4 sm:px-6 lg:px-10 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-[2.5rem] bg-[#EDF1EC] p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] overflow-hidden">
          {/* Decorative elements */}
          <svg className="absolute -top-10 -right-10 w-72 h-72 opacity-[0.15] pointer-events-none" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#000" strokeWidth="0.5" />
            <line x1="0" y1="40" x2="200" y2="0" stroke="#000" strokeWidth="0.5" />
          </svg>

          {/* Main Content */}
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left - About Text with Background Image */}
            <ScrollReveal direction="left">
              <div className="relative bg-white rounded-[2rem] p-6 sm:p-8 h-full flex flex-col overflow-hidden group">
               
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/80 to-white/60 group-hover:from-white/80 group-hover:via-white/70 group-hover:to-white/50 transition-all duration-500"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <span className="inline-flex items-center gap-2 w-fit px-4 py-2 bg-[#F4F6F2] rounded-full text-sm font-medium text-black/70 mb-4">
                    Who We Are
                  </span>
                  <p className="text-black/60 leading-relaxed text-sm md:text-base">
                    INEZ is a Ghanaian beauty brand that makes clothes cute, hydrating, and fun.
                    Our signature collection is made to give you soft, shiny all day. With cute dessert charms + a soft shine finish, it meets accessory. We believe every girl deserves to feel glossy, confident, and pampered — without the sticky feeling.
                  </p>
                  
                  <div className="flex flex-wrap gap-3 mt-6">
                    <Link
                      to="/about"
                      className="inline-flex items-center gap-2 bg-[#D6F04C] text-black font-semibold pl-5 pr-1.5 py-1.5 rounded-full hover:brightness-95 transition-all text-sm"
                    >
                      Learn More
                      <span className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center">
                        <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                      </span>
                    </Link>
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-2 border border-gray-300 text-black/70 font-semibold pl-5 pr-1.5 py-1.5 rounded-full hover:bg-gray-50 transition-all text-sm"
                    >
                      Explore Products
                      <span className="w-7 h-7 rounded-full bg-gray-100 text-black/70 flex items-center justify-center">
                        <ArrowUpRight className="text-[10px]" />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Right - Stats */}
            <div className="flex flex-col gap-4">
              <ScrollReveal direction="right" delay={100}>
                <div className="bg-white rounded-[1.75rem] p-5 shadow-md hover:shadow-xl transition-shadow duration-300">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {stats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-1.5">
                          <FontAwesomeIcon icon={stat.icon} className="text-gray-100 text-sm" />
                        </div>
                        <p className="text-lg font-bold text-black">{stat.value}</p>
                        <p className="text-[10px] text-black/50">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Quick Values */}
              <div className="grid grid-cols-2 gap-4">
                <ScrollReveal direction="right" delay={150}>
                  <div className="bg-white rounded-[1.75rem] p-6 h-full flex flex-col items-start hover:scale-105 transition-transform duration-300">
                 
                    <h4 className="font-semibold text-black text-sm mb-0.5">Premium Quality</h4>
                    <p className="text-sm text-black/50">To provide affordable, high-quality clothes that hydrates deeply while making self-care feel fun and beautiful. </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="right" delay={200}>
                  <div className="bg-white rounded-[1.75rem] p-6 h-full flex flex-col items-start hover:scale-105 transition-transform duration-300">
                    
                    <h4 className="font-semibold text-black text-sm mb-0.5">Luxury Design</h4>
                    <p className="text-sm text-black/50">To become Ghana’s leading inez collections brand known for hydration, cuteness, and confidence.</p>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="relative mt-5">
            <ScrollReveal direction="up" delay={250}>
              <Link
                to="/about"
                className="block bg-gray-900 rounded-[1.75rem] p-6 text-center hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gold-600/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gold-600/10 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 flex items-center justify-center gap-4">
                  <span className="text-white text-sm md:text-base">
                    Learn more about our story and values
                  </span>
                  <span className="w-8 h-8 rounded-full bg-[#D6F04C] text-black flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutMini
import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight,
  faHeart,
  faStar,
  faCrown,
  faGem,
  faAward,
  faTrophy,
  faShieldAlt,
  faUsers,
  faCheckCircle,
  faClock,
  faTruck,
  faUndo,
} from '@fortawesome/free-solid-svg-icons'
import {
  faTwitter,
  faTiktok,
  faInstagram,
  faLinkedin,
} from '@fortawesome/free-brands-svg-icons'
import ScrollReveal from '../components/common/ScrollReveal'
import img from '../assets/img1.jpg'
import img1 from '../assets/img2.jpg'
import img3 from '../assets/img3.jpg'

const ArrowUpRight = ({ className = '' }) => (
  <FontAwesomeIcon icon={faArrowRight} className={`-rotate-45 ${className}`} />
)

const About = () => {
  const values = [
    {
      icon: faGem,
      title: 'Premium Quality',
      description: 'We source only the finest materials to ensure every piece meets our high standards.',
      color: 'from-purple-400 to-purple-600',
    },
    {
      icon: faCrown,
      title: 'Luxury Design',
      description: 'Our designs blend timeless elegance with modern trends for a unique style.',
      color: 'from-gold-400 to-gold-600',
    },
    {
      icon: faUsers,
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We\'re committed to exceptional service.',
      color: 'from-blue-400 to-blue-600',
    },
    {
      icon: faAward,
      title: 'Ethical Sourcing',
      description: 'We believe in sustainable fashion that respects both people and the planet.',
      color: 'from-green-400 to-green-600',
    },
  ]

  const stats = [
    { value: '50K+', label: 'Happy Customers', icon: faUsers },
    { value: '500+', label: 'Products', icon: faStar },
    { value: '4.9', label: 'Average Rating', icon: faStar },
    { value: '100%', label: 'Authentic', icon: faShieldAlt },
  ]

  return (
    <section className="relative pt-28 pb-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-[2.5rem] bg-[#EDF1EC] p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] overflow-hidden">
          {/* Decorative elements */}
          <svg className="absolute -top-10 -right-10 w-72 h-72 opacity-[0.15] pointer-events-none" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#000" strokeWidth="0.5" />
            <line x1="0" y1="40" x2="200" y2="0" stroke="#000" strokeWidth="0.5" />
          </svg>
          <svg className="absolute -bottom-10 -left-10 w-72 h-72 opacity-[0.15] pointer-events-none" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#000" strokeWidth="0.5" />
            <line x1="200" y1="40" x2="0" y2="0" stroke="#000" strokeWidth="0.5" />
          </svg>

          {/* Header Section */}
          <div className="relative text-center mb-12 md:mb-16">
            <ScrollReveal direction="up">
              <span className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-black/70 mb-4 shadow-sm">
                About Us
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] mb-4">
                Our <span className="text-gold-600">Story</span>
              </h1>
              <p className="text-black/50 max-w-2xl mx-auto text-sm md:text-base">
                At Inez Collections, we believe fashion is more than just clothing — it's a form of self-expression.
                We curate premium pieces that help you feel confident, elegant, and uniquely you.
              </p>
            </ScrollReveal>
          </div>

          {/* Main Content */}
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left Card - Our Story */}
            <ScrollReveal direction="left">
              <div className="bg-white rounded-[2rem] p-6 sm:p-10 h-full min-h-[400px] flex flex-col overflow-hidden">
                <span className="inline-flex items-center gap-2 w-fit px-4 py-2 bg-[#F4F6F2] rounded-full text-sm font-medium text-black/70 mb-6">
                  Our Journey
                </span>
                <h2 className="text-3xl font-bold text-black mb-4">Who We Are</h2>
                <p className="text-black/60 leading-relaxed mb-4">
                  INEZ is a Ghanaian beauty brand that makes clothes cute, hydrating, and fun.
                  Our signature *INEZ collection is made to give you soft, shiny all day. With cute dessert charms + a soft shine finish, its meets accessory. We believe every girl deserves to feel glossy, confident, and pampered — without the sticky feeling.
                </p>

                <div className="flex flex-wrap gap-3 mt-auto">
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-3 w-fit bg-[#D6F04C] text-black font-semibold pl-6 pr-2 py-2 rounded-full hover:brightness-95 transition-all"
                  >
                    Explore Collection
                    <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                      <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                    </span>
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-3 w-fit border border-gray-300 text-black/70 font-semibold pl-6 pr-2 py-2 rounded-full hover:bg-gray-50 transition-all"
                  >
                    Get in Touch
                    <span className="w-8 h-8 rounded-full bg-gray-100 text-black/70 flex items-center justify-center">
                      <ArrowUpRight className="text-xs" />
                    </span>
                  </Link>
                </div>

                {/* Decorative image */}
                <div className="absolute right-0 bottom-0 w-[40%] max-w-[16rem] pointer-events-none opacity-20">
                  <img
                    src={img}
                    alt="Decorative"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            </ScrollReveal>

            {/* Right Column */}
            <div className="flex flex-col gap-5">
              {/* Stats */}
              <ScrollReveal direction="right" delay={100}>
                <div className="bg-white rounded-[1.75rem] p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <FontAwesomeIcon icon={stat.icon} className="text-gold-600" />
                        </div>
                        <p className="text-xl font-bold text-black">{stat.value}</p>
                        <p className="text-xs text-black/50">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Mission & Vision */}
              <div className="grid grid-cols-2 gap-5 flex-1">
                <ScrollReveal direction="right" delay={150}>
                  <div className="bg-white rounded-[1.75rem] p-5 h-full min-h-[10rem] flex flex-col justify-between overflow-hidden group relative">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gold-100/30 rounded-full blur-2xl"></div>
                    <div>
                      <span className="text-3xl mb-2 block">🚀</span>
                      <h3 className="font-semibold text-black text-sm">Our Mission</h3>
                      <p className="text-sm text-black/50 mt-1">
                        To provide affordable, high-quality clothes that hydrates deeply while making self-care feel fun and beautiful. We want every INEZ girl to shine inside and out. 
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center relative z-10">
                      <FontAwesomeIcon icon={faArrowRight} className="text-gold-600 text-xs" />
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="right" delay={200}>
                  <div className="relative bg-white rounded-[1.75rem] h-full min-h-[10rem] flex flex-col justify-between p-5 overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gold-600/10 rounded-full blur-2xl"></div>
                    <div>
                      <span className="text-3xl mb-2 block">🌟</span>
                      <h3 className="font-semibold text-black text-sm">Our Vision</h3>
                      <p className="text-sm text-black/50 mt-1">
                        To become Ghana’s leading inez collections brand known for hydration, cuteness, and confidence — making INEZ a household name across
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center relative z-10">
                      <FontAwesomeIcon icon={faArrowRight} className="text-black/50 text-xs" />
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>

          {/* Our Values */}
          <div className="relative mt-5">
            <ScrollReveal direction="up" delay={100}>
              <div className="bg-white rounded-[1.75rem] p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-black text-lg">Our Values</h3>
                    <p className="text-sm text-black/50">What drives us every day</p>
                  </div>
                  <span className="w-9 h-9 rounded-full bg-gold-100 flex items-center justify-center">
                    <FontAwesomeIcon icon={faAward} className="text-gold-600 text-sm" />
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {values.map((value, index) => (
                    <ScrollReveal key={index} direction="up" delay={150 + index * 100}>
                      <div className="group p-4 rounded-xl bg-[#F4F6F2] hover:bg-gold-50 transition-all duration-300 hover:scale-105">
                        <div className={`w-12 h-12 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                          <FontAwesomeIcon icon={value.icon} className="text-white text-lg" />
                        </div>
                        <h4 className="font-semibold text-black text-sm mb-1">{value.title}</h4>
                        <p className="text-xs text-black/50 leading-relaxed">{value.description}</p>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* CTA Section */}
          <div className="relative mt-5">
            <ScrollReveal direction="up" delay={300}>
              <div className="bg-gray-900 rounded-[1.75rem] p-8 text-center overflow-hidden relative">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gold-600/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gold-600/10 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-2">Ready to Elevate Your Style?</h3>
                  <p className="text-white/60 mb-6 max-w-md mx-auto">
                    Discover our curated collection of premium fashion pieces designed for the modern individual.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-3 bg-[#D6F04C] text-black font-semibold pl-6 pr-2 py-2 rounded-full hover:brightness-95 transition-all"
                    >
                      Shop Now
                      <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                        <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                      </span>
                    </Link>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-3 bg-white/10 text-white font-semibold pl-6 pr-2 py-2 rounded-full hover:bg-white/20 transition-all"
                    >
                      Contact Us
                      <span className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center">
                        <ArrowUpRight className="text-xs" />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Social & Footer */}
          <div className="relative mt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <ScrollReveal direction="up" delay={350}>
              <div className="flex items-center gap-3">
                <span className="text-sm text-black/50">Follow us on:</span>
                {[faTwitter, faTiktok, faInstagram, faLinkedin].map((icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gold-50 hover:shadow-md transition-all"
                  >
                    <FontAwesomeIcon icon={icon} className="text-black/60 text-sm hover:text-gold-600 transition-colors" />
                  </a>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
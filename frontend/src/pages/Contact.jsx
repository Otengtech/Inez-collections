import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faArrowRight,
  faClock,
  faPaperPlane
} from '@fortawesome/free-solid-svg-icons'

import {
  faInstagram,
  faSnapchat,
  faWhatsapp, // ✅ This is in brands package
} from '@fortawesome/free-brands-svg-icons'
import ScrollReveal from '../components/common/ScrollReveal'
import api from '../services/api'

const ArrowUpRight = ({ className = '' }) => (
  <FontAwesomeIcon icon={faArrowRight} className={`-rotate-45 ${className}`} />
)

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      await api.post('/contact', formData)
      toast.success("Message sent successfully! We'll get back to you soon.")
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: faEnvelope,
      title: 'Email Us',
      details: 'emaame371@gmail.com',
      description: "We'll respond within 24 hours",
      color: '#457B9D',
      bgColor: '#457B9D1A',
      link: 'mailto:emaame371@gmail.com',
    },
    {
      icon: faPhone,
      title: 'Call Us',
      details: '050967170 / 0551390411',
      description: 'Mon-Fri 9am - 6pm',
      color: '#2A9D8F',
      bgColor: '#2A9D8F1A',
      link: 'tel:050967170',
    },
    {
      icon: faWhatsapp,
      title: 'WhatsApp',
      details: '0243903661',
      description: 'Click to chat with us',
      color: '#25D366',
      bgColor: '#25D3661A',
      link: 'https://wa.me/0243903661',
    },
    {
      icon: faMapMarkerAlt,
      title: 'Visit Us',
      details: 'Accra, Koforidua',
      description: 'Pickup/Delivery Available',
      color: '#E63946',
      bgColor: '#E639461A',
      link: null,
    },
  ]

  return (
    <section className="relative pt-28 pb-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-[2.5rem] bg-[#EDF1EC] p-4 sm:p-6 md:p-8 lg:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.06)] overflow-hidden">

          {/* Header */}
          <ScrollReveal direction="up">
            <div className="relative text-center mb-10 md:mb-14">
              <span className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-black/70 mb-4 shadow-sm">
                Get in Touch
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] mb-3">
                Contact <span className="text-gold-600">Us</span>
              </h1>
              <p className="text-black/50 max-w-xl mx-auto text-sm md:text-base">
                Have questions? We'd love to hear from you — send a message and we'll
                respond as soon as possible.
              </p>
            </div>
          </ScrollReveal>

          <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left column — contact info */}
            <div className="lg:col-span-1 flex flex-col gap-5">
              {contactInfo.map((info, index) => {
                const content = (
                  <div
                    key={info.title}
                    className={`group bg-white rounded-[1.75rem] p-5 flex items-center gap-4 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md ${info.link ? 'cursor-pointer' : ''}`}
                  >
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                      style={{ backgroundColor: info.bgColor }}
                    >
                      <FontAwesomeIcon
                        icon={info.icon}
                        className="text-lg"
                        style={{ color: info.color }}
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-black text-sm">{info.title}</h3>
                      <p className="text-black/80 text-sm font-medium truncate">{info.details}</p>
                      <p className="text-xs text-black/40">{info.description}</p>
                    </div>
                  </div>
                )

                // If there's a link, wrap with anchor tag
                return info.link ? (
                  <ScrollReveal key={info.title} direction="left" delay={index * 100}>
                    <a href={info.link} target={info.link.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer">
                      {content}
                    </a>
                  </ScrollReveal>
                ) : (
                  <ScrollReveal key={info.title} direction="left" delay={index * 100}>
                    {content}
                  </ScrollReveal>
                )
              })}

              {/* Business hours — dark tile */}
              <ScrollReveal direction="left" delay={400}>
                <div className="relative bg-black rounded-[1.75rem] p-6 overflow-hidden flex-1 group hover:shadow-xl transition-all duration-300">
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#D6F04C]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#D6F04C]/20 transition-all duration-500"></div>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D6F04C] via-gold-400 to-[#D6F04C] opacity-50"></div>

                  <div className="relative flex items-center gap-3 mb-4">
                    <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                      <FontAwesomeIcon icon={faClock} className="text-[#D6F04C] text-sm" />
                    </span>
                    <h3 className="font-semibold text-white text-sm">Business Hours</h3>
                  </div>

                  <div className="relative space-y-2 text-sm text-white/60">
                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span>Monday – Friday</span>
                      <span className="text-white/90 font-medium">9:00AM – 6:00PM</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span>Saturday</span>
                      <span className="text-white/90 font-medium">10:00AM – 4:00PM</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span>Sunday</span>
                      <span className="text-white/40 font-medium">Closed (DM for orders)</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right column — form */}
            <div className="lg:col-span-2">
              <ScrollReveal direction="right" delay={150}>
                <div className="bg-white rounded-[1.75rem] p-6 md:p-8 lg:p-10 h-full shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center">
                      <FontAwesomeIcon icon={faPaperPlane} className="text-gold-600 text-sm" />
                    </div>
                    <h2 className="text-2xl font-bold text-black">Send Us a Message</h2>
                  </div>
                  <p className="text-sm text-black/40 mb-8 ml-14">
                    Fill in the details below and we'll be in touch shortly.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-black/70 mb-1.5">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[#F4F6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-200 focus:bg-white transition-all text-sm border border-transparent focus:border-gold-300"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black/70 mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[#F4F6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-200 focus:bg-white transition-all text-sm border border-transparent focus:border-gold-300"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black/70 mb-1.5">
                        Subject *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#F4F6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-200 focus:bg-white transition-all text-sm border border-transparent focus:border-gold-300"
                        placeholder="How can we help?"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black/70 mb-1.5">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="5"
                        className="w-full px-4 py-3 bg-[#F4F6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-200 focus:bg-white transition-all resize-none text-sm border border-transparent focus:border-gold-300"
                        placeholder="Write your message here..."
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-black text-white font-semibold pl-6 pr-2 py-2 rounded-full hover:bg-black-800 transition-all duration-300 disabled:opacity-50 group shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      {loading ? 'Sending...' : 'Send Message'}
                      <span className="w-8 h-8 rounded-full bg-[#D6F04C] text-black flex items-center justify-center shrink-0 transition-all duration-300 group-hover:rotate-12">
                        <ArrowUpRight className="text-xs" />
                      </span>
                    </button>
                  </form>
                </div>
              </ScrollReveal>
              <div className="flex items-center gap-3 mt-10 relative z-10">
                <span className="text-sm text-gray-600">Follow us on:</span>

                {/* Instagram */}
                <a
                  href="https://instagram.com/maame_esi67"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center hover:bg-[#E4405F] hover:text-white transition-all duration-300 group"
                >
                  <FontAwesomeIcon
                    icon={faInstagram}
                    className="text-white text-xs group-hover:text-white transition-colors"
                  />
                </a>

                {/* Snapchat */}
                <a
                  href="https://snapchat.com/add/eee_nez"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center hover:bg-[#FFFC00] hover:text-black transition-all duration-300 group"
                >
                  <FontAwesomeIcon
                    icon={faSnapchat}
                    className="text-white text-xs group-hover:text-black transition-colors"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
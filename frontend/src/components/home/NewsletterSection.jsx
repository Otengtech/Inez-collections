import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faPaperPlane, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import ScrollReveal from '../common/ScrollReveal'
import api from '../../services/api'

const ArrowUpRight = ({ className = '' }) => (
  <FontAwesomeIcon icon={faArrowRight} className={`-rotate-45 ${className}`} />
)

const NewsletterSection = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate email
    if (!email) {
      toast.error('Please enter your email')
      return
    }

    // Basic email validation
    const emailRegex = /^\S+@\S+\.\S+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/newsletter/subscribe', { email })
      
      // Check response
      if (response.data.success) {
        toast.success(response.data.message || '🎉 Subscribed successfully!')
        setEmail('')
      } else {
        toast.error(response.data.message || 'Subscription failed')
      }
    } catch (error) {
      console.error('Subscription error:', error)
      
      // Check if error has response data
      const errorMessage = error.response?.data?.message || error.message || 'Subscription failed'
      
      // Don't show duplicate error if it's already handled
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative px-4 sm:px-6 lg:px-10 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-[2.5rem] bg-gray-900 p-8 sm:p-14 overflow-hidden">
          {/* decorative accents */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#D6F04C]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-gold-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <svg className="absolute top-6 right-8 w-40 h-40 opacity-[0.08] pointer-events-none" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#fff" strokeWidth="0.5" />
          </svg>

          <div className="relative max-w-2xl mx-auto text-center">
            <ScrollReveal direction="up">
              <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white/80 mb-5">
                Newsletter
              </span>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={100}>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">
                Subscribe to Our <span className="text-[#D6F04C]">Newsletter</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={150}>
              <p className="text-white/50 mb-9 text-sm md:text-base">
                Get the latest updates on new products and upcoming sales
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={200}>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <div className="flex-1 relative">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-black/30 text-sm"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-[#D6F04C]"
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#D6F04C] text-black pl-6 pr-2 py-2 rounded-full hover:brightness-95 transition-all duration-300 inline-flex items-center justify-center gap-3 font-semibold disabled:opacity-70"
                >
                  {loading ? 'Sending...' : 'Subscribe'}
                  <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <ArrowUpRight className="text-xs" />
                    )}
                  </span>
                </button>
              </form>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NewsletterSection
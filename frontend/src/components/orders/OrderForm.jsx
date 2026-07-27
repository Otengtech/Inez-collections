import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faArrowRight } from '@fortawesome/free-solid-svg-icons'

const ArrowUpRight = ({ className = '' }) => (
  <FontAwesomeIcon icon={faArrowRight} className={`-rotate-45 ${className}`} />
)

const OrderForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-black/70 mb-1.5">
            Full Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#F4F6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-200 focus:bg-white transition-all text-sm border border-transparent focus:border-gold-300"
            placeholder="John Doe"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black/70 mb-1.5">
            Email *
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
          Phone *
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-[#F4F6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-200 focus:bg-white transition-all text-sm border border-transparent focus:border-gold-300"
          placeholder="+1 (555) 123-4567"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-black/70 mb-1.5">
          Address *
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-[#F4F6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-200 focus:bg-white transition-all text-sm border border-transparent focus:border-gold-300"
          placeholder="123 Main St"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-medium text-black/70 mb-1.5">
            City *
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#F4F6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-200 focus:bg-white transition-all text-sm border border-transparent focus:border-gold-300"
            placeholder="New York"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black/70 mb-1.5">
            State *
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#F4F6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-200 focus:bg-white transition-all text-sm border border-transparent focus:border-gold-300"
            placeholder="NY"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black/70 mb-1.5">
            Zip Code *
          </label>
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#F4F6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-200 focus:bg-white transition-all text-sm border border-transparent focus:border-gold-300"
            placeholder="10001"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-black/70 mb-1.5">
          Country
        </label>
        <select
          name="country"
          value={formData.country}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-[#F4F6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-200 focus:bg-white transition-all text-sm border border-transparent focus:border-gold-300"
        >
          <option value="USA">USA</option>
          <option value="Canada">Canada</option>
          <option value="UK">UK</option>
          <option value="Nigeria">Nigeria</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-3 bg-black text-white font-semibold pl-6 pr-2 py-3 rounded-full hover:bg-black-800 transition-all duration-300 disabled:opacity-50 group shadow-lg hover:shadow-xl hover:scale-[1.02]"
      >
        <FontAwesomeIcon icon={faLock} className="text-sm" />
        {loading ? 'Processing...' : 'Place Order'}
        <span className="w-8 h-8 rounded-full bg-[#D6F04C] text-black flex items-center justify-center shrink-0 transition-all duration-300 group-hover:rotate-12">
          <ArrowUpRight className="text-xs" />
        </span>
      </button>
    </form>
  )
}

export default OrderForm
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faArrowRight, faTruck, faStore } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'

const ArrowUpRight = ({ className = '' }) => (
  <FontAwesomeIcon icon={faArrowRight} className={`-rotate-45 ${className}`} />
)

const OrderForm = ({ onSubmit, loading }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    deliveryType: 'delivery', // 'delivery' or 'pickup'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.address.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Call the onSubmit prop (which should handle the API call)
      const result = await onSubmit(formData)
      
      // If order was successful, navigate to orders page
      if (result && result.success) {
        toast.success('Order placed successfully! 🎉')
        // Navigate to orders page with the order ID
        navigate(`/order-success?orderId=${result.order?._id || result.order?.id || ''}`)
      }
    } catch (error) {
      console.error('Order submission error:', error)
      toast.error(error.message || 'Failed to place order')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
          placeholder="+233 XX XXX XXXX"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-black/70 mb-1.5">
          Address / Location *
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-[#F4F6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-200 focus:bg-white transition-all text-sm border border-transparent focus:border-gold-300"
          placeholder="123 Main St, Accra"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-black/70 mb-1.5">
          Delivery Type *
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, deliveryType: 'delivery' })}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
              formData.deliveryType === 'delivery'
                ? 'border-[#D6F04C] bg-[#D6F04C]/10 text-black'
                : 'border-gray-200 bg-[#F4F6F2] text-gray-600 hover:border-gray-300'
            }`}
          >
            <FontAwesomeIcon icon={faTruck} className="text-sm" />
            <span className="text-sm font-medium">Delivery</span>
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, deliveryType: 'pickup' })}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
              formData.deliveryType === 'pickup'
                ? 'border-[#D6F04C] bg-[#D6F04C]/10 text-black'
                : 'border-gray-200 bg-[#F4F6F2] text-gray-600 hover:border-gray-300'
            }`}
          >
            <FontAwesomeIcon icon={faStore} className="text-sm" />
            <span className="text-sm font-medium">Pickup</span>
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || loading}
        className="w-full inline-flex items-center justify-center gap-3 bg-black text-white font-semibold pl-6 pr-2 py-3 rounded-full hover:bg-black-800 transition-all duration-300 disabled:opacity-50 group shadow-lg hover:shadow-xl hover:scale-[1.02]"
      >
        <FontAwesomeIcon icon={faLock} className="text-sm" />
        {isSubmitting || loading ? 'Processing...' : 'Place Order'}
        <span className="w-8 h-8 rounded-full bg-[#D6F04C] text-black flex items-center justify-center shrink-0 transition-all duration-300 group-hover:rotate-12">
          <ArrowUpRight className="text-xs" />
        </span>
      </button>
    </form>
  )
}

export default OrderForm
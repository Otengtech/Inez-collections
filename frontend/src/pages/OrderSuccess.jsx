import React, { useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheckCircle,
  faArrowLeft,
  faTruck,
  faEnvelope,
  faClock,
  faGift,
  faArrowRight,
  faShoppingBag,
  faPrint
} from '@fortawesome/free-solid-svg-icons'
import ScrollReveal from '../components/common/ScrollReveal'

const ArrowUpRight = ({ className = '' }) => (
  <FontAwesomeIcon icon={faArrowRight} className={`-rotate-45 ${className}`} />
)

const OrderSuccess = () => {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')
  const { currentOrder } = useSelector((state) => state.orders)

  const orderNumber = orderId || currentOrder?._id || ''

  const steps = [
    { icon: faEnvelope, title: 'Confirmation Email', description: 'Sent to your email', color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: faClock, title: 'Order Processing', description: '24-48 hours', color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { icon: faTruck, title: 'Shipping Updates', description: 'Track your order', color: 'text-purple-500', bg: 'bg-purple-50' },
    { icon: faGift, title: 'Delivery', description: 'Arriving soon!', color: 'text-green-500', bg: 'bg-green-50' },
  ]

  return (
    <section className="relative px-4 sm:px-6 lg:px-10 pt-28 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-[2.5rem] bg-[#EDF1EC] p-6 sm:p-8 lg:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.06)] overflow-hidden">
          <ScrollReveal direction="up">
            {/* Success Icon */}
            <div className="relative text-center">
              <div className="inline-flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-28 h-28 rounded-full bg-green-100 flex items-center justify-center animate-bounce-slow">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-6xl text-green-500"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#D6F04C] flex items-center justify-center shadow-lg">
                    <span className="text-black text-sm font-bold">✓</span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] mb-3">
                Order <span className="text-[#D6F04C]">Confirmed!</span>
              </h1>

              <p className="text-black/60 text-sm md:text-base max-w-md mx-auto">
                Thank you for your order! We're excited to prepare your items.
              </p>

              {orderNumber && (
                <div className="inline-flex items-center gap-3 mt-4 px-6 py-3 bg-white rounded-full shadow-sm">
                  <span className="text-xs text-black/40 font-medium">ORDER ID</span>
                  <span className="text-sm font-bold text-black font-mono tracking-wider">
                    #{orderNumber.slice(-8).toUpperCase()}
                  </span>
                  <button
                    onClick={() => navigator.clipboard.writeText(orderNumber)}
                    className="text-xs text-[#D6F04C] hover:text-[#C5E043] transition-colors font-medium"
                  >
                    Copy
                  </button>
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* What's Next Section */}
          <ScrollReveal direction="up" delay={100}>
            <div className="mt-10">
              <h3 className="font-semibold text-lg text-black mb-6 text-center flex items-center justify-center gap-2">
                <span className="w-1 h-6 bg-[#D6F04C] rounded-full"></span>
                What's Next?
                <span className="w-1 h-6 bg-[#D6F04C] rounded-full"></span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-5 text-center shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                  >
                    <div className={`w-14 h-14 ${step.bg} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <FontAwesomeIcon icon={step.icon} className={`text-2xl ${step.color}`} />
                    </div>
                    <h4 className="font-semibold text-black text-sm">{step.title}</h4>
                    <p className="text-xs text-black/40 mt-1">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Order Summary - if currentOrder exists */}
          {currentOrder && (
            <ScrollReveal direction="up" delay={150}>
              <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-black text-sm flex items-center gap-2">
                    <FontAwesomeIcon icon={faShoppingBag} className="text-[#D6F04C]" />
                    Order Summary
                  </h4>
                  <span className="text-xs text-black/40">
                    {currentOrder.items?.length || 0} items
                  </span>
                </div>

                <div className="space-y-3 max-h-[200px] overflow-y-auto">
                  {currentOrder.items?.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 bg-[#F4F6F2] rounded-xl">
                      <img
                        src={item.image || '/placeholder.jpg'}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black truncate">{item.name}</p>
                        <p className="text-xs text-black/40">x{item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-[#D6F04C]">
                        ₵{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                  {currentOrder.items?.length > 3 && (
                    <p className="text-xs text-black/40 text-center">
                      +{currentOrder.items.length - 3} more items
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm text-black/60">Total</span>
                  <span className="text-xl font-bold text-[#D6F04C]">
                    ₵{currentOrder.totalAmount?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* Action Buttons */}
          <ScrollReveal direction="up" delay={200}>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              {orderNumber && (
                <Link
                  to={`/order-tracking/${orderNumber}`}
                  className="inline-flex items-center gap-3 bg-black text-white font-semibold pl-6 pr-2 py-3 rounded-full hover:bg-black-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
                >
                  <FontAwesomeIcon icon={faTruck} className="text-sm" />
                  Track Order
                  <span className="w-8 h-8 rounded-full bg-[#D6F04C] text-black flex items-center justify-center transition-all duration-300 group-hover:rotate-12">
                    <ArrowUpRight className="text-xs" />
                  </span>
                </Link>
              )}

              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-gray-200 text-black/60 font-medium hover:bg-white hover:border-[#D6F04C] hover:text-black transition-all duration-300 hover:shadow-lg"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
                Continue Shopping
              </Link>

              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-black/40 hover:text-black hover:bg-white transition-all duration-300"
              >
                <FontAwesomeIcon icon={faPrint} className="text-sm" />
                Print Receipt
              </button>
            </div>
          </ScrollReveal>

          {/* Footer Message */}
          <ScrollReveal direction="up" delay={250}>
            <div className="mt-8 text-center">
              <p className="text-xs text-black/30">
                A confirmation email has been sent to your registered email address.
              </p>
              <p className="text-xs text-black/20 mt-1">
                For any questions, please <Link to="/contact" className="text-[#D6F04C] hover:text-[#C5E043] transition-colors">contact us</Link>
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

export default OrderSuccess
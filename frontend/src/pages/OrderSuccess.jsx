import React, { useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import ScrollReveal from '../components/common/ScrollReveal'

const OrderSuccess = () => {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')
  const { currentOrder } = useSelector((state) => state.orders)

  return (
    <div className="section-padding mt-20 min-h-[70vh] flex items-center">
      <div className="container-custom">
        <ScrollReveal direction="up">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <FontAwesomeIcon 
                icon={faCheckCircle} 
                className="text-6xl text-green-500" 
              />
            </div>
            
            <h1 className="text-4xl font-bold mb-4">
              Order <span className="gold-text">Confirmed!</span>
            </h1>
            
            <p className="text-black-600 mb-2">
              Thank you for your order! We'll send you a confirmation email shortly.
            </p>
            
            {orderId && (
              <p className="text-black-500 mb-6">
                Order ID: <span className="font-semibold">{orderId}</span>
              </p>
            )}

            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-semibold mb-2">What's Next?</h3>
              <ul className="space-y-2 text-black-600">
                <li>📧 You'll receive a confirmation email</li>
                <li>📦 We'll process your order within 24-48 hours</li>
                <li>🚚 You'll get shipping updates via email</li>
                <li>💳 Payment will be processed securely</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={`/order-tracking/${orderId}`}
                className="btn-gold"
              >
                Track Order
              </Link>
              <Link
                to="/products"
                className="btn-outline-gold"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}

export default OrderSuccess
import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrderById } from '../redux/slices/orderSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCheck, faClock, faTruck, faBox } from '@fortawesome/free-solid-svg-icons'
import Loader from '../components/common/Loader'
import ScrollReveal from '../components/common/ScrollReveal'

const OrderTracking = () => {
  const { orderId } = useParams()
  const dispatch = useDispatch()
  const { currentOrder, loading } = useSelector((state) => state.orders)
  const { guestId } = useSelector((state) => state.cart)

  useEffect(() => {
    if (orderId && guestId) {
      dispatch(fetchOrderById({ orderId, guestId }))
    }
  }, [dispatch, orderId, guestId])

  const getStatusSteps = () => {
    const steps = ['pending', 'processing', 'shipped', 'delivered']
    const currentIndex = steps.indexOf(currentOrder?.status || 'pending')
    
    return steps.map((step, index) => ({
      label: step.charAt(0).toUpperCase() + step.slice(1),
      icon: step === 'pending' ? faClock : 
            step === 'processing' ? faBox :
            step === 'shipped' ? faTruck : faCheck,
      isCompleted: index <= currentIndex,
      isCurrent: index === currentIndex,
    }))
  }

  if (loading) {
    return <Loader />
  }

  if (!currentOrder) {
    return (
      <div className="container-custom py-20 text-center">
        <p className="text-black-600">Order not found</p>
        <Link to="/products" className="btn-gold inline-block mt-4">
          Browse Products
        </Link>
      </div>
    )
  }

  const steps = getStatusSteps()

  return (
    <div className="section-padding mt-20">
      <div className="container-custom max-w-3xl mx-auto">
        <ScrollReveal direction="up">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-black-600 hover:text-gold-600 transition-colors mb-8"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Shopping
          </Link>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100}>
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Order Tracking</h1>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                currentOrder.status === 'delivered' ? 'bg-green-100 text-green-600' :
                currentOrder.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                {currentOrder.status.toUpperCase()}
              </span>
            </div>

            <p className="text-black-500 mb-8">
              Order ID: <span className="font-semibold">{currentOrder._id}</span>
            </p>

            {/* Status Timeline */}
            <div className="relative mb-8">
              <div className="flex justify-between">
                {steps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.isCompleted ? 'bg-gold-600 text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                      <FontAwesomeIcon icon={step.icon} />
                    </div>
                    <p className={`text-xs mt-2 ${
                      step.isCompleted ? 'text-gold-600 font-semibold' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>
              
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
                <div 
                  className="h-full bg-gold-600 transition-all duration-500"
                  style={{ 
                    width: `${((steps.findIndex(s => s.isCurrent) + 1) / steps.length) * 100}%` 
                  }}
                />
              </div>
            </div>

            {/* Order Details */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold mb-4">Order Details</h3>
              
              <div className="space-y-4">
                {currentOrder.items.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <img
                      src={item.image || '/placeholder.jpg'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-black-500">x{item.quantity}</p>
                      {item.size && <p className="text-sm text-black-500">Size: {item.size}</p>}
                      {item.color && <p className="text-sm text-black-500">Color: {item.color}</p>}
                    </div>
                    <p className="font-bold gold-text">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="gold-text">${currentOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="border-t border-gray-200 mt-6 pt-6">
              <h3 className="font-semibold mb-3">Shipping Address</h3>
              <p className="text-black-600">
                {currentOrder.shippingAddress.fullName}<br />
                {currentOrder.shippingAddress.address}<br />
                {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} {currentOrder.shippingAddress.zipCode}<br />
                {currentOrder.shippingAddress.country}<br />
                Phone: {currentOrder.shippingAddress.phone}
              </p>
            </div>

            {/* Tracking Number */}
            {currentOrder.trackingNumber && (
              <div className="border-t border-gray-200 mt-6 pt-6">
                <h3 className="font-semibold mb-2">Tracking Number</h3>
                <p className="text-black-600">{currentOrder.trackingNumber}</p>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}

export default OrderTracking
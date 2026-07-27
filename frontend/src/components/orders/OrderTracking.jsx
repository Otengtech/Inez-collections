import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCheck, 
  faClock, 
  faTruck, 
  faBox,
  faPackage,
  faMapMarkerAlt,
  faCalendar
} from '@fortawesome/free-solid-svg-icons'

const OrderTracking = ({ order }) => {
  const getStatusSteps = () => {
    const steps = ['pending', 'processing', 'shipped', 'delivered']
    const currentIndex = steps.indexOf(order?.status || 'pending')
    
    return steps.map((step, index) => ({
      label: step.charAt(0).toUpperCase() + step.slice(1),
      icon: step === 'pending' ? faClock : 
            step === 'processing' ? faBox :
            step === 'shipped' ? faTruck : faCheck,
      isCompleted: index <= currentIndex,
      isCurrent: index === currentIndex,
    }))
  }

  const steps = getStatusSteps()

  return (
    <div className="bg-white rounded-[1.75rem] shadow-sm p-6 md:p-8 lg:p-10 hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faPackage} className="text-gold-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-black">Order Tracking</h1>
            <p className="text-sm text-black/40">Order ID: {order._id}</p>
          </div>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
          order.status === 'delivered' ? 'bg-green-100 text-green-600' :
          order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
          'bg-blue-100 text-blue-600'
        }`}>
          {order.status.toUpperCase()}
        </span>
      </div>

      {/* Status Timeline */}
      <div className="relative mb-10 pt-4">
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                step.isCompleted ? 'bg-gold-600 text-white shadow-lg shadow-gold-600/30' : 'bg-[#F4F6F2] text-gray-400'
              }`}>
                <FontAwesomeIcon icon={step.icon} className={step.isCompleted ? '' : 'text-sm'} />
              </div>
              <p className={`text-xs mt-2 font-medium ${
                step.isCompleted ? 'text-gold-600' : 'text-gray-400'
              }`}>
                {step.label}
              </p>
              {step.isCurrent && (
                <span className="text-[10px] text-gold-600 animate-pulse">Current</span>
              )}
            </div>
          ))}
        </div>
        
        {/* Progress Line */}
        <div className="absolute top-[38px] left-0 right-0 h-1 bg-[#F4F6F2] -z-10">
          <div 
            className="h-full bg-gold-600 transition-all duration-1000 rounded-full"
            style={{ 
              width: `${((steps.findIndex(s => s.isCurrent) + 1) / steps.length) * 100}%` 
            }}
          />
        </div>
      </div>

      {/* Order Details */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold text-black mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faBox} className="text-gold-600 text-sm" />
          Order Items
        </h3>
        
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex gap-4 p-3 bg-[#F4F6F2] rounded-xl hover:bg-gold-50 transition-colors">
              <img
                src={item.image || '/placeholder.jpg'}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="font-medium text-black">{item.name}</p>
                <p className="text-sm text-black/50">x{item.quantity}</p>
                {item.size && <p className="text-xs text-black/40">Size: {item.size}</p>}
                {item.color && <p className="text-xs text-black/40">Color: {item.color}</p>}
              </div>
              <p className="font-bold gold-text">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
          <div className="text-right">
            <p className="text-sm text-black/50">Total</p>
            <p className="text-2xl font-bold gold-text">${order.totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="border-t border-gray-200 mt-6 pt-6">
        <h3 className="font-semibold text-black mb-3 flex items-center gap-2">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gold-600 text-sm" />
          Shipping Address
        </h3>
        <div className="bg-[#F4F6F2] rounded-xl p-4">
          <p className="text-black font-medium">{order.shippingAddress.fullName}</p>
          <p className="text-black/70 text-sm">{order.shippingAddress.address}</p>
          <p className="text-black/70 text-sm">
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
          </p>
          <p className="text-black/70 text-sm">{order.shippingAddress.country}</p>
          <p className="text-black/70 text-sm mt-1">Phone: {order.shippingAddress.phone}</p>
        </div>
      </div>

      {/* Tracking Number */}
      {order.trackingNumber && (
        <div className="border-t border-gray-200 mt-6 pt-6">
          <h3 className="font-semibold text-black mb-2 flex items-center gap-2">
            <FontAwesomeIcon icon={faTruck} className="text-gold-600 text-sm" />
            Tracking Number
          </h3>
          <div className="bg-gold-50 border border-gold-200 rounded-xl p-3 flex items-center justify-between">
            <span className="text-black font-medium">{order.trackingNumber}</span>
            <span className="text-xs text-gold-600 font-medium">Track Package</span>
          </div>
        </div>
      )}

      {/* Order Date */}
      <div className="border-t border-gray-200 mt-6 pt-6 flex items-center gap-2 text-sm text-black/40">
        <FontAwesomeIcon icon={faCalendar} className="text-xs" />
        <span>Order placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</span>
      </div>
    </div>
  )
}

export default OrderTracking
import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrderById } from '../redux/slices/orderSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faArrowLeft, 
  faCheck, 
  faClock, 
  faTruck, 
  faBox, 
  faMapMarkerAlt, 
  faPhone, 
  faEnvelope,
  faShoppingBag,
  faPrint,
  faShareAlt,
  faCopy,
  faCheckCircle,
  faSpinner,
  faShippingFast
} from '@fortawesome/free-solid-svg-icons'
import Loader from '../components/common/Loader'
import ScrollReveal from '../components/common/ScrollReveal'
import { toast } from 'react-toastify'

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
            step === 'processing' ? faSpinner :
            step === 'shipped' ? faShippingFast : faCheckCircle,
      isCompleted: index <= currentIndex,
      isCurrent: index === currentIndex,
      description: step === 'pending' ? 'Order received' :
                    step === 'processing' ? 'Preparing your order' :
                    step === 'shipped' ? 'On the way' :
                    'Delivered successfully'
    }))
  }

  const copyOrderId = () => {
    if (currentOrder?._id) {
      navigator.clipboard.writeText(currentOrder._id)
      toast.success('Order ID copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin w-12 h-12 border-3 border-[#D6F04C] border-t-transparent rounded-full"></div>
          <p className="mt-4 text-sm text-black/50">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!currentOrder) {
    return (
      <section className="relative px-4 sm:px-6 lg:px-10 pt-28 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[2.5rem] bg-[#EDF1EC] p-8 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-black mb-2">Order Not Found</h2>
            <p className="text-black/50 text-sm mb-6">We couldn't find the order you're looking for.</p>
            <Link 
              to="/products" 
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-black-800 transition-all hover:scale-105"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const steps = getStatusSteps()

  return (
    <section className="relative px-4 sm:px-6 lg:px-10 pt-28 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-[2.5rem] bg-[#EDF1EC] p-6 sm:p-8 lg:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.06)] overflow-hidden">

          <ScrollReveal direction="up">
            {/* Back Button */}
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 text-black/40 hover:text-black transition-colors mb-6 text-sm"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Back to Orders
            </Link>

            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-black flex items-center gap-3">
                  <span className="w-1 h-8 bg-[#D6F04C] rounded-full"></span>
                  Order Tracking
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-sm text-black/40">Order ID:</span>
                  <span className="text-sm font-mono font-semibold text-black">
                    #{currentOrder._id?.slice(-8).toUpperCase()}
                  </span>
                  <button
                    onClick={copyOrderId}
                    className="text-xs text-[#D6F04C] hover:text-[#C5E043] transition-colors"
                  >
                    <FontAwesomeIcon icon={faCopy} /> Copy
                  </button>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 ${
                currentOrder.status === 'delivered' ? 'bg-green-100 text-green-600' :
                currentOrder.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  currentOrder.status === 'delivered' ? 'bg-green-500' :
                  currentOrder.status === 'cancelled' ? 'bg-red-500' :
                  'bg-blue-500 animate-pulse'
                }`}></span>
                {currentOrder.status.toUpperCase()}
              </span>
            </div>

            {/* Order Date */}
            <p className="text-xs text-black/30 mb-8">
              Placed on {new Date(currentOrder.createdAt).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>

            {/* Status Timeline */}
            <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
              <div className="relative">
                <div className="flex justify-between">
                  {steps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center flex-1 relative">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                        step.isCompleted 
                          ? 'bg-[#D6F04C] text-black shadow-lg shadow-[#D6F04C]/30' 
                          : 'bg-gray-200 text-gray-400'
                      }`}>
                        <FontAwesomeIcon icon={step.icon} className={`text-lg ${step.isCompleted ? 'text-black' : ''}`} />
                      </div>
                      <p className={`text-xs font-medium mt-3 text-center ${
                        step.isCompleted ? 'text-black' : 'text-gray-400'
                      }`}>
                        {step.label}
                      </p>
                      <p className="text-[10px] text-gray-400 text-center mt-0.5">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
                
                {/* Progress Line */}
                <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 -z-10">
                  <div 
                    className="h-full bg-[#D6F04C] transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${((steps.findIndex(s => s.isCurrent) + 1) / steps.length) * 100}%` 
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Order Details & Shipping */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Items */}
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="font-semibold text-black text-sm mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faShoppingBag} className="text-[#D6F04C]" />
                  Order Items
                </h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {currentOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-[#F4F6F2] rounded-xl hover:bg-gray-200 transition-colors">
                      <img
                        src={item.image || '/placeholder.jpg'}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-black text-sm truncate">{item.name}</p>
                        <div className="flex flex-wrap gap-1 text-xs text-black/50">
                          <span>x{item.quantity}</span>
                          {item.size && <span>• Size: {item.size}</span>}
                          {item.color && <span>• {item.color}</span>}
                        </div>
                      </div>
                      <p className="font-bold text-[#D6F04C] text-sm whitespace-nowrap">
                        ₵{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm text-black/60">Total</span>
                  <span className="text-xl font-bold text-[#D6F04C]">
                    ₵{currentOrder.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="font-semibold text-black text-sm mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#D6F04C]" />
                  Shipping Address
                </h3>
                <div className="space-y-2 text-sm text-black/70">
                  <p className="font-medium text-black">{currentOrder.shippingAddress.fullName}</p>
                  <p>{currentOrder.shippingAddress.address}</p>
                  <p>
                    {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} {currentOrder.shippingAddress.zipCode}
                  </p>
                  <p>{currentOrder.shippingAddress.country}</p>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                    <FontAwesomeIcon icon={faPhone} className="text-[#D6F04C] text-xs" />
                    <span>{currentOrder.shippingAddress.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faEnvelope} className="text-[#D6F04C] text-xs" />
                    <span>{currentOrder.shippingAddress.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faBox} className="text-[#D6F04C] text-xs" />
                    <span className="capitalize">{currentOrder.shippingAddress.deliveryType || 'Delivery'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Number */}
            {currentOrder.trackingNumber && (
              <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="font-semibold text-black text-sm mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faTruck} className="text-[#D6F04C]" />
                  Tracking Number
                </h3>
                <div className="flex items-center gap-3 p-3 bg-[#F4F6F2] rounded-xl">
                  <span className="font-mono font-medium text-sm">{currentOrder.trackingNumber}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(currentOrder.trackingNumber)
                      toast.success('Tracking number copied!')
                    }}
                    className="text-xs text-[#D6F04C] hover:text-[#C5E043] transition-colors"
                  >
                    <FontAwesomeIcon icon={faCopy} /> Copy
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-3 bg-black text-white font-semibold pl-6 pr-2 py-3 rounded-full hover:bg-black-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
              >
                <FontAwesomeIcon icon={faShoppingBag} className="text-sm" />
                Continue Shopping
                <span className="w-8 h-8 rounded-full bg-[#D6F04C] text-black flex items-center justify-center transition-all duration-300 group-hover:rotate-12">
                  <FontAwesomeIcon icon={faArrowLeft} className="text-xs rotate-45" />
                </span>
              </Link>
              
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-gray-200 text-black/50 font-medium hover:bg-white hover:border-[#D6F04C] hover:text-black transition-all duration-300"
              >
                <FontAwesomeIcon icon={faPrint} className="text-sm" />
                Print Details
              </button>

              <button
                onClick={() => {
                  // Share functionality
                  if (navigator.share) {
                    navigator.share({
                      title: 'Order #' + currentOrder._id.slice(-8).toUpperCase(),
                      text: `Check out my order from Inez Collections!\nOrder ID: #${currentOrder._id.slice(-8).toUpperCase()}\nTotal: ₵${currentOrder.totalAmount.toFixed(2)}`,
                      url: window.location.href,
                    })
                  }
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-black/30 hover:text-black hover:bg-white transition-all duration-300"
              >
                <FontAwesomeIcon icon={faShareAlt} className="text-sm" />
                Share
              </button>
            </div>

            {/* Help Section */}
            <div className="mt-6 text-center">
              <p className="text-xs text-black/30">
                Need help with your order? <Link to="/contact" className="text-[#D6F04C] hover:text-[#C5E043] transition-colors font-medium">Contact Support</Link>
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

export default OrderTracking
// OrderPage.jsx
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBox,
  faClock,
  faCheck,
  faTruck,
  faEye,
  faSearch,
  faFilter,
  faTimes,
  faChevronDown,
  faChevronUp,
  faShoppingBag,
  faUser,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons'
import { fetchGuestOrders, cancelOrder } from '../redux/slices/orderSlice'
import Loader from '../components/common/Loader'
import ScrollReveal from '../components/common/ScrollReveal'
import { toast } from 'react-toastify'

const OrderPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { orders, loading } = useSelector((state) => state.orders)
  const { guestId } = useSelector((state) => state.cart)
  
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [cancellingOrder, setCancellingOrder] = useState(null)
  const [guestIdInput, setGuestIdInput] = useState('')
  const [showGuestIdInput, setShowGuestIdInput] = useState(false)

  useEffect(() => {
    // If guestId exists in cart, fetch orders automatically
    if (guestId) {
      dispatch(fetchGuestOrders({ guestId }))
    }
  }, [dispatch, guestId])

  const handleFetchGuestOrders = () => {
    if (!guestIdInput.trim()) {
      toast.error('Please enter your guest ID')
      return
    }
    dispatch(fetchGuestOrders({ guestId: guestIdInput.trim() }))
    setShowGuestIdInput(false)
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-600',
      processing: 'bg-blue-100 text-blue-600',
      shipped: 'bg-purple-100 text-purple-600',
      delivered: 'bg-green-100 text-green-600',
      cancelled: 'bg-red-100 text-red-600',
    }
    return colors[status] || 'bg-gray-100 text-gray-600'
  }

  const getStatusIcon = (status) => {
    const icons = {
      pending: faClock,
      processing: faBox,
      shipped: faTruck,
      delivered: faCheck,
      cancelled: faTimes,
    }
    return icons[status] || faClock
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return
    }

    setCancellingOrder(orderId)
    try {
      await dispatch(cancelOrder({ orderId, guestId: guestId || guestIdInput })).unwrap()
      toast.success('Order cancelled successfully')
      // Refresh orders
      dispatch(fetchGuestOrders({ guestId: guestId || guestIdInput }))
    } catch (error) {
      toast.error(error.message || 'Failed to cancel order')
    } finally {
      setCancellingOrder(null)
    }
  }

  const filteredOrders = orders?.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    const matchesSearch = order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items?.some(item => item.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesStatus && matchesSearch
  })

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ]

  // Loading state
  if (loading) {
    return (
      <section className="relative pt-28 pb-10 px-4 sm:px-6 lg:px-10 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[2.5rem] bg-[#EDF1EC] p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] overflow-hidden">
            <Loader />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative pt-28 pb-10 px-4 sm:px-6 lg:px-10 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-[2.5rem] bg-[#EDF1EC] p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] overflow-hidden">


          {/* Header */}
          <ScrollReveal direction="up">
            <div className="relative text-center mb-10">
              <span className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-black/70 mb-4 shadow-sm">
                My Orders
              </span>
              <h1 className="text-4xl md:text-5xl font-bold leading-[1.05] mb-3">
                Your <span className="text-gold-600">Orders</span>
              </h1>
              <p className="text-black/50 max-w-xl mx-auto text-sm md:text-base">
                Track and manage all your orders in one place
              </p>
            </div>
          </ScrollReveal>

          {/* Guest ID Input - Show if no guestId in cart */}
          {!guestId && !orders?.length && (
            <div className="bg-white rounded-[1.75rem] p-6 mb-5 shadow-sm">
              <div className="text-center">
                <p className="text-black/60 text-sm mb-4">
                  Enter your guest ID to view your orders
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                  <input
                    type="text"
                    placeholder="Enter your guest ID"
                    value={guestIdInput}
                    onChange={(e) => setGuestIdInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-[#F4F6F2] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gold-200 transition-all"
                  />
                  <button
                    onClick={handleFetchGuestOrders}
                    className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-black-800 transition-all"
                  >
                    <FontAwesomeIcon icon={faSearch} />
                    View Orders
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Show guest ID info if available */}
          {guestId && orders?.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 mb-4 text-sm text-black/60 flex items-center justify-between">
              <span>Guest ID: <span className="font-mono font-semibold text-black/80">{guestId}</span></span>
              <button
                onClick={() => {
                  setShowGuestIdInput(!showGuestIdInput)
                  setGuestIdInput('')
                }}
                className="text-gold-600 hover:text-gold-700 text-xs font-medium"
              >
                Change ID
              </button>
            </div>
          )}

          {/* Change Guest ID Input */}
          {showGuestIdInput && (
            <div className="bg-white rounded-[1.75rem] p-4 mb-4 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                <input
                  type="text"
                  placeholder="Enter new guest ID"
                  value={guestIdInput}
                  onChange={(e) => setGuestIdInput(e.target.value)}
                  className="flex-1 px-4 py-2 bg-[#F4F6F2] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gold-200 transition-all"
                />
                <button
                  onClick={handleFetchGuestOrders}
                  className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-black-800 transition-all"
                >
                  <FontAwesomeIcon icon={faSearch} />
                  Fetch Orders
                </button>
              </div>
            </div>
          )}

          {/* Filters and Search - Only show if orders exist */}
          {orders?.length > 0 && (
            <div className="relative bg-white rounded-[1.75rem] p-4 sm:p-6 mb-5 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search orders by ID or product..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F4F6F2] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gold-200 focus:bg-white transition-all border border-transparent focus:border-gold-300"
                    />
                    <FontAwesomeIcon 
                      icon={faSearch} 
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30 text-sm" 
                    />
                  </div>
                </div>

                {/* Filter Dropdown */}
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFilterStatus(option.value)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                        filterStatus === option.value
                          ? 'bg-black text-white'
                          : 'bg-[#F4F6F2] text-black/60 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Orders List */}
          {filteredOrders?.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order, index) => (
                <ScrollReveal key={order._id} direction="up" delay={index * 100}>
                  <div className="bg-white rounded-[1.75rem] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                    {/* Order Header */}
                    <div 
                      className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                      onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center">
                          <FontAwesomeIcon 
                            icon={getStatusIcon(order.status)} 
                            className="text-gold-600 text-lg" 
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-black text-sm">
                            Order #{order._id?.slice(-8).toUpperCase() || 'N/A'}
                          </p>
                          <p className="text-xs text-black/40">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'N/A'}
                        </span>
                        <span className="font-bold gold-text text-sm">
                          ₵{order.totalAmount?.toFixed(2) || '0.00'}
                        </span>
                        <span className="text-xs text-black/40">
                          {order.items?.length || 0} item{order.items?.length > 1 ? 's' : ''}
                        </span>
                        <FontAwesomeIcon 
                          icon={expandedOrder === order._id ? faChevronUp : faChevronDown} 
                          className="text-black/30 text-sm hidden sm:block" 
                        />
                      </div>
                    </div>

                    {/* Order Details - Expanded */}
                    {expandedOrder === order._id && (
                      <div className="border-t border-gray-100 p-4 sm:p-6 bg-gray-50/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Items */}
                          <div>
                            <h4 className="font-semibold text-black text-sm mb-3 flex items-center gap-2">
                              <FontAwesomeIcon icon={faShoppingBag} className="text-gold-600" />
                              Items
                            </h4>
                            <div className="space-y-3">
                              {order.items?.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm">
                                  <img
                                    src={item.image || '/placeholder.jpg'}
                                    alt={item.name}
                                    className="w-14 h-14 object-cover rounded-lg"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-black text-sm truncate">{item.name}</p>
                                    <div className="flex items-center gap-2 text-xs text-black/40">
                                      <span>x{item.quantity}</span>
                                      {item.size && <span>• Size: {item.size}</span>}
                                      {item.color && <span>• {item.color}</span>}
                                    </div>
                                  </div>
                                  <span className="text-sm font-semibold text-black">
                                    ₵{(item.price * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Order Details */}
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold text-black text-sm mb-3 flex items-center gap-2">
                                <FontAwesomeIcon icon={faUser} className="text-gold-600" />
                                Shipping Address
                              </h4>
                              <div className="bg-white rounded-xl p-3 shadow-sm text-sm">
                                <p className="text-black/70">{order.shippingAddress?.fullName || 'N/A'}</p>
                                <p className="text-black/50">{order.shippingAddress?.address || 'N/A'}</p>
                                <p className="text-black/50">
                                  {order.shippingAddress?.city || 'N/A'}, {order.shippingAddress?.state || 'N/A'} {order.shippingAddress?.zipCode || ''}
                                </p>
                                <p className="text-black/50">{order.shippingAddress?.country || 'N/A'}</p>
                                <p className="text-black/50">Phone: {order.shippingAddress?.phone || 'N/A'}</p>
                              </div>
                            </div>

                            {order.trackingNumber && (
                              <div>
                                <h4 className="font-semibold text-black text-sm mb-2 flex items-center gap-2">
                                  <FontAwesomeIcon icon={faTruck} className="text-gold-600" />
                                  Tracking Number
                                </h4>
                                <p className="text-sm text-black/60 bg-white rounded-xl p-2 shadow-sm">
                                  {order.trackingNumber}
                                </p>
                              </div>
                            )}

                            <div className="flex flex-wrap gap-3 pt-2">
                              <Link
                                to={`/order-tracking/${order._id}`}
                                className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-black-800 transition-all"
                              >
                                <FontAwesomeIcon icon={faEye} />
                                Track Order
                              </Link>
                              {order.status === 'pending' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleCancelOrder(order._id)
                                  }}
                                  disabled={cancellingOrder === order._id}
                                  className="inline-flex items-center gap-2 border border-red-300 text-red-500 px-4 py-2 rounded-full text-sm font-medium hover:bg-red-50 transition-all disabled:opacity-50"
                                >
                                  <FontAwesomeIcon icon={faTimes} />
                                  {cancellingOrder === order._id ? 'Cancelling...' : 'Cancel Order'}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : orders?.length === 0 && !loading ? (
            /* Empty State */
            <div className="bg-white rounded-[1.75rem] p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-black mb-2">No Orders Found</h3>
              <p className="text-black/50 text-sm mb-6">
                {searchTerm || filterStatus !== 'all' 
                  ? "No orders match your filters. Try adjusting your search."
                  : guestId 
                    ? "You haven't placed any orders yet. Start shopping!"
                    : "Enter your guest ID above to view your orders."}
              </p>
              {(searchTerm || filterStatus !== 'all') ? (
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setFilterStatus('all')
                  }}
                  className="inline-flex items-center gap-2 bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-black-800 transition-all"
                >
                  <FontAwesomeIcon icon={faFilter} />
                  Clear Filters
                </button>
              ) : (
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-[#D6F04C] text-black px-6 py-2 rounded-full text-sm font-medium hover:brightness-95 transition-all"
                >
                  <FontAwesomeIcon icon={faShoppingBag} />
                  Start Shopping
                </Link>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default OrderPage
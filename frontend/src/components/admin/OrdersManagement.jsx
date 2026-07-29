// AdminOrdersManagement.jsx - Fixed version
import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSearch,
  faChevronDown,
  faChevronUp,
  faRefresh,
  faShoppingBag,
  faClock,
  faTruck,
  faCheckCircle,
  faTimesCircle,
  faDollarSign,
  faWallet,
  faMoneyBillWave,
} from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import api from '../../services/api'

const AdminOrdersManagement = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [updating, setUpdating] = useState(null)
  const [paymentUpdating, setPaymentUpdating] = useState(null)
  const [stats, setStats] = useState({
    totalOrders: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
  })
  const [paymentStats, setPaymentStats] = useState({
    pending: 0,
    completed: 0,
    failed: 0,
  })

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await api.get('/orders/admin/all')
      const ordersData = response.data.orders || []
      setOrders(ordersData)

      // Calculate all stats from orders
      calculateStatsFromOrders(ordersData)

    } catch (error) {
      console.error('Fetch orders error:', error)
      toast.error(error.message || 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  // Calculate all stats from orders array (single source of truth)
  const calculateStatsFromOrders = (ordersData) => {
    if (!ordersData || ordersData.length === 0) {
      setStats({
        totalOrders: 0,
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        totalRevenue: 0,
      })
      setPaymentStats({
        pending: 0,
        completed: 0,
        failed: 0,
      })
      return
    }

    // Order status counts
    const totalOrders = ordersData.length
    const pending = ordersData.filter(o => o.status === 'pending').length
    const processing = ordersData.filter(o => o.status === 'processing').length
    const shipped = ordersData.filter(o => o.status === 'shipped').length
    const delivered = ordersData.filter(o => o.status === 'delivered').length
    const cancelled = ordersData.filter(o => o.status === 'cancelled').length

    // Payment status counts
    const paymentPending = ordersData.filter(o => o.paymentStatus === 'pending').length
    const paymentCompleted = ordersData.filter(o => o.paymentStatus === 'completed').length
    const paymentFailed = ordersData.filter(o => o.paymentStatus === 'failed').length

    // Calculate revenue from completed payments (non-cancelled)
    const totalRevenue = ordersData
      .filter(o => o.paymentStatus === 'completed' && o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0)

    setStats({
      totalOrders,
      pending,
      processing,
      shipped,
      delivered,
      cancelled,
      totalRevenue,
    })

    setPaymentStats({
      pending: paymentPending,
      completed: paymentCompleted,
      failed: paymentFailed,
    })
  }

  const handleStatusChange = async (orderId, newStatus) => {
    if (updating === orderId) return

    setUpdating(orderId)
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus })
      toast.success(`Order status updated to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`)

      // Just fetch orders - stats will be recalculated
      await fetchOrders()

    } catch (error) {
      console.error('Update status error:', error)
      toast.error(error.message || 'Failed to update order status')
    } finally {
      setUpdating(null)
    }
  }

  const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
    if (paymentUpdating === orderId) return

    setPaymentUpdating(orderId)
    try {
      await api.put(`/orders/${orderId}/payment`, {
        paymentStatus: newPaymentStatus
      })

      toast.success(`Payment status updated to ${newPaymentStatus.charAt(0).toUpperCase() + newPaymentStatus.slice(1)}`)

      // Just fetch orders - stats will be recalculated
      await fetchOrders()

    } catch (error) {
      console.error('Update payment status error:', error)
      toast.error(error.message || 'Failed to update payment status')
    } finally {
      setPaymentUpdating(null)
    }
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

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-600',
      completed: 'bg-green-100 text-green-600',
      failed: 'bg-red-100 text-red-600',
    }
    return colors[status] || 'bg-gray-100 text-gray-600'
  }

  const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
  const paymentStatusOptions = ['pending', 'completed', 'failed']

  const filteredOrders = orders.filter(order => {
    if (!order) return false

    const orderId = order.orderNumber || order._id || ''
    const orderIdMatch = orderId.toLowerCase().includes(searchTerm.toLowerCase())

    const fullName = order.shippingAddress?.fullName || ''
    const nameMatch = fullName.toLowerCase().includes(searchTerm.toLowerCase())

    const email = order.shippingAddress?.email || ''
    const emailMatch = email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSearch = orderIdMatch || nameMatch || emailMatch
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const statCards = [
    {
      label: 'Total Orders',
      value: stats.totalOrders || 0,
      icon: faShoppingBag,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      label: 'Revenue',
      value: `₵${(stats.totalRevenue || 0).toFixed(2)}`,
      icon: faDollarSign,
      color: 'bg-gold-50 text-gold-600'
    },
    {
      label: 'Pending',
      value: stats.pending || 0,
      icon: faClock,
      color: 'bg-yellow-50 text-yellow-600'
    },
    {
      label: 'Processing',
      value: stats.processing || 0,
      icon: faTruck,
      color: 'bg-purple-50 text-purple-600'
    },
    {
      label: 'Delivered',
      value: stats.delivered || 0,
      icon: faCheckCircle,
      color: 'bg-green-50 text-green-600'
    },
    {
      label: 'Payment Completed',
      value: paymentStats.completed || 0,
      icon: faMoneyBillWave,
      color: 'bg-emerald-50 text-emerald-600'
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600 mb-4"></div>
          <p className="text-gray-500">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <section className="">
      <div className="">
        <div className=" rounded-[2.5rem] bg-[#EDF1EC] p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="w-1 h-8 bg-[#D6F04C] rounded-full"></span>
              Order Management
            </h2>
            <p className="text-sm text-gray-500 mt-1">Manage and track all customer orders</p>
          </div>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-5">
            {statCards.map((stat, index) => (
              <div
                key={index}
                className="group bg-white rounded-[1.25rem] p-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1.5 border border-gray-50/80 hover:border-gold-200 cursor-default"
              >
                <div className="flex flex-col items-start gap-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                    <FontAwesomeIcon icon={stat.icon} className="text-base" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{stat.label}</p>
                    <p className="text-lg font-bold text-gray-800 leading-tight">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-[1.75rem] p-4 mb-5 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by order ID, customer name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F4F6F2] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gold-200 focus:bg-white transition-all border border-transparent focus:border-gold-300"
                />
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 bg-[#F4F6F2] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gold-200 transition-all border border-transparent focus:border-gold-300"
              >
                <option value="all">All Status</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>

              <button
                onClick={fetchOrders}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-black-800 transition-all hover:scale-105"
              >
                <FontAwesomeIcon icon={faRefresh} className="text-sm" />
                Refresh
              </button>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-[1.75rem] p-12 text-center shadow-sm">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-gray-500 text-lg font-medium">No orders found</p>
                <p className="text-sm text-gray-400 mt-1">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Orders will appear here once customers place them'}
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-[1.75rem] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 border border-gray-50"
                >
                  <div className="p-4 sm:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      {/* Order Info */}
                      <div className="min-w-[140px]">
                        <p className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-gold-600 inline-block"></span>
                          Order #{order.orderNumber || order._id?.slice(-8).toUpperCase() || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600 font-medium">
                          {order.shippingAddress?.fullName || 'Guest User'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          }) : 'N/A'}
                        </p>
                      </div>

                      {/* Status Badges */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {order.status?.toUpperCase() || 'PENDING'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus?.toUpperCase() || 'PENDING'}
                        </span>
                        <span className="text-lg font-bold text-[#D6F04C]">
                          ₵{order.totalAmount?.toFixed(2) || '0.00'}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-gray-400">Status:</span>
                          <select
                            value={order.status || 'pending'}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            disabled={updating === order._id}
                            className="px-2 py-1 border border-gray-200 rounded-full text-xs focus:outline-none focus:border-gold-600 focus:ring-2 focus:ring-gold-200 transition-all disabled:opacity-50 bg-[#F4F6F2]"
                          >
                            {statusOptions.map(status => (
                              <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-gray-400">Payment:</span>
                          <select
                            value={order.paymentStatus || 'pending'}
                            onChange={(e) => handlePaymentStatusChange(order._id, e.target.value)}
                            disabled={paymentUpdating === order._id}
                            className={`px-2 py-1 border rounded-full text-xs focus:outline-none focus:border-gold-600 focus:ring-2 focus:ring-gold-200 transition-all disabled:opacity-50 ${order.paymentStatus === 'completed' ? 'border-green-400 bg-green-50' :
                                order.paymentStatus === 'failed' ? 'border-red-400 bg-red-50' :
                                  'border-gray-200 bg-[#F4F6F2]'
                              }`}
                          >
                            {paymentStatusOptions.map(status => (
                              <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                          className="w-8 h-8 rounded-full bg-[#F4F6F2] flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-500 hover:text-gold-600"
                        >
                          <FontAwesomeIcon
                            icon={expandedOrder === order._id ? faChevronUp : faChevronDown}
                            className="text-xs"
                          />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedOrder === order._id && (
                      <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Order Items */}
                          <div>
                            <h4 className="font-semibold text-gray-800 text-sm mb-2 flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-gold-600"></span>
                              Order Items
                            </h4>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                              {order.items?.map((item, idx) => (
                                <div
                                  key={`${order._id}-item-${idx}`}
                                  className="flex items-center gap-3 p-2 bg-[#F4F6F2] rounded-xl"
                                >
                                  <img
                                    src={item.image || '/placeholder.jpg'}
                                    alt={item.name}
                                    className="w-12 h-12 object-cover rounded-lg"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-800 text-sm truncate">{item.name}</p>
                                    <div className="flex flex-wrap gap-1 text-xs text-gray-500">
                                      <span>x{item.quantity}</span>
                                      {item.size && <span>• {item.size}</span>}
                                      {item.color && <span>• {item.color}</span>}
                                    </div>
                                  </div>
                                  <p className="font-bold text-[#D6F04C] text-sm whitespace-nowrap">
                                    ₵{(item.price * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Order Details */}
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-semibold text-gray-800 text-sm mb-2 flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-gold-600"></span>
                                Shipping Address
                              </h4>
                              <div className="p-3 bg-[#F4F6F2] rounded-xl text-sm text-gray-600">
                                <p className="font-medium text-gray-800">{order.shippingAddress?.fullName || 'N/A'}</p>
                                <p>{order.shippingAddress?.address || 'N/A'}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  <span className="font-medium">Phone:</span> {order.shippingAddress?.phone || 'N/A'}
                                </p>
                                <p className="text-xs text-gray-400">
                                  <span className="font-medium">Delivery:</span> {order.shippingAddress?.deliveryType === 'pickup' ? 'Pickup' : 'Delivery'}
                                </p>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold text-gray-800 text-sm mb-2 flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-gold-600"></span>
                                Payment Info
                              </h4>
                              <div className="p-3 bg-[#F4F6F2] rounded-xl text-sm text-gray-600">
                                <p><span className="font-medium">Method:</span> {order.paymentMethod || 'N/A'}</p>
                                <p className="flex items-center gap-2">
                                  <span className="font-medium">Status:</span>
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                                    {order.paymentStatus?.toUpperCase() || 'PENDING'}
                                  </span>
                                </p>
                              </div>
                            </div>

                            {order.trackingNumber && (
                              <div>
                                <h4 className="font-semibold text-gray-800 text-sm mb-2 flex items-center gap-2">
                                  <span className="w-1 h-1 rounded-full bg-gold-600"></span>
                                  Tracking Number
                                </h4>
                                <p className="p-2 bg-[#F4F6F2] rounded-xl text-sm font-mono text-gray-600">
                                  {order.trackingNumber}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="mt-5 text-center text-xs text-gray-400 bg-white/80 backdrop-blur-sm rounded-full py-2 px-4 inline-block w-auto mx-auto">
            Total Orders: {filteredOrders.length} {filteredOrders.length !== orders.length && `(filtered from ${orders.length})`}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdminOrdersManagement
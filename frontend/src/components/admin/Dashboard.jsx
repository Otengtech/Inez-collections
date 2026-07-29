import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBox,
  faShoppingBag,
  faUsers,
  faEnvelope,
  faBoxOpen,
  faDollarSign,
  faEye,
  faClock,
  faCheckCircle,
  faTimesCircle,
  faArrowRight,
  faRefresh,
} from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import api from '../../services/api'
import ScrollReveal from '../common/ScrollReveal'

const Dashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [orders, setOrders] = useState([])
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
  const [recentOrders, setRecentOrders] = useState([])

  // Fetch orders and stats from backend
  const fetchData = async () => {
    setRefreshing(true)
    try {
      // Fetch all orders
      const ordersResponse = await api.get('/orders/admin/all')
      const ordersData = ordersResponse.data.orders || []
      setOrders(ordersData)
      
      // Calculate stats from orders
      calculateStats(ordersData)
      
      // Get recent orders (last 5)
      setRecentOrders(ordersData.slice(0, 5))
      
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast.error('Failed to fetch dashboard data')
    } finally {
      setRefreshing(false)
      setLoading(false)
    }
  }

  // Calculate all stats from orders data (same logic as AdminDashboard)
  const calculateStats = (ordersData) => {
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

  useEffect(() => {
    fetchData()
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchData, 30000)

    return () => clearInterval(interval)
  }, [])

  // Get status color for badges
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-3 border-[#D6F04C] border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-sm text-black/50">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      label: 'Total Revenue',
      value: `₵${(stats.totalRevenue || 0).toFixed(2)}`,
      icon: faDollarSign,
      color: 'from-green-400 to-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders || 0,
      icon: faShoppingBag,
      color: 'from-blue-400 to-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Pending Orders',
      value: stats.pending || 0,
      icon: faClock,
      color: 'from-yellow-400 to-yellow-600',
      bg: 'bg-yellow-50',
    },
    {
      label: 'Delivered',
      value: stats.delivered || 0,
      icon: faCheckCircle,
      color: 'from-green-400 to-green-600',
      bg: 'bg-green-50',
    },
  ]

  const statusItems = [
    { key: 'pending', label: 'Pending', icon: faClock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { key: 'processing', label: 'Processing', icon: faBoxOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { key: 'shipped', label: 'Shipped', icon: faEye, color: 'text-purple-600', bg: 'bg-purple-50' },
    { key: 'delivered', label: 'Delivered', icon: faCheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { key: 'cancelled', label: 'Cancelled', icon: faTimesCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ]

  const statusMap = {
    pending: stats.pending || 0,
    processing: stats.processing || 0,
    shipped: stats.shipped || 0,
    delivered: stats.delivered || 0,
    cancelled: stats.cancelled || 0,
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-black">Dashboard</h1>
          <p className="text-sm text-black/40 mt-1">Overview of your store performance</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-black/30 bg-white px-4 py-2 rounded-full shadow-sm">
            Last updated: {lastUpdated.toLocaleString()}
          </span>
          <button
            onClick={fetchData}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-[#D6F04C] text-black rounded-full text-sm font-medium hover:bg-[#C5E043] transition-all hover:scale-105 disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faRefresh} className={`text-sm ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <ScrollReveal key={index} direction="up" delay={index * 100}>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-black/50 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold text-black mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                  <FontAwesomeIcon icon={stat.icon} className="text-xl" />
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Distribution */}
        <ScrollReveal direction="up" delay={200}>
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="font-semibold text-lg text-black mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#D6F04C] rounded-full"></span>
              Order Status Distribution
            </h3>
            <div className="space-y-3">
              {statusItems.map((item) => {
                const count = statusMap[item.key] || 0
                const totalOrders = stats.totalOrders || 0
                const percentage = totalOrders > 0 ? (count / totalOrders) * 100 : 0
                return (
                  <div key={item.key} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className={`${item.bg} p-2 rounded-lg group-hover:scale-110 transition-transform`}>
                        <FontAwesomeIcon icon={item.icon} className={item.color} />
                      </div>
                      <span className="text-black/70 text-sm">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#D6F04C] rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-black/70 w-10 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Recent Orders */}
        <ScrollReveal direction="up" delay={250}>
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-black flex items-center gap-2">
                <span className="w-1 h-6 bg-[#D6F04C] rounded-full"></span>
                Recent Orders
              </h3>
              <button
                onClick={() => navigate('/admin/orders')}
                className="text-sm text-[#D6F04C] hover:text-[#C5E043] transition-colors flex items-center gap-1 font-medium"
              >
                View All
                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
              </button>
            </div>
            
            {recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.slice(0, 5).map((order) => {
                  const statusColors = {
                    delivered: 'bg-green-100 text-green-600',
                    pending: 'bg-yellow-100 text-yellow-600',
                    cancelled: 'bg-red-100 text-red-600',
                    processing: 'bg-blue-100 text-blue-600',
                    shipped: 'bg-purple-100 text-purple-600',
                  }
                  return (
                    <div
                      key={order._id}
                      className="flex items-center justify-between p-3 bg-[#F4F6F2] rounded-xl hover:bg-[#EDF1EC] transition-colors cursor-pointer"
                      onClick={() => navigate('/admin/orders')}
                    >
                      <div>
                        <p className="font-medium text-sm text-black">
                          {order.shippingAddress?.fullName || 'Guest'}
                        </p>
                        <p className="text-xs text-black/50">
                          ₵{order.totalAmount?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                          {order.status || 'pending'}
                        </span>
                        <span className="text-xs text-black/40">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">📦</div>
                <p className="text-black/50 text-sm">No recent orders</p>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}

export default Dashboard
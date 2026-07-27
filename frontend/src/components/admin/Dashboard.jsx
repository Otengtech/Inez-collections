import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChartLine,
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
} from '@fortawesome/free-solid-svg-icons'
import { fetchAdminStats } from '../../redux/slices/adminSlice'
import Loader from '../common/Loader'
import ScrollReveal from '../common/ScrollReveal'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { stats, loading } = useSelector((state) => state.admin)

  useEffect(() => {
    dispatch(fetchAdminStats())
  }, [dispatch])

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
      value: `$${stats?.totalRevenue?.toFixed(2) || '0.00'}`,
      icon: faDollarSign,
      color: 'from-green-400 to-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: faShoppingBag,
      color: 'from-blue-400 to-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: faBox,
      color: 'from-purple-400 to-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Subscribers',
      value: stats?.totalSubscribers || 0,
      icon: faUsers,
      color: 'from-pink-400 to-pink-600',
      bg: 'bg-pink-50',
    },
  ]

  const statusStats = stats?.ordersByStatus || {}
  const statusItems = [
    { key: 'pending', label: 'Pending', icon: faClock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { key: 'processing', label: 'Processing', icon: faBoxOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { key: 'shipped', label: 'Shipped', icon: faEye, color: 'text-purple-600', bg: 'bg-purple-50' },
    { key: 'delivered', label: 'Delivered', icon: faCheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { key: 'cancelled', label: 'Cancelled', icon: faTimesCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-black">Dashboard</h1>
          <p className="text-sm text-black/40 mt-1">Overview of your store performance</p>
        </div>
        <span className="text-xs text-black/30 bg-white px-4 py-2 rounded-full shadow-sm">
          Last updated: {new Date().toLocaleDateString()}
        </span>
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
              {statusItems.map((item) => (
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
                        className="h-full gold-gradient rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${stats?.totalOrders > 0 
                            ? ((statusStats[item.key] || 0) / stats.totalOrders) * 100 
                            : 0}%`
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-black/70 w-10 text-right">
                      {statusStats[item.key] || 0}
                    </span>
                  </div>
                </div>
              ))}
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
                onClick={() => setActivePage('orders')}
                className="text-sm text-[#D6F04C] hover:text-[#C5E043] transition-colors flex items-center gap-1 font-medium"
              >
                View All
                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
              </button>
            </div>
            
            {stats?.recentOrders?.length > 0 ? (
              <div className="space-y-3">
                {stats.recentOrders.slice(0, 5).map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-3 bg-[#F4F6F2] rounded-xl hover:bg-[#EDF1EC] transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm text-black">{order.shippingAddress?.fullName || 'Guest'}</p>
                      <p className="text-xs text-black/50">
                        ${order.totalAmount?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {order.status}
                      </span>
                      <span className="text-xs text-black/40">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
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

      {/* Quick Actions */}
      <ScrollReveal direction="up" delay={300}>
        <div className="mt-6 bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <h3 className="font-semibold text-lg text-black mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-[#D6F04C] rounded-full"></span>
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setActivePage('products')}
              className="p-4 bg-[#F4F6F2] rounded-xl hover:bg-[#EDF1EC] transition-all text-center group"
            >
              <div className="w-12 h-12 bg-[#D6F04C]/20 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-[#D6F04C]/30 transition-colors group-hover:scale-110">
                <FontAwesomeIcon icon={faBox} className="text-[#D6F04C] text-xl" />
              </div>
              <p className="text-sm font-medium text-black/70">Add Product</p>
            </button>
            <button
              onClick={() => setActivePage('orders')}
              className="p-4 bg-[#F4F6F2] rounded-xl hover:bg-[#EDF1EC] transition-all text-center group"
            >
              <div className="w-12 h-12 bg-[#D6F04C]/20 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-[#D6F04C]/30 transition-colors group-hover:scale-110">
                <FontAwesomeIcon icon={faShoppingBag} className="text-[#D6F04C] text-xl" />
              </div>
              <p className="text-sm font-medium text-black/70">View Orders</p>
            </button>
            <button
              onClick={() => setActivePage('contacts')}
              className="p-4 bg-[#F4F6F2] rounded-xl hover:bg-[#EDF1EC] transition-all text-center group"
            >
              <div className="w-12 h-12 bg-[#D6F04C]/20 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-[#D6F04C]/30 transition-colors group-hover:scale-110">
                <FontAwesomeIcon icon={faEnvelope} className="text-[#D6F04C] text-xl" />
              </div>
              <p className="text-sm font-medium text-black/70">
                Messages
                {stats?.newContacts > 0 && (
                  <span className="ml-1 text-xs text-red-500 font-bold">
                    ({stats.newContacts})
                  </span>
                )}
              </p>
            </button>
            <button
              onClick={() => setActivePage('subscribers')}
              className="p-4 bg-[#F4F6F2] rounded-xl hover:bg-[#EDF1EC] transition-all text-center group"
            >
              <div className="w-12 h-12 bg-[#D6F04C]/20 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-[#D6F04C]/30 transition-colors group-hover:scale-110">
                <FontAwesomeIcon icon={faUsers} className="text-[#D6F04C] text-xl" />
              </div>
              <p className="text-sm font-medium text-black/70">Newsletter</p>
            </button>
          </div>
        </div>
      </ScrollReveal>
    </div>
  )
}

export default Dashboard
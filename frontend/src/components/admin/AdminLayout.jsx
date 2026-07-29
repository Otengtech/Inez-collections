import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChartLine,
  faBox,
  faShoppingBag,
  faUsers,
  faEnvelope,
  faCog,
  faSignOutAlt,
  faCrown,
  faBars,
  faTimes,
  faBell,
  faUserCircle,
  faChevronDown,
  faCheckCircle,
  faClock,
  faExclamationCircle,
  faCircle,
} from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import api from '../../services/api'

// Import Admin Components
import Dashboard from './Dashboard'
import ProductManagement from './ProductManagement'
import OrdersManagement from './OrdersManagement'
import ContactsManagement from './ContactsManagement'
import SubscribersManagement from './SubscribersManagement'
import Settings from './Settings'

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [admin, setAdmin] = useState(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [activePage, setActivePage] = useState('dashboard')
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [stats, setStats] = useState(null)
  const [processedOrderIds, setProcessedOrderIds] = useState(new Set())
  const navigate = useNavigate()

  // Fetch stats
  useEffect(() => {
    const adminData = localStorage.getItem('adminToken')
    if (adminData) {
      setAdmin(JSON.parse(adminData))
    } else {
      navigate('/admin-login')
    }

    fetchStats()

    const handleResize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    
    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      fetchStats()
    }, 30000)

    return () => {
      window.removeEventListener('resize', handleResize)
      clearInterval(interval)
    }
  }, [navigate])

  // Fetch stats for notification counts
  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats')
      if (response.data.success) {
        setStats(response.data.stats)
        // Update notification counts based on stats
        updateNotificationCounts(response.data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  // Update notification counts based on stats
  const updateNotificationCounts = (statsData) => {
    if (!statsData) return
    
    const newNotifications = []
    const existingIds = new Set(notifications.map(n => n.id))
    
    // Check for new orders (only if not already processed)
    if (statsData.recentOrders && statsData.recentOrders.length > 0) {
      statsData.recentOrders.forEach(order => {
        const notifId = `order-${order._id}`
        // Only add if not already processed and not already in notifications
        if (!processedOrderIds.has(order._id) && !existingIds.has(notifId)) {
          newNotifications.push({
            id: notifId,
            type: 'order',
            title: 'New Order',
            message: `Order #${order._id.slice(-6)} from ${order.shippingAddress?.fullName || 'Guest'}`,
            time: new Date(order.createdAt).toLocaleString(),
            read: false,
            link: 'orders'
          })
          // Mark this order as processed
          setProcessedOrderIds(prev => new Set(prev).add(order._id))
        }
      })
    }

    // Check for new contacts (only add once)
    if (statsData.newContacts && statsData.newContacts > 0) {
      const notifId = `contact-${Date.now()}`
      if (!existingIds.has(notifId)) {
        newNotifications.push({
          id: notifId,
          type: 'contact',
          title: 'New Contact Message',
          message: `You have ${statsData.newContacts} new message(s)`,
          time: new Date().toLocaleString(),
          read: false,
          link: 'contacts'
        })
      }
    }

    // Check for new subscribers (only add once)
    if (statsData.newSubscribers && statsData.newSubscribers > 0) {
      const notifId = `subscriber-${Date.now()}`
      if (!existingIds.has(notifId)) {
        newNotifications.push({
          id: notifId,
          type: 'subscriber',
          title: 'New Subscriber',
          message: `You have ${statsData.newSubscribers} new subscriber(s)`,
          time: new Date().toLocaleString(),
          read: false,
          link: 'subscribers'
        })
      }
    }

    if (newNotifications.length > 0) {
      setNotifications(prev => [...newNotifications, ...prev])
      setUnreadCount(prev => prev + newNotifications.length)
    }
  }

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([])
    setUnreadCount(0)
    setProcessedOrderIds(new Set())
    toast.success('Notifications cleared')
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
    toast.success('All notifications marked as read')
  }

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return { icon: faShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50' }
      case 'contact':
        return { icon: faEnvelope, color: 'text-purple-500', bg: 'bg-purple-50' }
      case 'subscriber':
        return { icon: faUsers, color: 'text-green-500', bg: 'bg-green-50' }
      default:
        return { icon: faExclamationCircle, color: 'text-yellow-500', bg: 'bg-yellow-50' }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    toast.success('Logged out successfully')
    navigate('/admin-login')
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: faChartLine },
    { id: 'products', label: 'Products', icon: faBox },
    { id: 'orders', label: 'Orders', icon: faShoppingBag },
    { id: 'contacts', label: 'Messages', icon: faEnvelope },
    { id: 'subscribers', label: 'Subscribers', icon: faUsers },
    { id: 'settings', label: 'Settings', icon: faCog },
  ]

  // Render the active page component
  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />
      case 'products':
        return <ProductManagement />
      case 'orders':
        return <OrdersManagement />
      case 'contacts':
        return <ContactsManagement />
      case 'subscribers':
        return <SubscribersManagement />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  if (!admin) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-[#F4F6F2]">
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white transform transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 flex flex-col shadow-xl`}
      >
        {/* Brand */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D6F04C] rounded-xl flex items-center justify-center shadow-lg shadow-[#D6F04C]/20">
              <FontAwesomeIcon icon={faCrown} className="text-black text-lg" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-800">Inez Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#D6F04C] to-[#C5E043] flex items-center justify-center text-black font-bold text-sm">
              {admin.fullName?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{admin.fullName}</p>
              <p className="text-xs text-gray-400 truncate">{admin.email || 'admin@inez.com'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activePage === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id)
                  if (isMobile) setIsSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-left ${
                  isActive
                    ? 'bg-[#D6F04C] text-black shadow-lg shadow-[#D6F04C]/20'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#D6F04C]'
                }`}
              >
                <FontAwesomeIcon 
                  icon={item.icon} 
                  className={`text-base ${isActive ? 'text-black' : 'text-gray-400 group-hover:text-[#D6F04C]'}`} 
                />
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-6 bg-black rounded-full"></span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200 group"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="text-base group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${
        isSidebarOpen ? 'lg:ml-72' : 'lg:ml-0'
      } flex flex-col min-h-screen`}>
        
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-100 px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden w-10 h-10 rounded-xl hover:bg-gray-50 flex items-center justify-center transition-colors"
              >
                <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} className="text-gray-600 text-lg" />
              </button>
              
              {/* Breadcrumb */}
              <div className="hidden md:flex items-center gap-2 text-sm">
                <span className="text-gray-400">/</span>
                <span className="text-gray-600 font-medium">
                  {navItems.find(item => item.id === activePage)?.label || 'Dashboard'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notification */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="relative w-10 h-10 rounded-xl hover:bg-gray-50 flex items-center justify-center transition-colors"
                >
                  <FontAwesomeIcon icon={faBell} className="text-gray-500 text-lg" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-96 max-h-[500px] bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
                      <div className="flex items-center gap-2">
                        {notifications.length > 0 && (
                          <>
                            <button
                              onClick={markAllAsRead}
                              className="text-xs text-[#D6F04C] hover:text-[#C5E043] transition-colors font-medium"
                            >
                              Mark all read
                            </button>
                            <span className="w-px h-4 bg-gray-200"></span>
                            <button
                              onClick={clearAllNotifications}
                              className="text-xs text-red-500 hover:text-red-600 transition-colors font-medium"
                            >
                              Clear all
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="overflow-y-auto max-h-[350px]">
                      {notifications.length > 0 ? (
                        notifications.slice(0, 20).map((notif) => {
                          const iconInfo = getNotificationIcon(notif.type)
                          return (
                            <div
                              key={notif.id}
                              className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 ${
                                !notif.read ? 'bg-[#D6F04C]/5' : ''
                              }`}
                              onClick={() => {
                                setNotifications(prev =>
                                  prev.map(n =>
                                    n.id === notif.id ? { ...n, read: true } : n
                                  )
                                )
                                setUnreadCount(prev => Math.max(0, prev - 1))
                                setIsNotificationOpen(false)
                                if (notif.link) {
                                  setActivePage(notif.link)
                                }
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-full ${iconInfo.bg} flex items-center justify-center flex-shrink-0`}>
                                  <FontAwesomeIcon icon={iconInfo.icon} className={iconInfo.color} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <p className="text-sm font-medium text-gray-800">{notif.title}</p>
                                    {!notif.read && (
                                      <FontAwesomeIcon icon={faCircle} className="text-[#D6F04C] text-[6px] flex-shrink-0 mt-1.5" />
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                                  <p className="text-[10px] text-gray-400 mt-1">{notif.time}</p>
                                </div>
                              </div>
                            </div>
                          )
                        })
                      ) : (
                        <div className="text-center py-8">
                          <div className="text-4xl mb-3">🔔</div>
                          <p className="text-sm text-gray-500">No notifications</p>
                          <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#D6F04C] to-[#C5E043] flex items-center justify-center text-black font-bold text-sm">
                    {admin.fullName?.charAt(0) || 'A'}
                  </div>
                  <FontAwesomeIcon icon={faChevronDown} className={`text-gray-400 text-xs transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">{admin.fullName}</p>
                      <p className="text-xs text-gray-400">{admin.email || 'admin@inez.com'}</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false)
                        setActivePage('settings')
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors text-left"
                    >
                      <FontAwesomeIcon icon={faCog} className="text-gray-400" />
                      Settings
                    </button>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false)
                        handleLogout()
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100 mt-2 pt-2"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="text-red-400" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content - Renders based on activePage state */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default AdminLayout
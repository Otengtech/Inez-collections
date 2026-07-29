import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faSearch,
  faTrash,
  faEnvelope,
  faPaperPlane,
  faUserPlus,
  faUserMinus,
  faTimes,
  faSpinner,
  faRefresh,
  faChevronDown,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import api from '../../services/api'
import ScrollReveal from '../common/ScrollReveal'

const SubscribersManagement = () => {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showSendEmail, setShowSendEmail] = useState(false)
  const [expandedMobile, setExpandedMobile] = useState(null)
  const [emailData, setEmailData] = useState({
    subject: '',
    content: '',
  })
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    setLoading(true)
    try {
      const response = await api.get('/newsletter/subscribers')
      console.log('📧 Subscribers response:', response.data)
      
      if (response.data.success) {
        setSubscribers(response.data.subscribers || [])
      } else {
        toast.error(response.data.message || 'Failed to fetch subscribers')
      }
    } catch (error) {
      console.error('❌ Error fetching subscribers:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch subscribers')
    } finally {
      setLoading(false)
    }
  }

  const handleUnsubscribe = async (id, email) => {
    if (window.confirm(`Are you sure you want to unsubscribe ${email}?`)) {
      try {
        const response = await api.post('/newsletter/unsubscribe', { email })
        if (response.data.success) {
          toast.success(`Successfully unsubscribed ${email}`)
          fetchSubscribers()
        } else {
          toast.error(response.data.message || 'Failed to unsubscribe')
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to unsubscribe')
      }
    }
  }

  const handleResubscribe = async (id, email) => {
    try {
      const response = await api.post('/newsletter/subscribe', { email })
      if (response.data.success) {
        toast.success(`Successfully resubscribed ${email}`)
        fetchSubscribers()
      } else {
        toast.error(response.data.message || 'Failed to resubscribe')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resubscribe')
    }
  }

  const handleSendNewsletter = async () => {
    if (!emailData.subject || !emailData.content) {
      toast.error('Please fill in both subject and content')
      return
    }

    setSending(true)
    try {
      const response = await api.post('/newsletter/send', {
        subject: emailData.subject,
        content: emailData.content,
        testEmail: true,
      })
      
      if (response.data.success) {
        toast.success(response.data.message || 'Newsletter sent successfully')
        setShowSendEmail(false)
        setEmailData({ subject: '', content: '' })
      } else {
        toast.error(response.data.message || 'Failed to send newsletter')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send newsletter')
    } finally {
      setSending(false)
    }
  }

  const filteredSubscribers = subscribers.filter(sub =>
    sub.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const activeSubscribers = subscribers.filter(s => s.isActive)
  const inactiveSubscribers = subscribers.filter(s => !s.isActive)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-3 border-[#D6F04C] border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-sm text-black/50">Loading subscribers...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-black">Subscribers</h1>
          <p className="text-xs sm:text-sm text-black/40 mt-1">Manage your newsletter subscribers</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={fetchSubscribers}
            className="inline-flex items-center justify-center gap-2 bg-[#F4F6F2] text-black/70 font-medium px-4 py-2.5 sm:py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 text-sm sm:text-base"
            title="Refresh subscribers"
          >
            <FontAwesomeIcon icon={faRefresh} className="text-xs sm:text-sm" />
            Refresh
          </button>
          <button
            onClick={() => setShowSendEmail(true)}
            className="inline-flex items-center justify-center gap-2 bg-black text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:bg-black-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm sm:text-base w-full sm:w-auto"
          >
            <FontAwesomeIcon icon={faPaperPlane} className="text-xs sm:text-sm" />
            Send Newsletter
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all">
          <p className="text-xs sm:text-sm text-black/50">Total Subscribers</p>
          <p className="text-xl sm:text-2xl font-bold text-black">{subscribers.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all">
          <p className="text-xs sm:text-sm text-black/50">Active</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600">{activeSubscribers.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all">
          <p className="text-xs sm:text-sm text-black/50">Inactive</p>
          <p className="text-xl sm:text-2xl font-bold text-red-600">{inactiveSubscribers.length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FontAwesomeIcon icon={faSearch} className="text-gray-400 text-xs sm:text-sm" />
        </div>
        <input
          type="text"
          placeholder="Search subscribers by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 pl-11 bg-[#F4F6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D6F04C]/40 focus:bg-white transition-all duration-300 text-sm border border-transparent focus:border-[#D6F04C] placeholder:text-black/30"
        />
      </div>

      {/* Subscribers Table - Desktop */}
      <div className="hidden md:block">
        <ScrollReveal direction="up">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100/50">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-[#F4F6F2]">
                  <tr>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-black/50 uppercase tracking-wider">Email</th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-black/50 uppercase tracking-wider">Status</th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-black/50 uppercase tracking-wider">Subscribed</th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-black/50 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredSubscribers.length > 0 ? (
                    filteredSubscribers.map((sub) => (
                      <tr key={sub._id} className="hover:bg-[#F4F6F2]/50 transition-colors">
                        <td className="px-4 lg:px-6 py-4 text-sm text-black break-all">{sub.email}</td>
                        <td className="px-4 lg:px-6 py-4">
                          <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-medium ${
                            sub.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {sub.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-sm text-black/50">
                          {sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <div className="flex items-center gap-2">
                            {sub.isActive ? (
                              <button
                                onClick={() => handleUnsubscribe(sub._id, sub.email)}
                                className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors flex items-center justify-center"
                                title="Unsubscribe"
                              >
                                <FontAwesomeIcon icon={faUserMinus} className="text-xs sm:text-sm" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleResubscribe(sub._id, sub.email)}
                                className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg bg-green-50 text-green-500 hover:bg-green-100 transition-colors flex items-center justify-center"
                                title="Resubscribe"
                              >
                                <FontAwesomeIcon icon={faUserPlus} className="text-xs sm:text-sm" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center">
                        <div className="text-4xl mb-3">📧</div>
                        <p className="text-black/50 text-sm">No subscribers found</p>
                        <button
                          onClick={fetchSubscribers}
                          className="mt-4 text-[#D6F04C] hover:text-[#C5E043] font-medium text-sm transition-colors"
                        >
                          Refresh subscribers →
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Subscribers Cards - Mobile & Tablet */}
      <div className="md:hidden space-y-4">
        {filteredSubscribers.length > 0 ? (
          filteredSubscribers.map((sub) => (
            <div key={sub._id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100/50">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-black truncate">{sub.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        sub.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {sub.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-xs text-black/40">
                        {sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    {sub.isActive ? (
                      <button
                        onClick={() => handleUnsubscribe(sub._id, sub.email)}
                        className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors flex items-center justify-center flex-shrink-0"
                        title="Unsubscribe"
                      >
                        <FontAwesomeIcon icon={faUserMinus} className="text-xs" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleResubscribe(sub._id, sub.email)}
                        className="w-8 h-8 rounded-lg bg-green-50 text-green-500 hover:bg-green-100 transition-colors flex items-center justify-center flex-shrink-0"
                        title="Resubscribe"
                      >
                        <FontAwesomeIcon icon={faUserPlus} className="text-xs" />
                      </button>
                    )}
                    <button
                      onClick={() => setExpandedMobile(expandedMobile === sub._id ? null : sub._id)}
                      className="w-8 h-8 rounded-lg bg-[#F4F6F2] hover:bg-gray-200 transition-colors flex items-center justify-center flex-shrink-0"
                    >
                      <FontAwesomeIcon icon={expandedMobile === sub._id ? faChevronUp : faChevronDown} className="text-xs text-black/50" />
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedMobile === sub._id && (
                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-black/40">Status:</span>
                        <span className={`ml-1 font-medium ${sub.isActive ? 'text-green-600' : 'text-red-600'}`}>
                          {sub.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div>
                        <span className="text-black/40">Subscribed:</span>
                        <span className="ml-1 text-black/70">
                          {sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleString() : 'N/A'}
                        </span>
                      </div>
                      {sub.unsubscribedAt && (
                        <div className="col-span-2">
                          <span className="text-black/40">Unsubscribed:</span>
                          <span className="ml-1 text-black/70">
                            {new Date(sub.unsubscribedAt).toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="col-span-2">
                        <span className="text-black/40">ID:</span>
                        <span className="ml-1 text-black/50 font-mono text-[10px]">{sub._id}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100/50">
            <div className="text-4xl mb-3">📧</div>
            <p className="text-black/50 text-sm">No subscribers found</p>
            <button
              onClick={fetchSubscribers}
              className="mt-4 text-[#D6F04C] hover:text-[#C5E043] font-medium text-sm transition-colors"
            >
              Refresh subscribers →
            </button>
          </div>
        )}
      </div>

      {/* Send Newsletter Modal - Responsive */}
      {showSendEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-black">Send Newsletter</h2>
                <p className="text-xs sm:text-sm text-black/40 mt-0.5 sm:mt-1">Send an email to all active subscribers</p>
              </div>
              <button
                onClick={() => setShowSendEmail(false)}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center flex-shrink-0"
              >
                <FontAwesomeIcon icon={faTimes} className="text-gray-400 text-lg sm:text-xl" />
              </button>
            </div>

            <div className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-black/70 mb-1.5">
                  Subject *
                </label>
                <input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#F4F6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D6F04C]/40 focus:bg-white transition-all duration-300 text-sm border border-transparent focus:border-[#D6F04C] placeholder:text-black/30"
                  placeholder="Newsletter subject"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-black/70 mb-1.5">
                  Content * (HTML supported)
                </label>
                <textarea
                  value={emailData.content}
                  onChange={(e) => setEmailData({ ...emailData, content: e.target.value })}
                  rows="8 sm:rows-10"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#F4F6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D6F04C]/40 focus:bg-white transition-all duration-300 text-sm border border-transparent focus:border-[#D6F04C] placeholder:text-black/30 font-mono"
                  placeholder="Enter your newsletter content with HTML tags..."
                />
                <p className="text-[10px] sm:text-xs text-black/40 mt-1">
                  HTML supported: &lt;p&gt;, &lt;h1&gt;, &lt;strong&gt;, &lt;ul&gt;, etc.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-amber-800 font-medium">⚠️ Important</p>
                <p className="text-xs sm:text-sm text-amber-700 mt-1">
                  This will send to all <strong>{activeSubscribers.length}</strong> active subscribers.
                </p>
                <p className="text-[10px] sm:text-xs text-amber-600 mt-1">
                  In development mode, emails will be logged to console.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-3 sm:pt-4 border-t border-gray-100">
                <button
                  onClick={handleSendNewsletter}
                  disabled={sending}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-black text-white font-semibold px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl hover:bg-black-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 text-sm sm:text-base"
                >
                  {sending ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs sm:text-sm" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faPaperPlane} className="text-xs sm:text-sm" />
                      Send Newsletter
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowSendEmail(false)}
                  className="px-4 sm:px-6 py-3 sm:py-3.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-xs sm:text-sm font-medium text-black/60"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SubscribersManagement
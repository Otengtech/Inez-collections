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
  faUsers,
  faUserCheck,
  faUserSlash,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import api from '../../services/api'
import ScrollReveal from '../common/ScrollReveal'

const SubscribersManagement = () => {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showSendEmail, setShowSendEmail] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedSubscriber, setSelectedSubscriber] = useState(null)
  const [selectedSubscribers, setSelectedSubscribers] = useState([])
  const [expandedMobile, setExpandedMobile] = useState(null)
  const [emailData, setEmailData] = useState({
    subject: '',
    content: '',
  })
  const [sending, setSending] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [selectAll, setSelectAll] = useState(false)

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    setLoading(true)
    try {
      const response = await api.get('/newsletter/subscribers')
      
      if (response.data.success) {
        setSubscribers(response.data.subscribers || [])
        setSelectedSubscribers([])
        setSelectAll(false)
      } else {
        toast.error(response.data.message || 'Failed to fetch subscribers')
      }
    } catch (error) {
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

  const handleDeleteSubscriber = async (id, email) => {
    if (window.confirm(`Are you sure you want to permanently delete ${email}?`)) {
      setDeleting(true)
      try {
        const response = await api.delete(`/newsletter/${id}`)
        if (response.data.success) {
          toast.success(`Successfully deleted ${email}`)
          fetchSubscribers()
        } else {
          toast.error(response.data.message || 'Failed to delete subscriber')
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete subscriber')
      } finally {
        setDeleting(false)
      }
    }
  }

  const handleBulkDelete = async () => {
    if (selectedSubscribers.length === 0) {
      toast.error('Please select subscribers to delete')
      return
    }

    if (window.confirm(`Are you sure you want to delete ${selectedSubscribers.length} subscriber(s)?`)) {
      setDeleting(true)
      try {
        const response = await api.delete('/newsletter/bulk-delete', {
          data: { subscriberIds: selectedSubscribers }
        })
        if (response.data.success) {
          toast.success(response.data.message || 'Subscribers deleted successfully')
          setSelectedSubscribers([])
          setSelectAll(false)
          fetchSubscribers()
        } else {
          toast.error(response.data.message || 'Failed to delete subscribers')
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete subscribers')
      } finally {
        setDeleting(false)
        setShowDeleteModal(false)
      }
    }
  }

  const handleDeleteInactive = async () => {
    if (window.confirm('Are you sure you want to delete all inactive subscribers?')) {
      setDeleting(true)
      try {
        const response = await api.delete('/newsletter/delete-inactive')
        if (response.data.success) {
          toast.success(response.data.message || 'Inactive subscribers deleted')
          fetchSubscribers()
        } else {
          toast.error(response.data.message || 'Failed to delete inactive subscribers')
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete inactive subscribers')
      } finally {
        setDeleting(false)
      }
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

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedSubscribers([])
    } else {
      const ids = filteredSubscribers.map(sub => sub._id)
      setSelectedSubscribers(ids)
    }
    setSelectAll(!selectAll)
  }

  const handleSelectOne = (id) => {
    if (selectedSubscribers.includes(id)) {
      setSelectedSubscribers(selectedSubscribers.filter(s => s !== id))
    } else {
      setSelectedSubscribers([...selectedSubscribers, id])
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
          <div className="inline-block w-12 h-12 border-4 border-[#D6F04C] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Loading subscribers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#EDF1EC] min-h-screen p-4 sm:p-6 lg:p-8 rounded-[40px]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-black tracking-tight">
              Subscribers
            </h1>
            <p className="text-gray-500 mt-1">Manage your newsletter subscribers</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={fetchSubscribers}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl hover:bg-gray-50 transition-all text-sm font-medium text-gray-700 shadow-sm"
            >
              <FontAwesomeIcon icon={faRefresh} className="text-xs" />
              Refresh
            </button>
            <button
              onClick={() => setShowSendEmail(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-[#D6F04C] rounded-xl hover:bg-gray-800 transition-all text-sm font-semibold shadow-lg"
            >
              <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
              Send Newsletter
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D6F04C]/20 flex items-center justify-center">
                <FontAwesomeIcon icon={faUsers} className="text-[#D6F04C] text-sm" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Total</p>
                <p className="text-2xl font-bold text-black">{subscribers.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faUserCheck} className="text-green-600 text-sm" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Active</p>
                <p className="text-2xl font-bold text-green-600">{activeSubscribers.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faUserSlash} className="text-red-600 text-sm" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Inactive</p>
                <p className="text-2xl font-bold text-red-600">{inactiveSubscribers.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faTrash} className="text-gray-600 text-sm" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Actions</p>
                <button
                  onClick={handleDeleteInactive}
                  className="text-xs text-red-600 hover:text-red-700 font-medium"
                >
                  Delete Inactive
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Bulk Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400 text-sm" />
            </div>
            <input
              type="text"
              placeholder="Search subscribers by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-11 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D6F04C]/40 focus:border-[#D6F04C] transition-all text-sm border border-gray-100 placeholder:text-gray-400 shadow-sm"
            />
          </div>
          {selectedSubscribers.length > 0 && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-2 px-5 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all text-sm font-semibold shadow-lg"
            >
              <FontAwesomeIcon icon={faTrash} />
              Delete Selected ({selectedSubscribers.length})
            </button>
          )}
        </div>

        {/* Subscribers Table - Desktop */}
        <div className="hidden md:block">
          <ScrollReveal direction="up">
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F4F6F2]">
                    <tr>
                      <th className="px-4 py-4 w-12">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          className="w-4 h-4 rounded border-gray-300 text-[#D6F04C] focus:ring-[#D6F04C]"
                        />
                      </th>
                      <th className="px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subscribed</th>
                      <th className="px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredSubscribers.length > 0 ? (
                      filteredSubscribers.map((sub) => (
                        <tr key={sub._id} className="hover:bg-[#F4F6F2]/50 transition-colors">
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              checked={selectedSubscribers.includes(sub._id)}
                              onChange={() => handleSelectOne(sub._id)}
                              className="w-4 h-4 rounded border-gray-300 text-[#D6F04C] focus:ring-[#D6F04C]"
                            />
                          </td>
                          <td className="px-4 py-4 text-sm text-black">{sub.email}</td>
                          <td className="px-4 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              sub.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}>
                              {sub.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              {sub.isActive ? (
                                <button
                                  onClick={() => handleUnsubscribe(sub._id, sub.email)}
                                  className="w-9 h-9 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors flex items-center justify-center"
                                  title="Unsubscribe"
                                >
                                  <FontAwesomeIcon icon={faUserMinus} className="text-sm" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleResubscribe(sub._id, sub.email)}
                                  className="w-9 h-9 rounded-xl bg-green-50 text-green-500 hover:bg-green-100 transition-colors flex items-center justify-center"
                                  title="Resubscribe"
                                >
                                  <FontAwesomeIcon icon={faUserPlus} className="text-sm" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteSubscriber(sub._id, sub.email)}
                                className="w-9 h-9 rounded-xl bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center"
                                title="Delete"
                              >
                                <FontAwesomeIcon icon={faTrash} className="text-sm" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-16 text-center">
                          <div className="text-5xl mb-4">📧</div>
                          <p className="text-gray-500 text-sm">No subscribers found</p>
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
              <div key={sub._id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedSubscribers.includes(sub._id)}
                          onChange={() => handleSelectOne(sub._id)}
                          className="w-4 h-4 rounded border-gray-300 text-[#D6F04C] focus:ring-[#D6F04C] flex-shrink-0"
                        />
                        <p className="font-medium text-sm text-black truncate">{sub.email}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1 ml-6">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          sub.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {sub.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-xs text-gray-400">
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
                        onClick={() => handleDeleteSubscriber(sub._id, sub.email)}
                        className="w-8 h-8 rounded-lg bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center flex-shrink-0"
                        title="Delete"
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-xs" />
                      </button>
                      <button
                        onClick={() => setExpandedMobile(expandedMobile === sub._id ? null : sub._id)}
                        className="w-8 h-8 rounded-lg bg-[#F4F6F2] hover:bg-gray-200 transition-colors flex items-center justify-center flex-shrink-0"
                      >
                        <FontAwesomeIcon icon={expandedMobile === sub._id ? faChevronUp : faChevronDown} className="text-xs text-gray-500" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedMobile === sub._id && (
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-2 ml-6">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-400">Status:</span>
                          <span className={`ml-1 font-medium ${sub.isActive ? 'text-green-600' : 'text-red-600'}`}>
                            {sub.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Subscribed:</span>
                          <span className="ml-1 text-gray-700">
                            {sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleString() : 'N/A'}
                          </span>
                        </div>
                        {sub.unsubscribedAt && (
                          <div className="col-span-2">
                            <span className="text-gray-400">Unsubscribed:</span>
                            <span className="ml-1 text-gray-700">
                              {new Date(sub.unsubscribedAt).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
              <div className="text-5xl mb-4">📧</div>
              <p className="text-gray-500 text-sm">No subscribers found</p>
              <button
                onClick={fetchSubscribers}
                className="mt-4 text-[#D6F04C] hover:text-[#C5E043] font-medium text-sm transition-colors"
              >
                Refresh subscribers →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Send Newsletter Modal */}
      {showSendEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[#EDF1EC] rounded-[40px] p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-white rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-black">Send Newsletter</h2>
                  <p className="text-sm text-gray-500 mt-1">Send an email to all active subscribers</p>
                </div>
                <button
                  onClick={() => setShowSendEmail(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-gray-600" />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={emailData.subject}
                    onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D6F04C] focus:ring-2 focus:ring-[#D6F04C]/20 transition-all text-sm placeholder:text-gray-400"
                    placeholder="Newsletter subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Content * (HTML supported)
                  </label>
                  <textarea
                    value={emailData.content}
                    onChange={(e) => setEmailData({ ...emailData, content: e.target.value })}
                    rows="8"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D6F04C] focus:ring-2 focus:ring-[#D6F04C]/20 transition-all text-sm font-mono placeholder:text-gray-400"
                    placeholder="Enter your newsletter content with HTML tags..."
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    HTML supported: &lt;p&gt;, &lt;h1&gt;, &lt;strong&gt;, &lt;ul&gt;, etc.
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-sm text-amber-800 font-medium">⚠️ Important</p>
                  <p className="text-sm text-amber-700 mt-1">
                    This will send to <strong>{activeSubscribers.length}</strong> active subscribers.
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    In development mode, emails will be logged to console.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={handleSendNewsletter}
                    disabled={sending}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-black text-[#D6F04C] font-semibold px-6 py-3 rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 text-sm"
                  >
                    {sending ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faPaperPlane} />
                        Send Newsletter
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowSendEmail(false)}
                    className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Delete Subscribers</h3>
              <p className="text-gray-600 text-sm mb-6">
                Are you sure you want to delete <strong>{selectedSubscribers.length}</strong> subscriber(s)? This action cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleBulkDelete}
                  disabled={deleting}
                  className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-semibold text-sm disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    'Yes, Delete'
                  )}
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-semibold text-sm"
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
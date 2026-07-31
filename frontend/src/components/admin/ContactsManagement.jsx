import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faSearch,
  faEye,
  faReply,
  faCheck,
  faTimes,
  faEnvelope,
  faUser,
  faCalendar,
  faClock,
  faPaperPlane,
  faTrash,
  faExclamationTriangle,
  faInbox,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import api from '../../services/api'

const ContactsManagement = () => {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedContact, setSelectedContact] = useState(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [sendingReply, setSendingReply] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [contactToDelete, setContactToDelete] = useState(null)
  const [selectedContacts, setSelectedContacts] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    setLoading(true)
    try {
      const response = await api.get('/contact')
      setContacts(response.data.contacts || [])
      setSelectedContacts([])
      setSelectAll(false)
    } catch (error) {
      toast.error('Failed to fetch contacts')
    } finally {
      setLoading(false)
    }
  }

  const handleViewContact = async (contact) => {
    setSelectedContact(contact)
    if (contact.status === 'new') {
      try {
        await api.put(`/contact/${contact._id}/status`, { status: 'read' })
        fetchContacts()
      } catch (error) {
        console.error('Failed to mark as read')
      }
    }
  }

  const handleReply = async () => {
    if (!replyMessage.trim()) {
      toast.error('Please enter a reply message')
      return
    }

    setSendingReply(true)
    try {
      console.log('Sending reply for contact:', selectedContact._id)
      console.log('Reply message:', replyMessage)
      
      const response = await api.post(`/contact/${selectedContact._id}/reply`, { 
        replyMessage: replyMessage 
      })
      
      console.log('Response:', response.data)
      toast.success('Reply sent successfully')
      setReplyMessage('')
      setSelectedContact(null)
      fetchContacts()
    } catch (error) {
      console.error('Full error:', error)
      console.error('Error response:', error.response)
      console.error('Error data:', error.response?.data)
      toast.error(error.response?.data?.message || 'Failed to send reply')
    } finally {
      setSendingReply(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/contact/${id}/status`, { status })
      toast.success('Status updated')
      fetchContacts()
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const handleDeleteContact = async (id) => {
    setDeleting(true)
    try {
      const response = await api.delete(`/contact/${id}`)
      if (response.data.success) {
        toast.success('Contact message deleted successfully')
        setShowDeleteModal(false)
        setContactToDelete(null)
        fetchContacts()
      } else {
        toast.error(response.data.message || 'Failed to delete contact')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete contact')
    } finally {
      setDeleting(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedContacts.length === 0) {
      toast.error('Please select contacts to delete')
      return
    }

    setDeleting(true)
    try {
      const response = await api.delete('/contact/bulk-delete', {
        data: { contactIds: selectedContacts }
      })
      if (response.data.success) {
        toast.success(response.data.message || 'Contacts deleted successfully')
        setSelectedContacts([])
        setSelectAll(false)
        setShowBulkDeleteModal(false)
        fetchContacts()
      } else {
        toast.error(response.data.message || 'Failed to delete contacts')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete contacts')
    } finally {
      setDeleting(false)
    }
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedContacts([])
    } else {
      const ids = filteredContacts.map(contact => contact._id)
      setSelectedContacts(ids)
    }
    setSelectAll(!selectAll)
  }

  const handleSelectOne = (id) => {
    if (selectedContacts.includes(id)) {
      setSelectedContacts(selectedContacts.filter(s => s !== id))
    } else {
      setSelectedContacts([...selectedContacts, id])
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-[#D6F04C] text-black',
      read: 'bg-blue-100 text-blue-700',
      replied: 'bg-green-100 text-green-700',
      resolved: 'bg-gray-100 text-gray-600',
    }
    return colors[status] || 'bg-gray-100 text-gray-600'
  }

  const getStatusIcon = (status) => {
    const icons = {
      new: '🔴',
      read: '👁️',
      replied: '✅',
      resolved: '✓',
    }
    return icons[status] || '📌'
  }

  const filteredContacts = contacts.filter(contact =>
    contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#D6F04C] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#EDF1EC] min-h-screen p-4 sm:p-6 lg:p-8 rounded-[40px]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-black tracking-tight">
              Contact Messages
            </h1>
            <p className="text-gray-500 mt-1">Manage customer inquiries and support requests</p>
          </div>
          <div className="flex items-center gap-3">
            {selectedContacts.length > 0 && (
              <button
                onClick={() => setShowBulkDeleteModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all text-sm font-semibold shadow-lg"
              >
                <FontAwesomeIcon icon={faTrash} />
                Delete Selected ({selectedContacts.length})
              </button>
            )}
            <div className="flex items-center gap-4 bg-white rounded-full px-4 py-2 shadow-sm">
              <span className="text-sm font-medium text-gray-600">Unread</span>
              <span className="bg-[#D6F04C] text-black font-bold px-4 py-1 rounded-full text-sm">
                {contacts.filter(c => c.status === 'new').length}
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-1">
          <div className="relative">
            <FontAwesomeIcon 
              icon={faSearch} 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" 
            />
            <input
              type="text"
              placeholder="Search messages by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-transparent rounded-xl focus:outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Contacts Grid */}
        <div className="grid gap-3">
          {filteredContacts.map((contact) => (
            <div
              key={contact._id}
              className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:border-[#D6F04C]/30"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0" onClick={() => handleViewContact(contact)}>
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-[#D6F04C] flex items-center justify-center text-black font-bold text-lg flex-shrink-0">
                    {contact.name?.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-800 truncate">{contact.name}</p>
                      {contact.status === 'new' && (
                        <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{contact.subject}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-400">{contact.email}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <FontAwesomeIcon icon={faClock} className="text-[10px]" />
                        {formatDate(contact.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(contact.status)}`}>
                    <span>{getStatusIcon(contact.status)}</span>
                    {contact.status.toUpperCase()}
                  </span>
                  <button
                    onClick={() => handleViewContact(contact)}
                    className="text-gray-400 hover:text-[#D6F04C] transition-colors p-2 hover:bg-gray-50 rounded-full"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setContactToDelete(contact)
                      setShowDeleteModal(true)
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                    title="Delete"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 font-medium">No messages found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search terms</p>
          </div>
        )}
      </div>

      {/* View/Reply Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[#EDF1EC] rounded-[40px] p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-white rounded-3xl p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-black">Message Details</h2>
                  <p className="text-sm text-gray-500 mt-1">Review and respond to customer inquiry</p>
                </div>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center text-gray-600 hover:text-black"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              {/* Message Content */}
              <div className="space-y-5">
                {/* Customer Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">From</p>
                    <p className="font-semibold text-gray-800 mt-1">{selectedContact.name}</p>
                    <p className="text-sm text-gray-600">{selectedContact.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Status</p>
                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 w-fit ${getStatusColor(selectedContact.status)}`}>
                      <span>{getStatusIcon(selectedContact.status)}</span>
                      {selectedContact.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Subject */}
                <div className="p-4 bg-white border border-gray-100 rounded-2xl">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Subject</p>
                  <p className="font-semibold text-gray-800 mt-1">{selectedContact.subject}</p>
                </div>

                {/* Message */}
                <div className="p-4 bg-white border border-gray-100 rounded-2xl">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Message</p>
                  <div className="mt-2 p-4 bg-gray-50 rounded-xl whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {selectedContact.message}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                  {selectedContact.status !== 'resolved' && (
                    <button
                      onClick={() => handleStatusChange(selectedContact._id, 'resolved')}
                      className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors flex items-center gap-2 font-medium text-sm"
                    >
                      <FontAwesomeIcon icon={faCheck} />
                      Mark Resolved
                    </button>
                  )}
                  {selectedContact.status !== 'replied' && selectedContact.status !== 'resolved' && (
                    <button
                      onClick={() => document.getElementById('reply-textarea')?.focus()}
                      className="px-5 py-2.5 bg-[#D6F04C] hover:bg-[#c8e044] text-black rounded-xl transition-colors flex items-center gap-2 font-medium text-sm"
                    >
                      <FontAwesomeIcon icon={faReply} />
                      Reply to Customer
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedContact(null)
                      setContactToDelete(selectedContact)
                      setShowDeleteModal(true)
                    }}
                    className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors flex items-center gap-2 font-medium text-sm"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    Delete
                  </button>
                </div>

                {/* Reply Section */}
                {selectedContact.status !== 'resolved' && selectedContact.status !== 'replied' && (
                  <div className="border-t border-gray-200 pt-5 mt-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FontAwesomeIcon icon={faPaperPlane} className="mr-2 text-[#D6F04C]" />
                      Reply Message
                    </label>
                    <textarea
                      id="reply-textarea"
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      rows="4"
                      placeholder="Type your reply here..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D6F04C] focus:ring-2 focus:ring-[#D6F04C]/20 transition-all resize-none text-gray-700 placeholder-gray-400"
                    />
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-400">
                        {replyMessage.length > 0 ? `${replyMessage.length} characters` : 'Write your response'}
                      </span>
                      <button
                        onClick={handleReply}
                        disabled={sendingReply || !replyMessage.trim()}
                        className="px-6 py-2.5 bg-black hover:bg-gray-800 text-[#D6F04C] rounded-xl transition-colors flex items-center gap-2 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FontAwesomeIcon icon={faEnvelope} />
                        {sendingReply ? 'Sending...' : 'Send Reply'}
                      </button>
                    </div>
                  </div>
                )}

                {selectedContact.status === 'replied' && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                    <p className="text-green-700 font-medium">✅ Reply sent to customer</p>
                    <p className="text-sm text-green-600 mt-1">This message has been responded to</p>
                  </div>
                )}

                {selectedContact.status === 'resolved' && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                    <p className="text-gray-700 font-medium">✓ Issue resolved</p>
                    <p className="text-sm text-gray-500 mt-1">This message has been marked as resolved</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && contactToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Delete Message</h3>
              <p className="text-gray-600 text-sm mb-2">
                Are you sure you want to delete this message from <strong>{contactToDelete.name}</strong>?
              </p>
              <p className="text-gray-500 text-xs mb-6">
                Subject: {contactToDelete.subject}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleDeleteContact(contactToDelete._id)}
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
                  onClick={() => {
                    setShowDeleteModal(false)
                    setContactToDelete(null)
                  }}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-semibold text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Delete Multiple Messages</h3>
              <p className="text-gray-600 text-sm mb-6">
                Are you sure you want to delete <strong>{selectedContacts.length}</strong> message(s)? This action cannot be undone.
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
                    'Yes, Delete All'
                  )}
                </button>
                <button
                  onClick={() => setShowBulkDeleteModal(false)}
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

export default ContactsManagement
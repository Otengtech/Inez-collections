import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faSearch,
  faEye,
  faReply,
  faCheck,
  faTimes,
  faEnvelope,
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

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const response = await api.get('/contact')
      setContacts(response.data.contacts || [])
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
      await api.post(`/contact/${selectedContact._id}/reply`, { 
        replyMessage: replyMessage 
      })
      toast.success('Reply sent successfully')
      setReplyMessage('')
      setSelectedContact(null)
      fetchContacts()
    } catch (error) {
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

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-red-100 text-red-600',
      read: 'bg-blue-100 text-blue-600',
      replied: 'bg-green-100 text-green-600',
      resolved: 'bg-gray-100 text-gray-600',
    }
    return colors[status] || 'bg-gray-100 text-gray-600'
  }

  const filteredContacts = contacts.filter(contact =>
    contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div className="text-center py-12">Loading messages...</div>
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Contact Messages</h1>
        <span className="text-sm text-black-500">
          {contacts.filter(c => c.status === 'new').length} unread
        </span>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search messages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-gold-600"
        />
        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* Contacts List */}
      <div className="space-y-3">
        {filteredContacts.map((contact) => (
          <div
            key={contact._id}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
            onClick={() => handleViewContact(contact)}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 gold-gradient rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {contact.name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{contact.name}</p>
                  <p className="text-sm text-black-500 truncate">{contact.subject}</p>
                  <p className="text-xs text-black-400">{contact.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(contact.status)}`}>
                  {contact.status.toUpperCase()}
                </span>
                <span className="text-xs text-black-400">
                  {new Date(contact.createdAt).toLocaleDateString()}
                </span>
                <FontAwesomeIcon icon={faEye} className="text-gray-400" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12 text-black-500">
          No messages found
        </div>
      )}

      {/* View/Reply Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Message Details</h2>
              <button
                onClick={() => setSelectedContact(null)}
                className="text-gray-400 hover:text-black transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="text-2xl" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-black-500">From</p>
                  <p className="font-semibold">{selectedContact.name}</p>
                  <p className="text-sm text-black-600">{selectedContact.email}</p>
                </div>
                <div>
                  <p className="text-sm text-black-500">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedContact.status)}`}>
                    {selectedContact.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-black-500">Subject</p>
                <p className="font-semibold">{selectedContact.subject}</p>
              </div>

              <div>
                <p className="text-sm text-black-500">Message</p>
                <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
                  {selectedContact.message}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleStatusChange(selectedContact._id, 'resolved')}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faCheck} />
                  Mark Resolved
                </button>
                {selectedContact.status !== 'replied' && (
                  <button
                    onClick={() => setReplyMessage('')}
                    className="px-4 py-2 btn-gold flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faReply} />
                    Reply
                  </button>
                )}
              </div>

              {/* Reply Section */}
              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-medium text-black-700 mb-2">
                  Reply Message
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows="4"
                  placeholder="Type your reply here..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold-600"
                />
                <button
                  onClick={handleReply}
                  disabled={sendingReply || !replyMessage.trim()}
                  className="mt-2 btn-gold py-2 px-6 flex items-center gap-2 disabled:opacity-50"
                >
                  <FontAwesomeIcon icon={faEnvelope} />
                  {sendingReply ? 'Sending...' : 'Send Reply'}
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
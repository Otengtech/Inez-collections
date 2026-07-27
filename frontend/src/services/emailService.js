import api from './api'

// Send contact form
export const sendContactForm = async (formData) => {
  const response = await api.post('/contact', formData)
  return response.data
}

// Subscribe to newsletter
export const subscribeNewsletter = async (email) => {
  const response = await api.post('/newsletter/subscribe', { email })
  return response.data
}

// Unsubscribe from newsletter
export const unsubscribeNewsletter = async (email) => {
  const response = await api.post('/newsletter/unsubscribe', { email })
  return response.data
}

// Send test email (admin only)
export const sendTestEmail = async (emailData) => {
  const response = await api.post('/test-email', emailData)
  return response.data
}

// Send bulk newsletter (admin only)
export const sendBulkNewsletter = async (newsletterData) => {
  const response = await api.post('/newsletter/send', newsletterData)
  return response.data
}

export default {
  sendContactForm,
  subscribeNewsletter,
  unsubscribeNewsletter,
  sendTestEmail,
  sendBulkNewsletter,
}
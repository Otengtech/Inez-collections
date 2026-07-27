export const CATEGORIES = [
  { value: 'dresses', label: 'Dresses', icon: 'faDress' },
  { value: 'wigs', label: 'Wigs', icon: 'faCrown' },
  { value: 'lip-gloss', label: 'Lip Gloss', icon: 'faLipstick' },
  { value: 'sandals', label: 'Sandals', icon: 'faShoePrints' },
  { value: 'slippers', label: 'Slippers', icon: 'faSocks' },
]

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', '35', '36', '37', '38', '39', '40', '41', '42']

export const COLORS = ['Black', 'White', 'Gold', 'Pink', 'Red', 'Blue', 'Brown', 'Blonde']

export const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest' },
  { value: 'createdAt', label: 'Oldest' },
  { value: '-price', label: 'Price: High to Low' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-rating', label: 'Highest Rated' },
]

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
}

export const PAYMENT_METHODS = ['card', 'paypal', 'cash']

export const COUNTRIES = ['USA', 'Canada', 'UK', 'Nigeria', 'Other']

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'
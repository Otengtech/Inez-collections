import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'
import { toast } from 'react-toastify'

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const cart = localStorage.getItem('cart')
    return cart ? JSON.parse(cart) : { items: [], guestId: null }
  } catch {
    return { items: [], guestId: null }
  }
}

// Save cart to localStorage
const saveCartToStorage = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart))
}

// Generate guest ID
const generateGuestId = () => {
  return 'guest_' + Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (guestId) => {
    const response = await api.get(`/cart/${guestId}`)
    return response.data
  }
)

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ guestId, productId, quantity, size, color }) => {
    const response = await api.post('/cart', { guestId, productId, quantity, size, color })
    return response.data
  }
)

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ guestId, productId, quantity, size, color }) => {
    const response = await api.put(`/cart/${productId}`, { guestId, productId, quantity, size, color })
    return response.data
  }
)

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ guestId, productId, size, color }) => {
    const response = await api.delete(`/cart/${productId}?guestId=${guestId}&productId=${productId}&size=${size || ''}&color=${color || ''}`)
    return response.data
  }
)

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (guestId) => {
    const response = await api.delete(`/cart/clear/${guestId}`)
    return response.data
  }
)

export const syncCart = createAsyncThunk(
  'cart/syncCart',
  async ({ guestId, items }) => {
    const response = await api.post('/cart/sync', { guestId, items })
    return response.data
  }
)

const storedData = loadCartFromStorage()
const initialGuestId = storedData.guestId || localStorage.getItem('guestId') || generateGuestId()

const initialState = {
  items: storedData.items || [],
  guestId: initialGuestId,
  totalItems: storedData.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0,
  totalPrice: storedData.items?.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0) || 0,
  loading: false,
  error: null,
  isSynced: false,
}

// Save initial state
saveCartToStorage({ items: initialState.items, guestId: initialState.guestId })
localStorage.setItem('guestId', initialState.guestId)

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setGuestId: (state, action) => {
      state.guestId = action.payload
      localStorage.setItem('guestId', action.payload)
    },
    addItemLocal: (state, action) => {
      const { productId, quantity, size, color, name, price, image } = action.payload
      const existingItem = state.items.find(
        item => item.productId === productId && item.size === size && item.color === color
      )
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        state.items.push({ productId, quantity, size, color, name, price, image })
      }
      // Update totals
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
      state.totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      saveCartToStorage({ items: state.items, guestId: state.guestId })
      toast.success('Added to cart! 🛒')
    },
    removeItemLocal: (state, action) => {
      const { productId, size, color } = action.payload
      state.items = state.items.filter(
        item => !(item.productId === productId && item.size === size && item.color === color)
      )
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
      state.totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      saveCartToStorage({ items: state.items, guestId: state.guestId })
      toast.info('Removed from cart')
    },
    updateQuantityLocal: (state, action) => {
      const { productId, quantity, size, color } = action.payload
      const item = state.items.find(
        item => item.productId === productId && item.size === size && item.color === color
      )
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(
            i => !(i.productId === productId && i.size === size && i.color === color)
          )
        } else {
          item.quantity = quantity
        }
        state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
        state.totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        saveCartToStorage({ items: state.items, guestId: state.guestId })
      }
    },
    clearCartLocal: (state) => {
      state.items = []
      state.totalItems = 0
      state.totalPrice = 0
      saveCartToStorage({ items: [], guestId: state.guestId })
      toast.info('Cart cleared')
    },
    restoreCart: (state) => {
      const stored = loadCartFromStorage()
      state.items = stored.items || []
      state.guestId = stored.guestId || state.guestId
      state.totalItems = state.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
      state.totalPrice = state.items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload.cart) {
          state.items = action.payload.cart.items || []
          state.totalItems = action.payload.cart.totalItems || 0
          state.totalPrice = action.payload.cart.totalPrice || 0
          state.isSynced = true
          saveCartToStorage({ items: state.items, guestId: state.guestId })
        }
      })
      .addCase(fetchCart.rejected, (state) => {
        state.loading = false
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.cart.items || []
        state.totalItems = action.payload.cart.totalItems || 0
        state.totalPrice = action.payload.cart.totalPrice || 0
        saveCartToStorage({ items: state.items, guestId: state.guestId })
        toast.success('Added to cart! 🛒')
      })
      .addCase(addToCart.rejected, () => {
        toast.error('Failed to add to cart')
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload.cart.items || []
        state.totalItems = action.payload.cart.totalItems || 0
        state.totalPrice = action.payload.cart.totalPrice || 0
        saveCartToStorage({ items: state.items, guestId: state.guestId })
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.cart.items || []
        state.totalItems = action.payload.cart.totalItems || 0
        state.totalPrice = action.payload.cart.totalPrice || 0
        saveCartToStorage({ items: state.items, guestId: state.guestId })
        toast.info('Removed from cart')
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = []
        state.totalItems = 0
        state.totalPrice = 0
        saveCartToStorage({ items: [], guestId: state.guestId })
        toast.info('Cart cleared')
      })
      .addCase(syncCart.fulfilled, (state, action) => {
        state.items = action.payload.cart.items || []
        state.totalItems = action.payload.cart.totalItems || 0
        state.totalPrice = action.payload.cart.totalPrice || 0
        state.isSynced = true
        saveCartToStorage({ items: state.items, guestId: state.guestId })
      })
  },
})

export const {
  setGuestId,
  addItemLocal,
  removeItemLocal,
  updateQuantityLocal,
  clearCartLocal,
  restoreCart,
} = cartSlice.actions

export default cartSlice.reducer
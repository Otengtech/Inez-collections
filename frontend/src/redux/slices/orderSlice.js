import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'
import { toast } from 'react-toastify'

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData) => {
    const response = await api.post('/orders', orderData)
    return response.data
  }
)

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async ({ orderId, guestId }) => {
    const response = await api.get(`/orders/${orderId}?guestId=${guestId}`)
    return response.data
  }
)

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async ({ page = 1, limit = 10 } = {}) => {
    const response = await api.get(`/orders/user?page=${page}&limit=${limit}`)
    return response.data
  }
)

export const fetchGuestOrders = createAsyncThunk(
  'orders/fetchGuestOrders',
  async ({ guestId, page = 1, limit = 10 }) => {
    const response = await api.get(`/orders/guest/${guestId}?page=${page}&limit=${limit}`)
    return response.data
  }
)

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async ({ orderId, guestId }) => {
    const response = await api.put(`/orders/${orderId}/cancel`, { guestId })
    return response.data
  }
)

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status, trackingNumber }) => {
    const response = await api.put(`/orders/${orderId}/status`, { status, trackingNumber })
    return response.data
  }
)

export const updatePaymentStatus = createAsyncThunk(
  'orders/updatePaymentStatus',
  async ({ orderId, paymentStatus, paymentId }) => {
    const response = await api.put(`/orders/${orderId}/payment`, { paymentStatus, paymentId })
    return response.data
  }
)

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
}

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null
    },
    clearOrders: (state) => {
      state.orders = []
    },
    resetOrderState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false
        state.currentOrder = action.payload.order
        toast.success('Order placed successfully! 🎉')
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
        toast.error(action.error.message || 'Failed to place order')
      })
      
      // Fetch Order By ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false
        state.currentOrder = action.payload.order
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
        toast.error('Order not found')
      })
      
      // Fetch User Orders (Logged-in User)
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload.orders
        state.pagination = action.payload.pagination
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
        toast.error(action.error.message || 'Failed to fetch orders')
      })
      
      // Fetch Guest Orders
      .addCase(fetchGuestOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGuestOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload.orders
        state.pagination = action.payload.pagination
      })
      .addCase(fetchGuestOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      
      // Cancel Order
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false
        const index = state.orders.findIndex(o => o._id === action.payload.order._id)
        if (index !== -1) {
          state.orders[index] = action.payload.order
        }
        if (state.currentOrder && state.currentOrder._id === action.payload.order._id) {
          state.currentOrder = action.payload.order
        }
        toast.success('Order cancelled successfully')
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false
        toast.error(action.error.message || 'Failed to cancel order')
      })
      
      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false
        const index = state.orders.findIndex(o => o._id === action.payload.order._id)
        if (index !== -1) {
          state.orders[index] = action.payload.order
        }
        if (state.currentOrder && state.currentOrder._id === action.payload.order._id) {
          state.currentOrder = action.payload.order
        }
        toast.success('Order status updated')
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false
        toast.error(action.error.message || 'Failed to update order status')
      })
      
      // Update Payment Status
      .addCase(updatePaymentStatus.pending, (state) => {
        state.loading = true
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        state.loading = false
        if (state.currentOrder && state.currentOrder._id === action.payload.order._id) {
          state.currentOrder = action.payload.order
        }
        toast.success('Payment status updated')
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.loading = false
        toast.error(action.error.message || 'Failed to update payment status')
      })
  },
})

export const { clearCurrentOrder, clearOrders, resetOrderState } = orderSlice.actions
export default orderSlice.reducer
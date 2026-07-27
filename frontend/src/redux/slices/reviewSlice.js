import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'
import { toast } from 'react-toastify'

// ============================================
// ASYNC THUNKS - API Calls
// ============================================

// Fetch all reviews for a product
export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async ({ productId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${productId}/reviews?page=${page}&limit=${limit}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews')
    }
  }
)

// Add a new review
export const addReview = createAsyncThunk(
  'reviews/addReview',
  async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/products/${productId}/reviews`, reviewData)
      toast.success('Thank you for your review! 🎉')
      return response.data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review')
      return rejectWithValue(error.response?.data?.message || 'Failed to submit review')
    }
  }
)

// Mark review as helpful
export const markReviewHelpful = createAsyncThunk(
  'reviews/markHelpful',
  async ({ productId, reviewId, guestId }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/products/${productId}/reviews/${reviewId}/helpful`, { guestId })
      toast.success('Thanks for your feedback!')
      return response.data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark as helpful')
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as helpful')
    }
  }
)

// Delete a review
export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async ({ productId, reviewId, guestId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/products/${productId}/reviews/${reviewId}`, { 
        data: { guestId } 
      })
      toast.success('Review deleted successfully')
      return response.data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete review')
      return rejectWithValue(error.response?.data?.message || 'Failed to delete review')
    }
  }
)

// Update a review
export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ productId, reviewId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/products/${productId}/reviews/${reviewId}`, reviewData)
      toast.success('Review updated successfully')
      return response.data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update review')
      return rejectWithValue(error.response?.data?.message || 'Failed to update review')
    }
  }
)

// ============================================
// INITIAL STATE
// ============================================

const initialState = {
  reviews: [],
  summary: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  loading: false,
  error: null,
  submitting: false,
  deleting: false,
  currentReview: null,
}

// ============================================
// SLICE
// ============================================

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    // Clear all reviews
    clearReviews: (state) => {
      state.reviews = []
      state.summary = null
      state.pagination = initialState.pagination
      state.error = null
    },
    
    // Clear current review
    clearCurrentReview: (state) => {
      state.currentReview = null
    },
    
    // Set pagination
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    
    // Reset state
    resetReviewState: () => initialState,
  },
  
  extraReducers: (builder) => {
    builder
      // ============================================
      // FETCH REVIEWS
      // ============================================
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false
        state.reviews = action.payload.data.reviews || []
        state.summary = action.payload.data.summary || null
        state.pagination = action.payload.data.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0,
        }
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })
      
      // ============================================
      // ADD REVIEW
      // ============================================
      .addCase(addReview.pending, (state) => {
        state.submitting = true
        state.error = null
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.submitting = false
        // Update summary with new stats
        if (action.payload.data) {
          state.summary = {
            averageRating: action.payload.data.averageRating || state.summary?.averageRating || 0,
            totalReviews: action.payload.data.totalReviews || state.summary?.totalReviews || 0,
            ratingDistribution: action.payload.data.ratingDistribution || state.summary?.ratingDistribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          }
        }
      })
      .addCase(addReview.rejected, (state, action) => {
        state.submitting = false
        state.error = action.payload || action.error.message
      })
      
      // ============================================
      // MARK HELPFUL
      // ============================================
      .addCase(markReviewHelpful.pending, (state) => {
        state.error = null
      })
      .addCase(markReviewHelpful.fulfilled, (state, action) => {
        const { reviewId, helpful } = action.payload.data
        const review = state.reviews.find(r => r._id === reviewId)
        if (review) {
          review.helpful = helpful
        }
      })
      .addCase(markReviewHelpful.rejected, (state, action) => {
        state.error = action.payload || action.error.message
      })
      
      // ============================================
      // DELETE REVIEW
      // ============================================
      .addCase(deleteReview.pending, (state) => {
        state.deleting = true
        state.error = null
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.deleting = false
        // Remove review from list
        const reviewId = action.meta.arg.reviewId
        state.reviews = state.reviews.filter(r => r._id !== reviewId)
        
        // Update summary
        if (action.payload.data) {
          state.summary = {
            averageRating: action.payload.data.averageRating || state.summary?.averageRating || 0,
            totalReviews: action.payload.data.totalReviews || state.summary?.totalReviews || 0,
            ratingDistribution: action.payload.data.ratingDistribution || state.summary?.ratingDistribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          }
        }
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.deleting = false
        state.error = action.payload || action.error.message
      })
      
      // ============================================
      // UPDATE REVIEW
      // ============================================
      .addCase(updateReview.pending, (state) => {
        state.submitting = true
        state.error = null
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.submitting = false
        // Update the review in the list
        const updatedReview = action.payload.data.review
        const index = state.reviews.findIndex(r => r._id === updatedReview._id)
        if (index !== -1) {
          state.reviews[index] = updatedReview
        }
        if (state.currentReview && state.currentReview._id === updatedReview._id) {
          state.currentReview = updatedReview
        }
        // Update summary
        if (action.payload.data.summary) {
          state.summary = action.payload.data.summary
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.submitting = false
        state.error = action.payload || action.error.message
      })
  },
})

// ============================================
// EXPORT ACTIONS
// ============================================

export const {
  clearReviews,
  clearCurrentReview,
  setPagination,
  resetReviewState,
} = reviewSlice.actions

// ============================================
// SELECTORS
// ============================================

// Get all reviews
export const selectAllReviews = (state) => state.reviews.reviews

// Get review summary
export const selectReviewSummary = (state) => state.reviews.summary

// Get pagination
export const selectReviewPagination = (state) => state.reviews.pagination

// Get loading state
export const selectReviewsLoading = (state) => state.reviews.loading

// Get submitting state
export const selectReviewsSubmitting = (state) => state.reviews.submitting

// Get error
export const selectReviewsError = (state) => state.reviews.error

// Get current review
export const selectCurrentReview = (state) => state.reviews.currentReview

// Get review by ID
export const selectReviewById = (state, reviewId) => 
  state.reviews.reviews.find(r => r._id === reviewId)

// Check if user has reviewed
export const selectUserHasReviewed = (state, guestId) =>
  state.reviews.reviews.some(r => r.guestId === guestId)

// Get user's review
export const selectUserReview = (state, guestId) =>
  state.reviews.reviews.find(r => r.guestId === guestId) || null

// Get reviews by rating
export const selectReviewsByRating = (state, rating) =>
  state.reviews.reviews.filter(r => r.rating === rating)

// ============================================
// DEFAULT EXPORT
// ============================================

export default reviewSlice.reducer
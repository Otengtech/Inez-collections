import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}) => {
    const response = await api.get('/products', { params })
    return response.data
  }
)

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  }
)

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async (category) => {
    const response = await api.get(`/products/category/${category}`)
    return response.data
  }
)

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData) => {
    const response = await api.post('/products', productData)
    return response.data
  }
)

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }) => {
    const response = await api.put(`/products/${id}`, productData)
    return response.data
  }
)

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id) => {
    const response = await api.delete(`/products/${id}`)
    return response.data
  }
)

export const addProductRating = createAsyncThunk(
  'products/addRating',
  async ({ id, ratingData }) => {
    const response = await api.post(`/products/${id}/rate`, ratingData)
    return response.data
  }
)

const initialState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },
  filters: {
    category: '',
    minPrice: '',
    maxPrice: '',
    color: '',
    size: '',
    rating: '',
    search: '',
    sort: '-createdAt',
  },
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null
    },
    resetProducts: (state) => {
      state.products = []
      state.pagination = initialState.pagination
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.products
        state.pagination = action.payload.pagination
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Fetch Product By ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false
        state.currentProduct = action.payload.product
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Fetch Products By Category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.products
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Create Product
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload.product)
      })
      // Update Product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p._id === action.payload.product._id)
        if (index !== -1) {
          state.products[index] = action.payload.product
        }
        if (state.currentProduct && state.currentProduct._id === action.payload.product._id) {
          state.currentProduct = action.payload.product
        }
      })
      // Delete Product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p._id !== action.meta.arg)
        if (state.currentProduct && state.currentProduct._id === action.meta.arg) {
          state.currentProduct = null
        }
      })
      // Add Rating
      .addCase(addProductRating.fulfilled, (state, action) => {
        if (state.currentProduct) {
          state.currentProduct.rating = action.payload.rating
          state.currentProduct.ratings = action.payload.ratings
        }
        const index = state.products.findIndex(p => p._id === action.meta.arg.id)
        if (index !== -1) {
          state.products[index].rating = action.payload.rating
          state.products[index].ratings = action.payload.ratings
        }
      })
  },
})

export const { setFilters, clearFilters, clearCurrentProduct, resetProducts } = productSlice.actions
export default productSlice.reducer
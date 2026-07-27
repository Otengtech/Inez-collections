import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'
import { toast } from 'react-toastify'

// Admin Login
export const adminLogin = createAsyncThunk(
  'admin/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/login', credentials)
      
      // Check if response has the expected data
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Login failed')
      }
      
      // Store admin data in localStorage
      if (response.data.admin) {
        localStorage.setItem('adminToken', JSON.stringify(response.data.admin))
      }
      
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed'
      return rejectWithValue(message)
    }
  }
)

// Get Admin Stats
export const fetchAdminStats = createAsyncThunk(
  'admin/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/stats')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats')
    }
  }
)

// Get All Admins
export const fetchAdmins = createAsyncThunk(
  'admin/fetchAdmins',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/admins')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch admins')
    }
  }
)

// Create Admin
export const createAdmin = createAsyncThunk(
  'admin/createAdmin',
  async (adminData, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/admins', adminData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create admin')
    }
  }
)

// Update Admin
export const updateAdmin = createAsyncThunk(
  'admin/updateAdmin',
  async ({ id, adminData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/admins/${id}`, adminData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update admin')
    }
  }
)

// Delete Admin
export const deleteAdmin = createAsyncThunk(
  'admin/deleteAdmin',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/admins/${id}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete admin')
    }
  }
)

// Change Password
export const changeAdminPassword = createAsyncThunk(
  'admin/changePassword',
  async ({ id, passwords }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/admins/${id}/password`, passwords)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to change password')
    }
  }
)

const initialState = {
  admin: null,
  admins: [],
  stats: null,
  loading: false,
  error: null,
  isAuthenticated: false,
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    logout: (state) => {
      state.admin = null
      state.isAuthenticated = false
      localStorage.removeItem('adminToken')
      toast.info('Logged out successfully')
    },
    clearError: (state) => {
      state.error = null
    },
    setAdmin: (state, action) => {
      state.admin = action.payload
      state.isAuthenticated = true
      localStorage.setItem('adminToken', JSON.stringify(action.payload))
    },
    // New reducer to check auth status on app load
    checkAuth: (state) => {
      const token = localStorage.getItem('adminToken')
      if (token) {
        try {
          const adminData = JSON.parse(token)
          state.admin = adminData
          state.isAuthenticated = true
        } catch (e) {
          localStorage.removeItem('adminToken')
          state.admin = null
          state.isAuthenticated = false
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // ========== LOGIN ==========
      .addCase(adminLogin.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false
        state.admin = action.payload.admin
        state.isAuthenticated = true
        toast.success('Welcome back! 🎉')
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Login failed'
        // Don't show duplicate toast here since we show it in the component
      })

      // ========== FETCH STATS ==========
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false
        state.stats = action.payload.stats
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch stats'
      })

      // ========== FETCH ADMINS ==========
      .addCase(fetchAdmins.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.loading = false
        state.admins = action.payload.admins || []
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch admins'
      })

      // ========== CREATE ADMIN ==========
      .addCase(createAdmin.fulfilled, (state, action) => {
        if (action.payload.admin) {
          state.admins.push(action.payload.admin)
        }
        toast.success('Admin created successfully')
      })
      .addCase(createAdmin.rejected, (state, action) => {
        toast.error(action.payload || 'Failed to create admin')
      })

      // ========== UPDATE ADMIN ==========
      .addCase(updateAdmin.fulfilled, (state, action) => {
        if (action.payload.admin) {
          const index = state.admins.findIndex(a => a._id === action.payload.admin._id)
          if (index !== -1) {
            state.admins[index] = action.payload.admin
          }
        }
        toast.success('Admin updated successfully')
      })
      .addCase(updateAdmin.rejected, (state, action) => {
        toast.error(action.payload || 'Failed to update admin')
      })

      // ========== DELETE ADMIN ==========
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        const adminId = action.meta.arg
        state.admins = state.admins.filter(a => a._id !== adminId)
        toast.success('Admin deleted successfully')
      })
      .addCase(deleteAdmin.rejected, (state, action) => {
        toast.error(action.payload || 'Failed to delete admin')
      })

      // ========== CHANGE PASSWORD ==========
      .addCase(changeAdminPassword.fulfilled, () => {
        toast.success('Password changed successfully')
      })
      .addCase(changeAdminPassword.rejected, (state, action) => {
        toast.error(action.payload || 'Failed to change password')
      })
  },
})

export const { logout, clearError, setAdmin, checkAuth } = adminSlice.actions
export default adminSlice.reducer
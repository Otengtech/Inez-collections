import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isMobileMenuOpen: false,
  isCartOpen: false,
  isLoading: false,
  notification: null,
  isAdminSidebarOpen: true,
  theme: 'light',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen
    },
    closeMobileMenu: (state) => {
      state.isMobileMenuOpen = false
    },
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen
    },
    closeCart: (state) => {
      state.isCartOpen = false
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setNotification: (state, action) => {
      state.notification = action.payload
    },
    clearNotification: (state) => {
      state.notification = null
    },
    toggleAdminSidebar: (state) => {
      state.isAdminSidebarOpen = !state.isAdminSidebarOpen
    },
    closeAdminSidebar: (state) => {
      state.isAdminSidebarOpen = false
    },
    openAdminSidebar: (state) => {
      state.isAdminSidebarOpen = true
    },
    setTheme: (state, action) => {
      state.theme = action.payload
    },
  },
})

export const {
  toggleMobileMenu,
  closeMobileMenu,
  toggleCart,
  closeCart,
  setLoading,
  setNotification,
  clearNotification,
  toggleAdminSidebar,
  closeAdminSidebar,
  openAdminSidebar,
  setTheme,
} = uiSlice.actions

export default uiSlice.reducer
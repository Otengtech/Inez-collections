import { configureStore } from '@reduxjs/toolkit'
import productReducer from './slices/productSlice'
import cartReducer from './slices/cartSlice'
import orderReducer from './slices/orderSlice'
import uiReducer from './slices/uiSlice'
import adminReducer from './slices/adminSlice'
import reviewReducer from './slices/reviewSlice'

export const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    orders: orderReducer,
    ui: uiReducer,
    admin: adminReducer,
    reviews: reviewReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['cart.items'],
      },
    }),
  devTools: import.meta.env.NODE_ENV !== 'production',
})

export default store
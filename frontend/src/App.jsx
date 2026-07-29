import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Common Components
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import ScrollToTop from './components/common/ScrollToTop'

// Pages
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Category from './pages/Category'
import OrderSuccess from './pages/OrderSuccess'
import OrderTracking from './pages/OrderTracking'
import OrderPage from './pages/OrdersPage' // ✅ Import OrderPage
import Contact from './pages/Contact'
import AdminLayout from './components/admin/AdminLayout'
import Wishlist from './pages/Whishlist'
import Reviews from './pages/Reviews'
import About from './pages/About'
import AdminLogin from './components/admin/AdminLogin'

// Protected Route Component
const PrivateRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth)
  const location = useLocation()
  
  if (!user) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />
  }
  
  return children
}

function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-16"
      />

      {/* Navbar - Hidden on Admin Routes */}
      {!isAdminRoute && <Navbar />}

      {/* Main Content */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
          <Route path="/orders" element={<OrderPage />} /> {/* ✅ Order Page Route */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/about" element={<About />} />
          <Route path="/category/:categorySlug" element={<Category />} />
          <Route path="/admin/dashboard" element={<AdminLayout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/products/:productId/reviews" element={<Reviews />} />
        </Routes>
      </main>

      {/* Footer - Hidden on Admin Routes */}
      {!isAdminRoute && <Footer />}

      {/* Scroll to Top on Route Change */}
      <ScrollToTop />
    </div>
  )
}

export default App
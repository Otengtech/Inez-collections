import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingBag, faArrowLeft, faTrash, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import CartItem from '../components/cart/CartItem'
import CartSummary from '../components/cart/CartSummary'
import { clearCartLocal } from '../redux/slices/cartSlice'
import ScrollReveal from '../components/common/ScrollReveal'

const Cart = () => {
  const dispatch = useDispatch()
  const { items, totalItems, totalPrice } = useSelector((state) => state.cart)

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCartLocal())
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 px-4 sm:px-6 lg:px-10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <FontAwesomeIcon icon={faShoppingBag} className="text-4xl md:text-5xl text-gray-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
          </p>
          <Link 
            to="/products" 
            className="inline-flex items-center gap-2 bg-[#D6F04C] text-black px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold hover:bg-[#C5E043] transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
          >
            <FontAwesomeIcon icon={faShoppingCart} />
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container-custom px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <ScrollReveal direction="up">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
            <div>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-[#D6F04C] transition-colors text-sm md:text-base mb-2"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                Continue Shopping
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Your <span className="text-[#D6F04C]">Cart</span>
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {totalItems} item{totalItems > 1 ? 's' : ''} in your cart
              </p>
            </div>
            
            <button
              onClick={handleClearCart}
              className="flex items-center gap-2 px-4 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm font-medium"
            >
              <FontAwesomeIcon icon={faTrash} />
              Clear Cart
            </button>
          </div>
        </ScrollReveal>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
          {/* Left Column - Scrollable Cart Items */}
          <div className="flex-1 min-w-0 w-full lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto lg:pr-2 space-y-4">
            {/* Free Shipping Banner */}
            {totalPrice < 100 && totalPrice > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
                <p className="text-blue-700 text-sm">
                  🚚 Spend ${(100 - totalPrice).toFixed(2)} more for free shipping!
                </p>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-2 max-w-md mx-auto">
                  <div 
                    className="bg-blue-600 rounded-full h-2 transition-all duration-500"
                    style={{ width: `${Math.min((totalPrice / 100) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Cart Items */}
            {items.map((item, index) => (
              <ScrollReveal
                key={`${item.productId}-${item.size}-${item.color}`}
                direction="up"
                delay={index * 100}
              >
                <CartItem item={item} />
              </ScrollReveal>
            ))}

            {/* Bottom padding for scroll */}
            <div className="h-4"></div>
          </div>

          {/* Right Column - Fixed Order Summary */}
          <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 lg:sticky lg:top-28">
            <CartSummary totalItems={totalItems} totalPrice={totalPrice} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
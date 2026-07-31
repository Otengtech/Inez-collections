import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingBag, faArrowLeft, faTrash, faShoppingCart, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import CartItem from '../components/cart/CartItem'
import CartSummary from '../components/cart/CartSummary'
import { clearCartLocal, updateQuantityLocal, removeItemLocal } from '../redux/slices/cartSlice'
import ScrollReveal from '../components/common/ScrollReveal'
import { toast } from 'react-toastify'
import api from '../services/api'

const Cart = () => {
  const dispatch = useDispatch()
  const { items, totalItems, totalPrice } = useSelector((state) => state.cart)
  const [stockErrors, setStockErrors] = useState([])
  const [loading, setLoading] = useState(false)
  const [cartItemsWithStock, setCartItemsWithStock] = useState([])
  const [updatingItem, setUpdatingItem] = useState(null)

  // Fetch stock for all items on load and when items change
  useEffect(() => {
    fetchStockForItems()
  }, [items])

  const fetchStockForItems = async () => {
    if (items.length === 0) {
      setCartItemsWithStock([])
      setStockErrors([])
      return
    }

    setLoading(true)
    const errors = []
    const updatedItems = []

    for (const item of items) {
      try {
        const response = await api.get(`/products/${item.productId}`)
        const product = response.data.product
        
        if (product) {
          const currentStock = product.stock || 0
          
          // Add stock info to item
          updatedItems.push({
            ...item,
            stock: currentStock,
            productData: product
          })

          // Check if quantity exceeds stock
          if (item.quantity > currentStock) {
            errors.push({
              productId: item.productId,
              name: item.name,
              requested: item.quantity,
              available: currentStock
            })
          }
        }
      } catch (error) {
        console.error(`Failed to fetch stock for ${item.name}:`, error)
        // Keep item without stock info
        updatedItems.push({
          ...item,
          stock: 999, // Assume unlimited if can't fetch
        })
      }
    }

    setCartItemsWithStock(updatedItems)
    setStockErrors(errors)
    setLoading(false)
  }

  const handleUpdateQuantity = useCallback(async (productId, newQuantity, size, color) => {
    if (updatingItem === productId) return
    
    // Find the item in cart
    const item = items.find(i => i.productId === productId && i.size === size && i.color === color)
    if (!item) return

    // Find the item with stock info
    const itemWithStock = cartItemsWithStock.find(i => i.productId === productId && i.size === size && i.color === color)
    const maxStock = itemWithStock?.stock || 999

    // Validate quantity
    if (newQuantity <= 0) {
      dispatch(removeItemLocal({ productId, size, color }))
      toast.info(`${item.name} removed from cart`)
      return
    }

    // Check stock limit
    if (newQuantity > maxStock && maxStock !== 999) {
      toast.warning(`Only ${maxStock} items available in stock`)
      return
    }

    // Check if trying to add more than stock
    if (newQuantity > item.quantity && maxStock !== 999 && newQuantity > maxStock) {
      toast.warning(`Cannot add more than ${maxStock} items`)
      return
    }

    setUpdatingItem(productId)
    
    try {
      // Update local state immediately for better UX
      dispatch(updateQuantityLocal({ 
        productId, 
        quantity: newQuantity, 
        size, 
        color 
      }))
      
      // Refresh stock after update
      await fetchStockForItems()
      
    } catch (error) {
      console.error('Failed to update quantity:', error)
      toast.error('Failed to update quantity')
    } finally {
      setUpdatingItem(null)
    }
  }, [items, cartItemsWithStock, dispatch, updatingItem])

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCartLocal())
      toast.info('Cart cleared')
    }
  }

  const hasStockIssues = stockErrors.length > 0

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 px-6 sm:px-8 lg:px-10 flex items-center justify-center">
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
    <div className="min-h-screen bg-gray-50 pt-28">
      <div className="container-custom px-6 sm:px-8 lg:px-16">
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

            <div className="flex items-center gap-3">
              {hasStockIssues && (
                <span className="flex items-center gap-1 text-xs text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-xs" />
                  Stock issues
                </span>
              )}
              <button
                onClick={handleClearCart}
                className="flex items-center gap-2 px-4 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm font-medium"
              >
                <FontAwesomeIcon icon={faTrash} />
                Clear Cart
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Stock Warning Banner */}
        {hasStockIssues && (
          <div className="mb-4 bg-orange-50 border border-orange-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-orange-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-800">Stock Updates</p>
                <p className="text-sm text-orange-600">
                  Some items in your cart have limited stock. Please review your cart before checkout.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
          {/* Left Column - Scrollable Cart Items */}
          <div className="flex-1 min-w-0 w-full lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto lg:pr-2 space-y-4">
            {/* Cart Items */}
            {cartItemsWithStock.map((item, index) => (
              <ScrollReveal
                key={`${item.productId}-${item.size}-${item.color}`}
                direction="up"
                delay={(index % 4) * 100}
              >
                <CartItem 
                  item={item} 
                  stock={item.stock}
                  onUpdateQuantity={handleUpdateQuantity}
                  isUpdating={updatingItem === item.productId}
                />
              </ScrollReveal>
            ))}

            {/* Bottom padding for scroll */}
            <div className="h-4"></div>
          </div>

          {/* Right Column - Fixed Order Summary */}
          <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 lg:sticky lg:top-28">
            <CartSummary 
              totalItems={totalItems} 
              totalPrice={totalPrice} 
              hasStockIssues={hasStockIssues}
              stockErrors={stockErrors}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
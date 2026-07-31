import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faTrash, 
  faPlus, 
  faMinus, 
  faStar, 
  faStarHalf,
  faChevronDown,
  faChevronUp,
  faTag,
  faTruck,
  faClock,
  faShieldAlt,
  faInfoCircle,
  faBox,
  faRuler,
  faPalette,
  faStore,
  faCalendar,
  faAward,
  faGift,
  faShippingFast,
  faUndo,
  faCheckCircle,
  faMedal
} from '@fortawesome/free-solid-svg-icons'
import { updateQuantityLocal, removeItemLocal } from '../../redux/slices/cartSlice'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const CartItem = ({ item, stock, onStockUpdate, onUpdateQuantity, isUpdating }) => {
  const dispatch = useDispatch()
  const [showDetails, setShowDetails] = useState(false)
  
  // Use the stock from props or fallback to item.stock
  const maxStock = stock !== undefined ? stock : (item.stock || 999)
  const isOutOfStock = maxStock === 0

  const handleUpdateQuantity = (quantity) => {
    if (quantity <= 0) {
      dispatch(removeItemLocal({ 
        productId: item.productId, 
        size: item.size, 
        color: item.color 
      }))
      toast.info(`${item.name} removed from cart`)
      return
    }

    // Check if requested quantity exceeds stock
    if (quantity > maxStock && maxStock !== 999) {
      toast.warning(`Only ${maxStock} items available in stock`)
      return
    }

    dispatch(updateQuantityLocal({ 
      productId: item.productId, 
      quantity, 
      size: item.size, 
      color: item.color 
    }))
    
    // Refresh stock after update
    if (onStockUpdate) {
      setTimeout(onStockUpdate, 100)
    }
  }

  const handleRemove = () => {
    dispatch(removeItemLocal({ 
      productId: item.productId, 
      size: item.size, 
      color: item.color 
    }))
    toast.info(`${item.name} removed from cart`)
  }

  const renderStars = (rating) => {
    const stars = []
    const numRating = Number(rating) || 0
    for (let i = 1; i <= 5; i++) {
      if (i <= numRating) {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400 text-[10px]" />)
      } else if (i - 0.5 <= numRating) {
        stars.push(<FontAwesomeIcon key={i} icon={faStarHalf} className="text-yellow-400 text-[10px]" />)
      } else {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-gray-300 text-[10px]" />)
      }
    }
    return stars
  }

  const isAtMaxStock = item.quantity >= maxStock && maxStock !== 999

  // Calculate estimated delivery date (3-5 business days from now)
  const getEstimatedDelivery = () => {
    const date = new Date()
    date.setDate(date.getDate() + 5)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Get stock status text
  const getStockStatus = () => {
    if (isOutOfStock) return { text: 'Out of Stock', color: 'text-red-500', bg: 'bg-red-50' }
    if (maxStock <= 3) return { text: `Only ${maxStock} left!`, color: 'text-orange-500', bg: 'bg-orange-50' }
    if (maxStock <= 10) return { text: `Low Stock (${maxStock} left)`, color: 'text-yellow-500', bg: 'bg-yellow-50' }
    return { text: 'In Stock', color: 'text-green-500', bg: 'bg-green-50' }
  }

  const stockStatus = getStockStatus()

  // Calculate total price
  const totalPrice = (item.price * item.quantity).toFixed(2)

  return (
    <div className="group bg-white rounded-[1.75rem] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-50 overflow-hidden">
      <div className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
          {/* Product Image */}
          <Link 
            to={`/products/${item.productId}`}
            className="flex-shrink-0 relative"
          >
            <div className="w-full sm:w-28 md:w-32 lg:w-36 aspect-square rounded-2xl overflow-hidden bg-[#F4F6F2]">
              <img
                src={item.image || '/placeholder.jpg'}
                alt={item.name}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            {/* Quantity badge */}
            <div className="absolute -top-2 -right-2 bg-[#D6F04C] text-black text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md">
              {item.quantity}
            </div>
            {/* Low stock badge */}
            {!isOutOfStock && maxStock <= 3 && maxStock > 0 && (
              <div className="absolute -bottom-2 -left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md animate-pulse">
                Only {maxStock} left
              </div>
            )}
            {/* Out of stock overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-xs bg-red-500 px-3 py-1 rounded-full">
                  Out of Stock
                </span>
              </div>
            )}
          </Link>

          {/* Product Info */}
          <div className="flex-1 flex flex-col sm:flex-row gap-3 md:gap-6">
            <div className="flex-1">
              <Link 
                to={`/products/${item.productId}`}
                className="text-base md:text-lg font-semibold text-gray-800 hover:text-[#D6F04C] transition-colors line-clamp-2"
              >
                {item.name}
              </Link>
              
              {/* Rating */}
              <div className="flex items-center gap-1 mt-1">
                <div className="flex items-center gap-0.5">
                  {renderStars(item.rating || 4.5)}
                </div>
                <span className="text-gray-400 text-[10px] ml-1">({item.reviewCount || 24} reviews)</span>
              </div>

              {/* Price Display */}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-bold text-[#D6F04C]">
                  ${totalPrice}
                </span>
                {item.originalPrice && item.originalPrice > item.price && (
                  <>
                    <span className="text-sm text-gray-400 line-through">
                      ${(item.originalPrice * item.quantity).toFixed(2)}
                    </span>
                    <span className="text-xs text-green-500 font-medium">
                      Save ${((item.originalPrice - item.price) * item.quantity).toFixed(2)}
                    </span>
                  </>
                )}
                <span className="text-xs text-gray-400">
                  (${item.price.toFixed(2)} each)
                </span>
              </div>

              {/* Variants */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {item.size && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F4F6F2] rounded-full text-xs font-medium text-gray-600">
                    <FontAwesomeIcon icon={faRuler} className="text-[10px]" />
                    Size: {item.size}
                  </span>
                )}
                {item.color && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F4F6F2] rounded-full text-xs font-medium text-gray-600">
                    <FontAwesomeIcon icon={faPalette} className="text-[10px]" />
                    Color: {item.color}
                  </span>
                )}
                {item.sku && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F4F6F2] rounded-full text-xs font-medium text-gray-600">
                    <FontAwesomeIcon icon={faBox} className="text-[10px]" />
                    SKU: {item.sku}
                  </span>
                )}
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}>
                  <FontAwesomeIcon icon={faCheckCircle} className="text-[10px]" />
                  {stockStatus.text}
                </span>
              </div>

              {/* Price - Mobile */}
              <div className="sm:hidden mt-3">
                <span className="text-lg font-bold text-[#D6F04C]">
                  ${totalPrice}
                </span>
              </div>

              {/* Show More Button */}
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-600 transition-colors mt-2"
              >
                <FontAwesomeIcon icon={showDetails ? faChevronUp : faChevronDown} className="text-[10px]" />
                {showDetails ? 'Hide Details' : 'Show More Details'}
              </button>

              {/* Additional Details */}
              {showDetails && (
                <div className="mt-3 p-3 bg-[#F4F6F2] rounded-xl space-y-2 animate-fade-in">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <FontAwesomeIcon icon={faTag} className="text-[#D6F04C] text-[10px]" />
                      <span>Category: <span className="font-medium capitalize">{item.category || 'N/A'}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <FontAwesomeIcon icon={faStore} className="text-[#D6F04C] text-[10px]" />
                      <span>Brand: <span className="font-medium">{item.brand || 'Inez Collections'}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <FontAwesomeIcon icon={faShippingFast} className="text-[#D6F04C] text-[10px]" />
                      <span>Shipping: <span className="font-medium">2-5 business days</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <FontAwesomeIcon icon={faCalendar} className="text-[#D6F04C] text-[10px]" />
                      <span>Est. delivery: <span className="font-medium">{getEstimatedDelivery()}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <FontAwesomeIcon icon={faUndo} className="text-[#D6F04C] text-[10px]" />
                      <span>Returns: <span className="font-medium">30 days</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <FontAwesomeIcon icon={faAward} className="text-[#D6F04C] text-[10px]" />
                      <span>Warranty: <span className="font-medium">1 year</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <FontAwesomeIcon icon={faGift} className="text-[#D6F04C] text-[10px]" />
                      <span>Free gift wrap available</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <FontAwesomeIcon icon={faMedal} className="text-[#D6F04C] text-[10px]" />
                      <span>Premium quality guaranteed</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right side - Quantity & Price */}
            <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-start gap-3 sm:gap-4">
              {/* Quantity Controls */}
              <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-[#F4F6F2]">
                <button
                  onClick={() => handleUpdateQuantity(item.quantity - 1)}
                  disabled={isUpdating}
                  className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center hover:bg-white transition-colors text-gray-600 hover:text-[#D6F04C] disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  <FontAwesomeIcon icon={faMinus} className="text-xs" />
                </button>
                <span className={`w-8 md:w-10 text-center text-sm font-medium ${
                  isAtMaxStock ? 'text-orange-500' : 'text-gray-700'
                }`}>
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleUpdateQuantity(item.quantity + 1)}
                  disabled={isAtMaxStock || isOutOfStock || isUpdating}
                  className={`w-8 h-8 md:w-9 md:h-9 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    isAtMaxStock || isOutOfStock
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'hover:bg-white text-gray-600 hover:text-[#D6F04C]'
                  }`}
                  aria-label="Increase quantity"
                >
                  <FontAwesomeIcon icon={faPlus} className="text-xs" />
                </button>
              </div>

              {/* Stock info */}
              <div className="text-[10px] text-gray-400 text-center sm:text-right">
                {isUpdating && (
                  <span className="text-blue-500 font-medium animate-pulse">Updating...</span>
                )}
                {isOutOfStock && !isUpdating && (
                  <span className="text-red-500 font-medium">Out of stock</span>
                )}
                {isAtMaxStock && !isOutOfStock && maxStock !== 999 && !isUpdating && (
                  <span className="text-orange-500 font-medium">Max stock reached</span>
                )}
                {!isAtMaxStock && !isOutOfStock && maxStock !== 999 && !isUpdating && (
                  <span className="text-gray-400">{maxStock - item.quantity} remaining</span>
                )}
                {maxStock === 999 && !isUpdating && (
                  <span className="text-gray-400">In stock</span>
                )}
              </div>

              {/* Unit Price */}
              <div className="text-[10px] text-gray-400 text-center sm:text-right hidden sm:block">
                ${item.price.toFixed(2)} each
              </div>

              {/* Price & Remove */}
              <div className="flex items-center gap-3">
                <span className="hidden sm:block text-lg md:text-xl font-bold text-[#D6F04C] min-w-[80px] text-right">
                  ${totalPrice}
                </span>
                <button
                  onClick={handleRemove}
                  disabled={isUpdating}
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
                  aria-label="Remove item"
                >
                  <FontAwesomeIcon icon={faTrash} className="text-sm" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItem
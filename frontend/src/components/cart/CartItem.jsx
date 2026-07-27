import React from 'react'
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus, faMinus, faStar, faStarHalf } from '@fortawesome/free-solid-svg-icons'
import { updateQuantityLocal, removeItemLocal } from '../../redux/slices/cartSlice'
import { Link } from 'react-router-dom'

const CartItem = ({ item }) => {
  const dispatch = useDispatch()

  const handleUpdateQuantity = (quantity) => {
    if (quantity <= 0) {
      dispatch(removeItemLocal({ 
        productId: item.productId, 
        size: item.size, 
        color: item.color 
      }))
    } else {
      dispatch(updateQuantityLocal({ 
        productId: item.productId, 
        quantity, 
        size: item.size, 
        color: item.color 
      }))
    }
  }

  const handleRemove = () => {
    dispatch(removeItemLocal({ 
      productId: item.productId, 
      size: item.size, 
      color: item.color 
    }))
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

  return (
    <div className="group bg-white rounded-[1.75rem] p-4 md:p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-50">
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
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          {/* Quantity badge */}
          <div className="absolute -top-2 -right-2 bg-[#D6F04C] text-black text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md">
            {item.quantity}
          </div>
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
              <span className="text-gray-400 text-[10px] ml-1">(24)</span>
            </div>

            {/* Variants */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {item.size && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F4F6F2] rounded-full text-xs font-medium text-gray-600">
                  Size: {item.size}
                </span>
              )}
              {item.color && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F4F6F2] rounded-full text-xs font-medium text-gray-600">
                  Color: {item.color}
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 rounded-full text-xs font-medium text-green-600">
                In Stock
              </span>
            </div>

            {/* Price - Mobile */}
            <div className="sm:hidden mt-3">
              <span className="text-lg font-bold text-[#D6F04C]">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Right side - Quantity & Price */}
          <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-start gap-3 sm:gap-4">
            {/* Quantity Controls */}
            <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-[#F4F6F2]">
              <button
                onClick={() => handleUpdateQuantity(item.quantity - 1)}
                className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center hover:bg-white transition-colors text-gray-600 hover:text-[#D6F04C]"
                aria-label="Decrease quantity"
              >
                <FontAwesomeIcon icon={faMinus} className="text-xs" />
              </button>
              <span className="w-8 md:w-10 text-center text-sm font-medium text-gray-700">
                {item.quantity}
              </span>
              <button
                onClick={() => handleUpdateQuantity(item.quantity + 1)}
                className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center hover:bg-white transition-colors text-gray-600 hover:text-[#D6F04C]"
                aria-label="Increase quantity"
              >
                <FontAwesomeIcon icon={faPlus} className="text-xs" />
              </button>
            </div>

            {/* Price & Remove */}
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-lg md:text-xl font-bold text-[#D6F04C] min-w-[80px] text-right">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
              <button
                onClick={handleRemove}
                className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                aria-label="Remove item"
              >
                <FontAwesomeIcon icon={faTrash} className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItem
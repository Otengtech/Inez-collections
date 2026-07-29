import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faArrowLeft, 
  faLock, 
  faTruck, 
  faShield, 
  faTag, 
  faGift,
  faCreditCard,
  faMoneyBill,
  faStar
} from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'

const CartSummary = ({ totalItems, totalPrice }) => {
  const navigate = useNavigate()
  
  const total = totalPrice

  const handleCheckout = () => {
    if (totalItems === 0) {
      toast.error('Your cart is empty')
      return
    }
    navigate('/checkout')
  }

  return (
    <div className="bg-white rounded-[1.75rem] shadow-sm border mb-6 border-gray-100 p-6 md:p-8">
      <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-6">
        Order Summary
      </h3>
      
      {/* Items Count */}
      <div className="flex items-center gap-2 bg-[#F4F6F2] rounded-full px-4 py-2 mb-6">
        <span className="text-sm font-medium text-gray-600">
          {totalItems} item{totalItems > 1 ? 's' : ''}
        </span>
        <span className="text-xs text-gray-400">·</span>
        <span className="text-sm font-semibold text-[#D6F04C]">
          ${totalPrice.toFixed(2)}
        </span>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 border-b border-gray-100 pb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-800">${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center py-4 border-b border-gray-100">
        <span className="text-base font-bold text-gray-800">Total</span>
        <span className="text-2xl font-bold text-[#D6F04C]">
          ${total.toFixed(2)}
        </span>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        className="w-full bg-[#D6F04C] text-black py-3.5 rounded-full font-semibold hover:bg-[#C5E043] transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl mt-4 text-base"
      >
        Proceed to Checkout
      </button>

      {/* Continue Shopping */}
      <Link
        to="/products"
        className="w-full text-center block mt-3 text-gray-500 hover:text-[#D6F04C] transition-colors text-sm"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Continue Shopping
      </Link>
    </div>
  )
}

export default CartSummary
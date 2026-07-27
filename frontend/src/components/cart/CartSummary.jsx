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
  
  const shipping = totalPrice >= 100 ? 0 : 10
  const tax = totalPrice * 0.08
  const total = totalPrice + shipping + tax
  const savings = totalPrice >= 100 ? 10 : 0

  const handleCheckout = () => {
    if (totalItems === 0) {
      toast.error('Your cart is empty')
      return
    }
    navigate('/checkout')
  }

  return (
    <div className="bg-white rounded-[1.75rem] shadow-sm border border-gray-100 p-6 md:p-8">
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
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          {shipping === 0 ? (
            <span className="font-medium text-green-500">Free</span>
          ) : (
            <span className="font-medium text-gray-800">${shipping.toFixed(2)}</span>
          )}
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (8%)</span>
          <span className="font-medium text-gray-800">${tax.toFixed(2)}</span>
        </div>

        {savings > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <FontAwesomeIcon icon={faTag} className="text-green-500 text-xs" />
              Savings
            </span>
            <span className="font-medium text-green-500">-${savings.toFixed(2)}</span>
          </div>
        )}
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

      {/* Trust Badges */}
      <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500 flex-wrap">
          <span className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faLock} className="text-[#D6F04C] text-sm" />
            Secure Checkout
          </span>
          <span className="w-px h-4 bg-gray-200"></span>
          <span className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faTruck} className="text-[#D6F04C] text-sm" />
            Free Shipping $100+
          </span>
          <span className="w-px h-4 bg-gray-200"></span>
          <span className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faShield} className="text-[#D6F04C] text-sm" />
            30-Day Returns
          </span>
        </div>

        {/* Payment Methods */}
        <div className="flex justify-center items-center gap-2 mt-3">
          <span className="text-[10px] text-gray-400">We accept:</span>
          <div className="flex gap-1.5">
            <span className="text-[10px] px-2 py-0.5 bg-gray-100 rounded text-gray-600 font-medium">Visa</span>
            <span className="text-[10px] px-2 py-0.5 bg-gray-100 rounded text-gray-600 font-medium">MC</span>
            <span className="text-[10px] px-2 py-0.5 bg-gray-100 rounded text-gray-600 font-medium">Amex</span>
            <span className="text-[10px] px-2 py-0.5 bg-gray-100 rounded text-gray-600 font-medium">PayPal</span>
          </div>
        </div>

        {/* Guarantee */}
        <div className="text-center mt-2">
          <span className="text-[10px] text-gray-400">
            <FontAwesomeIcon icon={faGift} className="mr-1" />
            Free returns within 30 days
          </span>
        </div>
      </div>
    </div>
  )
}

export default CartSummary
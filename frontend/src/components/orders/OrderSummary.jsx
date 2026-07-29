import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingBag, faTruck, faCreditCard } from '@fortawesome/free-solid-svg-icons'

const OrderSummary = ({ items, totalPrice }) => {
  return (
    <div className="bg-white rounded-[1.75rem] p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 sticky top-24">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-full bg-gold-100 flex items-center justify-center">
          <FontAwesomeIcon icon={faShoppingBag} className="text-gold-600 text-sm" />
        </div>
        <h3 className="text-xl font-bold text-black">Order Summary</h3>
      </div>
      
      <div className="space-y-3 max-h-60 overflow-y-auto mb-4 pr-2 custom-scrollbar">
        {items.map((item) => (
          <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3 p-2 bg-[#F4F6F2] rounded-xl hover:bg-gold-50 transition-colors">
            <img
              src={item.image || '/placeholder.jpg'}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-black truncate">{item.name}</p>
              <p className="text-sm text-black/50">x{item.quantity}</p>
              {item.size && <p className="text-xs text-black/40">Size: {item.size}</p>}
              {item.color && <p className="text-xs text-black/40">Color: {item.color}</p>}
            </div>
            <p className="text-sm font-bold gold-text whitespace-nowrap">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-black/60 text-sm">Subtotal</span>
          <span className="font-semibold text-black">${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-black/60 text-sm flex items-center gap-1.5">
            <FontAwesomeIcon icon={faTruck} className="text-xs text-green-500" />
            Shipping
          </span>
          <span className="font-semibold text-green-500">Free</span>
        </div>
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-black">Total</span>
            <span className="text-2xl font-bold gold-text">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
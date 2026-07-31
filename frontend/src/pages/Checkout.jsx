import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { createOrder } from '../redux/slices/orderSlice'
import { clearCartLocal } from '../redux/slices/cartSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faShoppingBag } from '@fortawesome/free-solid-svg-icons'
import OrderForm from '../components/orders/OrderForm'
import OrderSummary from '../components/orders/OrderSummary'
import ScrollReveal from '../components/common/ScrollReveal'
import { toast } from 'react-toastify'

const Checkout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { items, totalPrice } = useSelector((state) => state.cart)
  const { guestId } = useSelector((state) => state.cart)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData) => {
    setLoading(true)
    try {
      const orderData = {
        guestId: guestId || localStorage.getItem('guestId'),
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
        shippingAddress: formData,
        paymentMethod: 'card',
      }

      const result = await dispatch(createOrder(orderData)).unwrap()
      dispatch(clearCartLocal())
      navigate(`/order-success?orderId=${result.order._id}`)
      toast.success('Order placed successfully! 🎉')
    } catch (error) {
      toast.error(error.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative pt-28 pb-10 px-4 sm:px-6 lg:px-10 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-[2.5rem] bg-[#EDF1EC] p-4 sm:p-6 md:p-8 lg:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.06)] overflow-hidden">

          <div className="absolute top-20 left-10 w-32 h-32 bg-gold-400/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gold-600/5 rounded-full blur-3xl"></div>

          {/* Header */}
          <ScrollReveal direction="up">
            <div className="relative text-center mb-10 md:mb-14">
              <span className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-black/70 mb-4 shadow-sm">
                Checkout
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] mb-3">
                Complete Your <span className="text-gold-600">Order</span>
              </h1>
              <p className="text-black/50 max-w-xl mx-auto text-sm md:text-base">
                Review your items and fill in your shipping details to complete your purchase.
              </p>
            </div>
          </ScrollReveal>

          <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left column — form */}
            <div className="lg:col-span-2">
              <ScrollReveal direction="left" delay={100}>
                <div className="bg-white rounded-[1.75rem] p-6 md:p-8 lg:p-10 h-full shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center">
                      <FontAwesomeIcon icon={faShoppingBag} className="text-gold-600 text-sm" />
                    </div>
                    <h2 className="text-2xl font-bold text-black">Shipping Information</h2>
                  </div>
                  <p className="text-sm text-black/40 mb-8 ml-14">
                    Fill in your details below to complete your order.
                  </p>
                  <OrderForm onSubmit={handleSubmit} loading={loading} />
                </div>
              </ScrollReveal>
            </div>

            {/* Right column — summary */}
            <div className="lg:col-span-1">
              <ScrollReveal direction="right" delay={150}>
                <OrderSummary items={items} totalPrice={totalPrice} />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Checkout
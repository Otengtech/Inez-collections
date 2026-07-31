import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faStar, 
  faStarHalf, 
  faMinus, 
  faPlus,
  faShoppingBag,
  faHeart,
  faShare,
  faComment,
  faArrowRight,
  faCheck,
  faTruck,
  faShieldAlt,
  faUndo,
  faXmark,
  faPen,
  faUser,
  faCalendar
} from '@fortawesome/free-solid-svg-icons'
import { addItemLocal } from '../../redux/slices/cartSlice'
import { fetchReviews, clearReviews } from '../../redux/slices/reviewSlice'
import ReviewCard from '../reviews/ReviewCard'
import ReviewSummary from '../reviews/ReviewSummary'
import ReviewForm from '../reviews/ReviewForm'
import { toast } from 'react-toastify'
import ScrollReveal from '../common/ScrollReveal'

const ProductDetails = ({ product }) => {
  const dispatch = useDispatch()
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [mainImage, setMainImage] = useState(product.images?.[0] || '/placeholder.jpg')
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [editingReview, setEditingReview] = useState(null)
  const [guestName, setGuestName] = useState('')

  const { reviews, summary, loading: reviewsLoading } = useSelector((state) => state.reviews)
  const { guestId } = useSelector((state) => state.cart)

  useEffect(() => {
    const storedName = localStorage.getItem('guestName')
    if (storedName) {
      setGuestName(storedName)
    } else {
      const name = 'Guest_' + Math.random().toString(36).substring(2, 8)
      localStorage.setItem('guestName', name)
      setGuestName(name)
    }
  }, [])

  useEffect(() => {
    if (product._id) {
      dispatch(fetchReviews({ productId: product._id, page: 1, limit: 10 }))
    }
    return () => {
      dispatch(clearReviews())
    }
  }, [dispatch, product._id])

  const renderStars = (rating) => {
    const stars = []
    const numRating = Number(rating) || 0
    for (let i = 1; i <= 5; i++) {
      if (i <= numRating) {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400 text-sm" />)
      } else if (i - 0.5 <= numRating) {
        stars.push(<FontAwesomeIcon key={i} icon={faStarHalf} className="text-yellow-400 text-sm" />)
      } else {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-gray-300 text-sm" />)
      }
    }
    return stars
  }

  const handleAddToCart = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error('Please select a size')
      return
    }
    if (product.stock === 0) {
      toast.error('Sorry, this product is out of stock')
      return
    }
    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items available`)
      return
    }

    dispatch(addItemLocal({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '/placeholder.jpg',
      quantity,
      size: selectedSize,
      color: selectedColor,
    }))
    
    toast.success(`${product.name} added to cart!`)
    setQuantity(1)
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name}`,
        url: window.location.href,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const handleReviewAdded = () => {
    dispatch(fetchReviews({ productId: product._id, page: 1, limit: 10 }))
    setShowReviewForm(false)
    setEditingReview(null)
  }

  const images = product.images || ['/placeholder.jpg']
  const hasUserReviewed = reviews.some(r => r.guestId === guestId)
  const totalReviews = summary?.totalReviews || 0
  const averageRating = summary?.averageRating || product.rating || 0

  const features = [
    { icon: faTruck, label: 'Free Shipping', description: 'On orders over $50' },
    { icon: faShieldAlt, label: 'Secure Payment', description: '100% secure checkout' },
    { icon: faUndo, label: 'Easy Returns', description: '30-day return policy' },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      {/* ============================================ */}
      {/* PRODUCT MAIN SECTION */}
      {/* ============================================ */}
      <div className="relative bg-white rounded-[2.5rem] p-4 sm:p-6 md:p-8 lg:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
        {/* Decorative elements */}
        <svg className="absolute -top-10 -right-10 w-72 h-72 opacity-[0.08] pointer-events-none" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="80" fill="none" stroke="#000" strokeWidth="0.5" />
          <line x1="0" y1="40" x2="200" y2="0" stroke="#000" strokeWidth="0.5" />
        </svg>
        <div className="absolute top-20 left-10 w-32 h-32 bg-gold-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gold-600/5 rounded-full blur-3xl"></div>

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* LEFT - Images */}
          <ScrollReveal direction="left">
            <div>
              <div className="relative flex items-center justify-center aspect-square rounded-[2rem] overflow-hidden bg-[#F4F6F2]">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="max-w-64 h-full object-contain transition-transform duration-500 hover:scale-105"
                />
                
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-white font-bold text-xl px-6 py-3 bg-red-500 rounded-full">
                      Out of Stock
                    </span>
                  </div>
                )}
                {product.stock > 0 && product.stock < 5 && (
                  <div className="absolute bottom-4 left-4 bg-orange-500 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                    Only {product.stock} left!
                  </div>
                )}

                <button
                  onClick={handleWishlist}
                  className="absolute top-4 right-4 w-11 h-11 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110"
                >
                  <FontAwesomeIcon
                    icon={faHeart}
                    className={`text-lg ${isWishlisted ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition-colors`}
                  />
                </button>
                <button
                  onClick={handleShare}
                  className="absolute top-4 left-4 w-11 h-11 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110"
                >
                  <FontAwesomeIcon icon={faShare} className="text-gray-600 text-lg" />
                </button>
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3 md:gap-4 mt-4">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setMainImage(image)}
                      className={`aspect-square rounded-xl overflow-hidden bg-[#F4F6F2] transition-all ${
                        mainImage === image 
                          ? 'ring-2 ring-[#D6F04C] ring-offset-2' 
                          : 'hover:ring-2 hover:ring-gray-300'
                      }`}
                    >
                      <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* RIGHT - Product Info */}
          <ScrollReveal direction="right" delay={100}>
            <div className="flex flex-col">
              {product.category && (
                <span className="inline-block w-fit px-4 py-1.5 bg-[#F4F6F2] rounded-full text-xs font-medium text-black/60 mb-4">
                  {product.category}
                </span>
              )}

              <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-0.5">
                  {renderStars(averageRating)}
                </div>
                <Link 
                  to="#reviews"
                  className="text-sm text-black/40 hover:text-[#D6F04C] transition-colors"
                >
                  ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                </Link>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl md:text-4xl font-bold text-[#D6F04C]">
                  ${Number(product.price).toFixed(2)}
                </span>
                {product.oldPrice && (
                  <span className="text-lg text-black/30 line-through">
                    ${Number(product.oldPrice).toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-black/60 text-sm md:text-base leading-relaxed mb-6">
                {product.description || 'No description available.'}
              </p>

              {product.sizes?.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-black">Select Size</label>
                    {selectedSize && (
                      <span className="text-xs text-[#D6F04C] font-medium">
                        Selected: {selectedSize}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          selectedSize === size
                            ? 'bg-[#D6F04C] text-black shadow-md'
                            : 'bg-[#F4F6F2] text-black/70 hover:bg-[#D6F04C]/20'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.colors?.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-black">Select Color</label>
                    {selectedColor && (
                      <span className="text-xs text-[#D6F04C] font-medium">
                        Selected: {selectedColor}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          selectedColor === color
                            ? 'bg-[#D6F04C] text-black shadow-md'
                            : 'bg-[#F4F6F2] text-black/70 hover:bg-[#D6F04C]/20'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-semibold text-black">Qty</label>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="px-3 md:px-4 py-2 hover:bg-[#F4F6F2] transition-colors disabled:opacity-50"
                    >
                      <FontAwesomeIcon icon={faMinus} className="text-sm" />
                    </button>
                    <span className="px-4 py-2 min-w-[40px] text-center text-sm font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="px-3 md:px-4 py-2 hover:bg-[#F4F6F2] transition-colors disabled:opacity-50"
                    >
                      <FontAwesomeIcon icon={faPlus} className="text-sm" />
                    </button>
                  </div>
                </div>
                <span className="text-sm text-black/40">{product.stock} available</span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full bg-[#D6F04C] text-black py-3 md:py-4 rounded-full font-semibold text-base md:text-lg flex items-center justify-center gap-3 transition-all ${
                  product.stock === 0 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-[#C5E043] hover:shadow-lg hover:-translate-y-0.5'
                }`}
              >
                <FontAwesomeIcon icon={faShoppingBag} />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="text-center">
                      <div className="w-10 h-10 bg-[#F4F6F2] rounded-full flex items-center justify-center mx-auto mb-2">
                        <FontAwesomeIcon icon={feature.icon} className="text-[#D6F04C] text-sm" />
                      </div>
                      <p className="text-xs font-medium text-black">{feature.label}</p>
                      <p className="text-[10px] text-black/40">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* ============================================ */}
      {/* REVIEWS SECTION */}
      {/* ============================================ */}
      <div id="reviews" className="mt-8 relative mb-6 bg-white rounded-[2.5rem] p-4 sm:p-6 md:p-8 lg:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
        <svg className="absolute -bottom-10 -left-10 w-72 h-72 opacity-[0.08] pointer-events-none" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="80" fill="none" stroke="#000" strokeWidth="0.5" />
          <line x1="0" y1="40" x2="200" y2="0" stroke="#000" strokeWidth="0.5" />
        </svg>

        <div className="relative">
          <ScrollReveal direction="up">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#D6F04C]/20 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faComment} className="text-[#D6F04C] text-lg" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-black">Customer Reviews</h2>
                  <p className="text-sm text-black/40">
                    {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'} · {averageRating.toFixed(1)} ★ average
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to={`/products/${product._id}/reviews`}
                  className="text-sm text-[#D6F04C] hover:text-[#C5E043] font-medium flex items-center gap-1 transition-colors"
                >
                  View all
                  <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Review Summary */}
          {totalReviews > 0 && (
            <ScrollReveal direction="up" delay={100}>
              <div className="mb-8">
                <ReviewSummary summary={summary} />
              </div>
            </ScrollReveal>
          )}

          {/* Reviews List */}
          <ScrollReveal direction="up" delay={200}>
            {reviewsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-10 h-10 border-2 border-[#D6F04C] border-t-transparent rounded-full mx-auto"></div>
                <p className="text-sm text-black/40 mt-3">Loading reviews...</p>
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {reviews.slice(0, 5).map((review) => (
                  <ReviewCard
                    key={review._id}
                    review={review}
                    productId={product._id}
                    guestId={guestId}
                    onDelete={handleReviewAdded}
                    onEdit={(review) => {
                      setEditingReview(review)
                      setShowReviewForm(true)
                    }}
                  />
                ))}
                {reviews.length > 5 && (
                  <div className="text-center pt-4">
                    <Link
                      to={`/products/${product._id}/reviews`}
                      className="text-[#D6F04C] hover:text-[#C5E043] font-medium text-sm transition-colors inline-flex items-center gap-1"
                    >
                      View all {reviews.length} reviews
                      <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 bg-[#F4F6F2] rounded-2xl">
                {/* <div className="text-5xl mb-3">📝</div> */}
                <h4 className="font-semibold text-black text-lg mb-1">No Reviews Yet</h4>
                <p className="text-black/50 text-sm mb-4">
                  Be the first to review this product!
                </p>
              </div>
            )}
          </ScrollReveal>
        </div>
      </div>

      {/* ============================================ */}
      {/* FLOATING REVIEW BUTTON */}
      {/* ============================================ */}
      {!hasUserReviewed && !showReviewForm && (
        <button
          onClick={() => setShowReviewForm(true)}
          className="fixed bottom-8 right-8 z-50 bg-[#D6F04C] text-black px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-semibold hover:bg-[#C5E043] hover:-translate-y-0.5 group"
        >
          <FontAwesomeIcon icon={faPen} className="text-sm group-hover:rotate-12 transition-transform" />
          Write Review
        </button>
      )}

      {/* ============================================ */}
      {/* REVIEW FORM OVERLAY */}
      {/* ============================================ */}
      {showReviewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#D6F04C]/20 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faPen} className="text-[#D6F04C] text-sm" />
                </div>
                <div>
                  <h3 className="font-bold text-black text-lg">
                    {editingReview ? 'Edit Review' : 'Write a Review'}
                  </h3>
                  <p className="text-xs text-black/40">Share your experience with this product</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowReviewForm(false)
                  setEditingReview(null)
                }}
                className="w-10 h-10 rounded-full bg-[#F4F6F2] flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <FontAwesomeIcon icon={faXmark} className="text-black/60 text-xl" />
              </button>
            </div>
            <div className="p-6">
              <ReviewForm
                productId={product._id}
                guestId={guestId}
                guestName={guestName}
                onReviewAdded={handleReviewAdded}
                editingReview={editingReview}
                onCancelEdit={() => {
                  setEditingReview(null)
                  setShowReviewForm(false)
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetails
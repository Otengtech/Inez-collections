import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faShoppingBag,
  faHeart,
  faStar,
  faStarHalf,
  faEye,
  faClock,
  faTruck,
  faTag,
  faCheckCircle,
  faExclamationCircle,
  faInfoCircle,
  faComment,
  faSpinner,
  faChevronDown,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons'
import { addItemLocal } from '../../redux/slices/cartSlice'
import { toast } from 'react-toastify'
import api from '../../services/api'

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [productReviews, setProductReviews] = useState([])
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: {}
  })
  const [loadingReviews, setLoadingReviews] = useState(false)
  const [reviewError, setReviewError] = useState(false)
  const [showDescription, setShowDescription] = useState(false)

  const isOutOfStock = product.stock === 0
  const maxQuantity = product.stock || 0

  // Get current quantity of this product in cart
  const cartItems = useSelector((state) => state.cart.items || [])
  const existingCartItem = cartItems.find(item => item.productId === product._id)
  const currentCartQuantity = existingCartItem?.quantity || 0

  // Check if product is already in cart at max stock
  const isAtMaxStock = currentCartQuantity >= maxQuantity

  // Calculate discount percentage
  const discountPercentage = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0

  // Fetch reviews for this product
  useEffect(() => {
    const fetchReviews = async () => {
      if (!product._id) return

      setLoadingReviews(true)
      setReviewError(false)

      try {
        const response = await api.get(`/products/${product._id}/reviews`)

        if (response.data.success) {
          const reviews = response.data.reviews || []
          setProductReviews(reviews)

          const total = reviews.length

          if (total > 0) {
            const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0)
            const average = sum / total

            const distribution = {}
            reviews.forEach(r => {
              const rating = Math.floor(r.rating || 0)
              distribution[rating] = (distribution[rating] || 0) + 1
            })

            setReviewStats({
              averageRating: average,
              totalReviews: total,
              ratingDistribution: distribution
            })
          } else {
            setReviewStats({
              averageRating: 0,
              totalReviews: 0,
              ratingDistribution: {}
            })
          }
        } else {
          handleFallbackData()
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error)
        handleFallbackData()
      } finally {
        setLoadingReviews(false)
      }
    }

    const handleFallbackData = () => {
      if (product.ratings && product.ratings.length > 0) {
        const reviews = product.ratings
        const total = reviews.length
        const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0)
        const average = sum / total

        setReviewStats({
          averageRating: average,
          totalReviews: total,
          ratingDistribution: {}
        })
        setProductReviews(reviews)
      } else if (product.rating || product.numReviews) {
        setReviewStats({
          averageRating: product.rating || 0,
          totalReviews: product.numReviews || 0,
          ratingDistribution: {}
        })
      } else {
        setReviewStats({
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: {}
        })
        setReviewError(true)
      }
    }

    fetchReviews()
  }, [product._id, product.rating, product.numReviews, product.ratings])

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (isOutOfStock) {
      toast.error('This product is out of stock')
      return
    }

    if (isAtMaxStock) {
      toast.warning(`You already have all ${maxQuantity} available in your cart`)
      return
    }

    const remainingStock = maxQuantity - currentCartQuantity
    const quantityToAdd = Math.min(1, remainingStock)

    dispatch(addItemLocal({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '/placeholder.jpg',
      quantity: quantityToAdd,
      size: product.sizes?.[0] || '',
      color: product.colors?.[0] || '',
      stock: maxQuantity,
    }))

    if (remainingStock === 1) {
      toast.success(`Added last available ${product.name} to cart!`)
    } else {
      toast.success(`${product.name} added to cart! (${currentCartQuantity + 1}/${maxQuantity})`)
    }
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const savedWishlist = localStorage.getItem('wishlist')
    let wishlist = savedWishlist ? JSON.parse(savedWishlist) : []

    const exists = wishlist.some(item => item._id === product._id)

    if (exists) {
      wishlist = wishlist.filter(item => item._id !== product._id)
      setIsWishlisted(false)
      toast.success('Removed from wishlist')
    } else {
      wishlist.push(product)
      setIsWishlisted(true)
      toast.success('Added to wishlist')
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist))
  }

  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist')
    if (savedWishlist) {
      const wishlist = JSON.parse(savedWishlist)
      setIsWishlisted(wishlist.some(item => item._id === product._id))
    }
  }, [product._id])

  const renderStars = (rating) => {
    const stars = []
    const numRating = Number(rating) || 0
    for (let i = 1; i <= 5; i++) {
      if (i <= numRating) {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400 text-[10px] md:text-xs" />)
      } else if (i - 0.5 <= numRating) {
        stars.push(<FontAwesomeIcon key={i} icon={faStarHalf} className="text-yellow-400 text-[10px] md:text-xs" />)
      } else {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-gray-300 text-[10px] md:text-xs" />)
      }
    }
    return stars
  }

  // Truncate description
  const truncateDescription = (text, maxLength = 80) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  // Determine button state
  const getButtonState = () => {
    if (isOutOfStock) {
      return { label: 'Out of Stock', disabled: true, className: 'bg-gray-400 cursor-not-allowed' }
    }
    if (isAtMaxStock) {
      return { label: 'Max in Cart', disabled: true, className: 'bg-gray-400 cursor-not-allowed' }
    }
    if (maxQuantity <= 3) {
      return { label: `Only ${maxQuantity} left`, disabled: false, className: 'bg-[#D6F04C] hover:bg-[#C5E043]' }
    }
    return { label: 'Add to Cart', disabled: false, className: 'bg-[#D6F04C] hover:bg-[#C5E043]' }
  }

  const buttonState = getButtonState()

  // Get stock status
  const getStockStatus = () => {
    if (isOutOfStock) {
      return { label: 'Out of Stock', color: 'text-red-500', bg: 'bg-red-100' }
    }
    if (maxQuantity <= 3) {
      return { label: `Only ${maxQuantity} left`, color: 'text-orange-500', bg: 'bg-orange-100' }
    }
    if (maxQuantity <= 10) {
      return { label: `${maxQuantity} in stock`, color: 'text-yellow-500', bg: 'bg-yellow-100' }
    }
    return { label: 'In Stock', color: 'text-green-500', bg: 'bg-green-100' }
  }

  const stockStatus = getStockStatus()

  const displayRating = reviewStats.averageRating || 0
  const displayReviewCount = reviewStats.totalReviews || 0

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={`/products/${product._id}`}
        className=""
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image */}
        <div className="relative flex items-center justify-center aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.images?.[0] || '/placeholder.jpg'}
            alt={product.name}
            className="max-w-36 h-full object-contain transition-transform duration-500 group-hover:scale-110"
          />

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <span className="absolute top-3 left-3 px-2 md:px-3 py-0.5 md:py-1 bg-red-500 text-white text-[10px] md:text-xs rounded-full font-bold z-10">
              -{discountPercentage}%
            </span>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all z-10 ${isHovered ? 'opacity-100' : 'opacity-70'
              }`}
          >
            <FontAwesomeIcon
              icon={faHeart}
              className={`${isWishlisted ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition-colors text-sm md:text-base`}
            />
          </button>

          {/* Category Badge */}
          <span className="absolute bottom-3 left-3 px-2 md:px-3 py-0.5 md:py-1 bg-black/80 backdrop-blur-sm text-white text-[10px] md:text-xs rounded-full capitalize">
            {product.category}
          </span>

          {/* Quick Add Button */}
          <button
            onClick={handleAddToCart}
            disabled={buttonState.disabled || isOutOfStock || isAtMaxStock}
            className={`absolute bottom-3 right-3 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 z-10 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              } ${buttonState.className}`}
          >
            <FontAwesomeIcon
              icon={faShoppingBag}
              className={`text-sm md:text-base ${buttonState.disabled ? 'text-gray-500' : 'text-black'}`}
            />
          </button>

          {/* Low Stock Badge */}
          {!isOutOfStock && maxQuantity <= 3 && (
            <span className="absolute top-3 left-3 px-2 md:px-3 py-0.5 md:py-1 bg-orange-500 text-white text-[10px] md:text-xs rounded-full animate-pulse z-10">
              ⚡ Only {maxQuantity} left!
            </span>
          )}

          {/* Stock Status Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-bold text-sm md:text-base px-4 py-2 bg-red-500 rounded-full flex items-center gap-2">
                <FontAwesomeIcon icon={faExclamationCircle} />
                Out of Stock
              </span>
            </div>
          )}

          {/* Max in Cart Overlay */}
          {!isOutOfStock && isAtMaxStock && (
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-bold text-xs md:text-sm px-4 py-2 bg-[#D6F04C] text-black rounded-full flex items-center gap-2">
                <FontAwesomeIcon icon={faCheckCircle} />
                Max in Cart
              </span>
            </div>
          )}

          {/* Image Counter */}
          {product.images && product.images.length > 1 && (
            <span className="absolute bottom-3 left-1/2 transform -translate-x-1/2 px-2 py-0.5 bg-black/50 text-white text-[8px] md:text-[10px] rounded-full">
              +{product.images.length} images
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-3 md:p-4">
          <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1 text-sm md:text-base">
            {product.name}
          </h3>

          {/* Review Stars with count */}
          <div className="flex items-center gap-2 mb-2">
            {loadingReviews ? (
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin text-gray-400 text-xs" />
                <span className="text-gray-400 text-[10px] md:text-xs">Loading reviews...</span>
              </div>
            ) : reviewError ? (
              <span className="text-gray-400 text-[10px] md:text-xs">No reviews yet</span>
            ) : displayReviewCount > 0 ? (
              <>
                <div className="flex items-center gap-0.5">
                  {renderStars(displayRating)}
                </div>
                <span className="text-gray-400 text-[10px] md:text-xs flex items-center gap-1">
                  <FontAwesomeIcon icon={faComment} className="text-[8px] md:text-[10px]" />
                  ({displayReviewCount})
                </span>
              </>
            ) : (
              <span className="text-gray-400 text-[10px] md:text-xs">Be the first to review</span>
            )}
          </div>

          {/* Description Section */}
          {product.description && (
            <div className="mb-3">
              <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                {product.description}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[12px] md:text-xl font-bold text-[#D6F04C]">
                  ${Number(product.price).toFixed(2)}
                </span>
                {product.oldPrice && (
                  <span className="text-[10px] md:text-xs text-gray-400 line-through">
                    ${Number(product.oldPrice).toFixed(2)}
                  </span>
                )}
              </div>
              {discountPercentage > 0 && (
                <span className="text-[8px] md:text-[10px] text-green-500 font-medium">
                  Save {discountPercentage}%
                </span>
              )}
            </div>

            <div className="flex flex-col items-end">
              <span className={`text-[8px] md:text-xs font-medium ${stockStatus.color}`}>
                {stockStatus.label}
              </span>
              {currentCartQuantity > 0 && !isOutOfStock && (
                <span className="text-[8px] text-blue-500 font-medium">
                  {currentCartQuantity} in cart
                </span>
              )}
              {product.sizes && product.sizes.length > 0 && (
                <span className="text-[8px] text-gray-400">
                  {product.sizes.length} size{product.sizes.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div >
  )
}

export default ProductCard
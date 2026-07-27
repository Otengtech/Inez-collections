import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faHeart, 
  faShoppingBag, 
  faTrash, 
  faArrowLeft,
  faStar,
  faStarHalf,
  faCartPlus
} from '@fortawesome/free-solid-svg-icons'
import { addItemLocal } from '../redux/slices/cartSlice'
import { toast } from 'react-toastify'

const Wishlist = () => {
  const dispatch = useDispatch()
  const { items } = useSelector((state) => state.cart)
  
  // Wishlist items stored in localStorage
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(true)

  // Load wishlist from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist')
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist))
      } catch (e) {
        setWishlistItems([])
      }
    }
    setLoading(false)
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('wishlist', JSON.stringify(wishlistItems))
    }
  }, [wishlistItems, loading])

  const handleAddToCart = (product) => {
    dispatch(addItemLocal({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '/placeholder.jpg',
      quantity: 1,
    }))
    toast.success(`${product.name} added to cart!`)
  }

  const handleRemoveFromWishlist = (productId) => {
    setWishlistItems(prev => prev.filter(item => item._id !== productId))
    toast.success('Removed from wishlist')
  }

  const handleMoveAllToCart = () => {
    if (wishlistItems.length === 0) {
      toast.error('Your wishlist is empty')
      return
    }

    wishlistItems.forEach(product => {
      dispatch(addItemLocal({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '/placeholder.jpg',
        quantity: 1,
      }))
    })
    
    toast.success(`Added all ${wishlistItems.length} items to cart!`)
    setWishlistItems([])
  }

  const renderStars = (rating) => {
    const stars = []
    const numRating = Number(rating) || 0
    for (let i = 1; i <= 5; i++) {
      if (i <= numRating) {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400 text-xs" />)
      } else if (i - 0.5 <= numRating) {
        stars.push(<FontAwesomeIcon key={i} icon={faStarHalf} className="text-yellow-400 text-xs" />)
      } else {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-gray-300 text-xs" />)
      }
    }
    return stars
  }

  // Empty state
  if (!loading && wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 px-4 sm:px-6 lg:px-10 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FontAwesomeIcon icon={faHeart} className="text-4xl md:text-5xl text-pink-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">Your Wishlist is Empty</h2>
          <p className="text-gray-500 mb-8">
            Start saving your favorite items by clicking the heart icon on any product.
          </p>
          <Link 
            to="/products" 
            className="inline-flex items-center gap-2 bg-[#D6F04C] text-black px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold hover:bg-[#C5E043] transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
          >
            <FontAwesomeIcon icon={faShoppingBag} />
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6 lg:px-10">
      <div className="container-custom">
        {/* Header */}
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
              My <span className="text-[#D6F04C]">Wishlist</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {wishlistItems.length} item{wishlistItems.length > 1 ? 's' : ''} saved
            </p>
          </div>
          
          <div className="flex gap-3">
            {wishlistItems.length > 0 && (
              <button
                onClick={handleMoveAllToCart}
                className="flex items-center gap-2 px-4 py-2 bg-[#D6F04C] text-black rounded-lg hover:bg-[#C5E043] transition-all text-sm font-medium"
              >
                <FontAwesomeIcon icon={faCartPlus} />
                Move All to Cart
              </button>
            )}
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {wishlistItems.map((product) => (
            <div
              key={product._id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Image */}
              <Link to={`/products/${product._id}`} className="block relative aspect-square overflow-hidden bg-gray-100">
                <img
                  src={product.images?.[0] || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveFromWishlist(product._id)}
                  className="absolute top-3 right-3 w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:bg-red-50 group/remove"
                >
                  <FontAwesomeIcon 
                    icon={faTrash} 
                    className="text-gray-400 group-hover/remove:text-red-500 transition-colors text-sm md:text-base"
                  />
                </button>

                {/* Category Badge */}
                {product.category && (
                  <span className="absolute bottom-3 left-3 px-2 md:px-3 py-0.5 md:py-1 bg-black/80 backdrop-blur-sm text-white text-[10px] md:text-xs rounded-full">
                    {product.category}
                  </span>
                )}

                {/* In Stock Badge */}
                {product.stock > 0 ? (
                  <span className="absolute bottom-3 right-3 px-2 md:px-3 py-0.5 md:py-1 bg-green-500 text-white text-[10px] md:text-xs rounded-full">
                    In Stock
                  </span>
                ) : (
                  <span className="absolute bottom-3 right-3 px-2 md:px-3 py-0.5 md:py-1 bg-red-500 text-white text-[10px] md:text-xs rounded-full">
                    Out of Stock
                  </span>
                )}
              </Link>

              {/* Content */}
              <div className="p-3 md:p-4">
                <Link to={`/products/${product._id}`}>
                  <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1 text-sm md:text-base hover:text-[#D6F04C] transition-colors">
                    {product.name}
                  </h3>
                </Link>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-0.5">
                    {renderStars(product.rating || 0)}
                  </div>
                  <span className="text-gray-400 text-[10px] md:text-xs">
                    ({product.numReviews || product.ratings?.length || 0})
                  </span>
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-base md:text-xl font-bold text-[#D6F04C]">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all ${
                      product.stock === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-[#D6F04C] text-black hover:bg-[#C5E043] hover:shadow-lg hover:scale-110'
                    }`}
                  >
                    <FontAwesomeIcon icon={faShoppingBag} className="text-sm md:text-base" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Wishlist
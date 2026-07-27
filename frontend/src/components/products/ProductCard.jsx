import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingBag, faHeart, faStar, faStarHalf } from '@fortawesome/free-solid-svg-icons'
import { addItemLocal } from '../../redux/slices/cartSlice'
import { toast } from 'react-toastify'

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(addItemLocal({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '/placeholder.jpg',
      quantity: 1,
    }))
    toast.success(`${product.name} added to cart!`)
  }

  // In ProductCard component, update the wishlist button
  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()

    // Get current wishlist from localStorage
    const savedWishlist = localStorage.getItem('wishlist')
    let wishlist = savedWishlist ? JSON.parse(savedWishlist) : []

    // Check if product is already in wishlist
    const exists = wishlist.some(item => item._id === product._id)

    if (exists) {
      // Remove from wishlist
      wishlist = wishlist.filter(item => item._id !== product._id)
      setIsWishlisted(false)
      toast.success('Removed from wishlist')
    } else {
      // Add to wishlist
      wishlist.push(product)
      setIsWishlisted(true)
      toast.success('Added to wishlist')
    }

    // Save to localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
  }

  // Check if product is in wishlist on mount
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
        stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400 text-xs md:text-sm" />)
      } else if (i - 0.5 <= numRating) {
        stars.push(<FontAwesomeIcon key={i} icon={faStarHalf} className="text-yellow-400 text-xs md:text-sm" />)
      } else {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-gray-300 text-xs md:text-sm" />)
      }
    }
    return stars
  }

  return (
    <Link
      to={`/products/${product._id}`}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 block"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.images?.[0] || '/placeholder.jpg'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all z-10"
        >
          <FontAwesomeIcon
            icon={faHeart}
            className={`${isWishlisted ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition-colors text-sm md:text-base`}
          />
        </button>

        {/* Category Badge */}
        <span className="absolute bottom-3 left-3 px-2 md:px-3 py-0.5 md:py-1 bg-black/80 backdrop-blur-sm text-white text-[10px] md:text-xs rounded-full">
          {product.category}
        </span>

        {/* Quick Add Button */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 w-8 h-8 md:w-10 md:h-10 bg-[#D6F04C] rounded-full flex items-center justify-center shadow-lg transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#C5E043] z-10"
        >
          <FontAwesomeIcon icon={faShoppingBag} className="text-black text-sm md:text-base" />
        </button>

        {/* Stock Status Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-sm md:text-base px-3 py-1 bg-red-500 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 md:p-4">
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1 text-sm md:text-base">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-0.5">
            {renderStars(product.rating || 0)}
          </div>
          <span className="text-gray-400 text-[10px] md:text-xs">
            ({product.numReviews || product.ratings?.length || 0})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-base md:text-xl font-bold text-[#D6F04C]">
            ${Number(product.price).toFixed(2)}
          </span>
          {product.stock > 0 ? (
            <span className="text-[10px] md:text-xs text-green-500 font-medium">In Stock</span>
          ) : (
            <span className="text-[10px] md:text-xs text-red-500 font-medium">Out of Stock</span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
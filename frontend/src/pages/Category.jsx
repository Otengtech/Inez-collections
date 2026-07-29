import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faFilter,
  faList,
  faSort,
  faChevronDown,
  faChevronUp,
  faTimes,
  faStar,
  faStarHalf,
  faShoppingBag,
  faHeart,
} from '@fortawesome/free-solid-svg-icons'
import { fetchProducts, setFilters, clearFilters } from '../redux/slices/productSlice'
import ScrollReveal from '../components/common/ScrollReveal'
import Loader from '../components/common/Loader'
import { addItemLocal } from '../redux/slices/cartSlice'
import { toast } from 'react-toastify'

const CategoryPage = () => {
  const { categorySlug } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { products, loading, filters, pagination } = useSelector((state) => state.products)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [sortOpen, setSortOpen] = useState(false)
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [selectedSizes, setSelectedSizes] = useState([])
  const [selectedColors, setSelectedColors] = useState([])
  const [selectedRating, setSelectedRating] = useState(0)

  // Category mapping - ensures slug matches database category
  const categoryMap = {
    dresses: 'dresses',
    wigs: 'wigs',
    'lip-gloss': 'lip-gloss',
    sandals: 'sandals',
    slippers: 'slippers',
  }

  // Category info for display
  const categoryInfo = {
    dresses: {
      title: 'Dresses',
      description: 'Elegant dresses for every occasion',
      icon: '👗',
      bg: 'from-pink-400/20 to-rose-600/10',
    },
    wigs: {
      title: 'Wigs',
      description: 'Premium wigs for a stunning look',
      icon: '💇‍♀️',
      bg: 'from-purple-400/20 to-pink-600/10',
    },
    'lip-gloss': {
      title: 'Lip Gloss',
      description: 'Luxurious lip gloss for the perfect shine',
      icon: '💄',
      bg: 'from-red-400/20 to-pink-500/10',
    },
    sandals: {
      title: 'Sandals',
      description: 'Stylish sandals for every step',
      icon: '👡',
      bg: 'from-amber-400/20 to-orange-600/10',
    },
    slippers: {
      title: 'Slippers',
      description: 'Comfortable slippers for relaxation',
      icon: '🩴',
      bg: 'from-blue-400/20 to-indigo-600/10',
    },
  }

  // Get the correct category for API
  const category = categoryMap[categorySlug]
  const info = categoryInfo[categorySlug] || {
    title: categorySlug?.charAt(0).toUpperCase() + categorySlug?.slice(1) || 'Category',
    description: 'Explore our collection',
    icon: '🛍️',
    bg: 'from-gray-400/20 to-gray-600/10',
  }

  // Available filters
  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '35', '36', '37', '38', '39', '40', '41', '42']
  const allColors = ['Black', 'White', 'Gold', 'Pink', 'Red', 'Blue', 'Brown', 'Blonde', 'Clear', 'Purple']
  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: '-price', label: 'Price: High to Low' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-rating', label: 'Highest Rated' },
  ]

  // Fetch products when category changes
  useEffect(() => {
    console.log('🔍 CategoryPage: categorySlug =', categorySlug)
    console.log('🔍 CategoryPage: mapped category =', category)

    if (!categorySlug) {
      console.error('❌ CategoryPage: No category slug provided')
      navigate('/products')
      return
    }

    if (!category) {
      console.error('❌ CategoryPage: Invalid category -', categorySlug)
      toast.error(`Category "${categorySlug}" not found`)
      navigate('/products')
      return
    }

    // Clear previous state and fetch new products
    dispatch(clearFilters())
    dispatch(setFilters({ category }))
    dispatch(fetchProducts({ category, limit: 20 }))

    return () => {
      dispatch(clearFilters())
    }
  }, [dispatch, categorySlug, category, navigate])

  const handleApplyFilters = () => {
    const filterData = {
      category,
      ...(priceRange.min && { minPrice: priceRange.min }),
      ...(priceRange.max && { maxPrice: priceRange.max }),
      ...(selectedSizes.length > 0 && { size: selectedSizes.join(',') }),
      ...(selectedColors.length > 0 && { color: selectedColors.join(',') }),
      ...(selectedRating > 0 && { rating: selectedRating }),
    }
    dispatch(fetchProducts(filterData))
    setIsFilterOpen(false)
  }

  const handleClearFilters = () => {
    setPriceRange({ min: '', max: '' })
    setSelectedSizes([])
    setSelectedColors([])
    setSelectedRating(0)
    dispatch(fetchProducts({ category, limit: 20 }))
    setIsFilterOpen(false)
    toast.info('Filters cleared')
  }

  const handleSort = (value) => {
    dispatch(setFilters({ sort: value }))
    dispatch(fetchProducts({ category, ...filters, sort: value }))
    setSortOpen(false)
  }

  const handlePageChange = (page) => {
    dispatch(fetchProducts({ category, ...filters, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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

  // Show loading only on initial load
  if (loading && products.length === 0) {
    return (
      <div className="section-padding mt-20">
        <Loader />
      </div>
    )
  }

  // If category is invalid, show message (redirect happens in useEffect)
  if (!category) {
    return null
  }

  return (
    <section className="relative pt-28 pb-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-[2.5rem] bg-[#EDF1EC] p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] overflow-hidden">
          {/* Decorative elements */}
          <svg className="absolute -top-10 -right-10 w-72 h-72 opacity-[0.15] pointer-events-none" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#000" strokeWidth="0.5" />
            <line x1="0" y1="40" x2="200" y2="0" stroke="#000" strokeWidth="0.5" />
          </svg>

          {/* Category Header */}
          <div className={`relative bg-gradient-to-br ${info.bg} rounded-[2rem] p-6 sm:p-10 mb-6`}>
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="text-black/60" />
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{info.icon}</span>
                  <h1 className="text-2xl md:text-3xl font-bold text-black">{info.title}</h1>
                </div>
                <p className="text-black/50 text-sm mt-1">{info.description}</p>
              </div>
              <span className="ml-auto text-sm text-black/40 bg-white/60 px-3 py-1 rounded-full">
                {pagination?.total || products.length} products
              </span>
            </div>
          </div>

          {/* Toolbar */}
          <div className="relative flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-sm font-medium text-black/70"
              >
                <FontAwesomeIcon icon={faFilter} className="text-xs" />
                Filters
              </button>

              {/* View toggle */}
              <div className="hidden sm:flex bg-white rounded-full shadow-sm p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    viewMode === 'grid' ? 'bg-gold-100 text-gold-600' : 'text-black/40 hover:text-black/70'
                  }`}
                >
                  <FontAwesomeIcon icon={faStar} className="text-sm" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    viewMode === 'list' ? 'bg-gold-100 text-gold-600' : 'text-black/40 hover:text-black/70'
                  }`}
                >
                  <FontAwesomeIcon icon={faList} className="text-sm" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-sm font-medium text-black/70"
                >
                  <FontAwesomeIcon icon={faSort} className="text-xs" />
                  Sort
                  <FontAwesomeIcon icon={sortOpen ? faChevronUp : faChevronDown} className="text-[10px]" />
                </button>

                {sortOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleSort(option.value)}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          filters.sort === option.value
                            ? 'text-gold-600 bg-gold-50 font-medium'
                            : 'text-black/70 hover:bg-gray-50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          {isFilterOpen && (
            <div className="relative bg-white rounded-[1.75rem] p-6 mb-6 shadow-sm animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-black">Filters</h3>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="text-gray-400 hover:text-black transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-black/70 mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gold-600 text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gold-600 text-sm"
                    />
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <label className="block text-sm font-medium text-black/70 mb-2">Sizes</label>
                  <div className="flex flex-wrap gap-1.5">
                    {allSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          setSelectedSizes(prev =>
                            prev.includes(size)
                              ? prev.filter(s => s !== size)
                              : [...prev, size]
                          )
                        }}
                        className={`px-3 py-1 rounded-full text-xs transition-all ${
                          selectedSizes.includes(size)
                            ? 'bg-gold-600 text-white'
                            : 'bg-gray-100 text-black/60 hover:bg-gray-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <label className="block text-sm font-medium text-black/70 mb-2">Colors</label>
                  <div className="flex flex-wrap gap-1.5">
                    {allColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          setSelectedColors(prev =>
                            prev.includes(color)
                              ? prev.filter(c => c !== color)
                              : [...prev, color]
                          )
                        }}
                        className={`px-3 py-1 rounded-full text-xs transition-all ${
                          selectedColors.includes(color)
                            ? 'bg-gold-600 text-white'
                            : 'bg-gray-100 text-black/60 hover:bg-gray-200'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-black/70 mb-2">Rating</label>
                  <div className="flex gap-1.5">
                    {[0, 4, 3, 2, 1].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setSelectedRating(rating)}
                        className={`px-3 py-1 rounded-full text-xs transition-all ${
                          selectedRating === rating
                            ? 'bg-gold-600 text-white'
                            : 'bg-gray-100 text-black/60 hover:bg-gray-200'
                        }`}
                      >
                        {rating === 0 ? 'All' : `${rating}★`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={handleApplyFilters}
                  className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-black-800 transition-colors"
                >
                  Apply Filters
                </button>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2 border border-gray-300 rounded-full text-sm font-medium text-black/60 hover:bg-gray-50 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className={`grid ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            } gap-5`}>
              {products.map((product, index) => (
                <ScrollReveal key={`${product._id}-${index}-${products.length}`} direction="down" delay={(index % 4) * 100}>
                  {viewMode === 'grid' ? (
                    // Grid View
                    <div className="bg-white rounded-[1.75rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                      <Link to={`/products/${product._id}`} className="block relative overflow-hidden aspect-square">
                        <img
                          src={product.images?.[0] || '/placeholder.jpg'}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            handleAddToCart(product)
                          }}
                          className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gold-100"
                        >
                          <FontAwesomeIcon icon={faShoppingBag} className="text-black/60 text-sm" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            toast.info('Added to wishlist ❤️')
                          }}
                          className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-rose-50"
                        >
                          <FontAwesomeIcon icon={faHeart} className="text-rose-500 text-sm" />
                        </button>
                        {product.stock < 5 && product.stock > 0 && (
                          <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                            Low Stock
                          </span>
                        )}
                        {product.stock === 0 && (
                          <span className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">Out of Stock</span>
                          </span>
                        )}
                      </Link>
                      <div className="p-4">
                        <Link to={`/products/${product._id}`}>
                          <h3 className="font-semibold text-black hover:text-gold-600 transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-1 mt-1">
                          {renderStars(product.rating || 0)}
                          <span className="text-xs text-black/40 ml-1">({product.ratings?.length || 0})</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-bold gold-text">₵{product.price.toFixed(2)}</span>
                          <span className="text-xs capitalize bg-gray-100 px-2 py-0.5 rounded-full text-black/50">
                            {product.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // List View
                    <div className="bg-white rounded-[1.75rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                      <div className="flex flex-col sm:flex-row gap-4 p-4">
                        <Link to={`/products/${product._id}`} className="sm:w-48 h-48 flex-shrink-0 overflow-hidden rounded-xl">
                          <img
                            src={product.images?.[0] || '/placeholder.jpg'}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </Link>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <Link to={`/products/${product._id}`}>
                              <h3 className="font-semibold text-black hover:text-gold-600 transition-colors text-lg">
                                {product.name}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-1 mt-1">
                              {renderStars(product.rating || 0)}
                              <span className="text-xs text-black/40 ml-1">({product.ratings?.length || 0})</span>
                            </div>
                            <p className="text-sm text-black/50 mt-2 line-clamp-2">{product.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              <span className="text-xs capitalize bg-gray-100 px-2 py-0.5 rounded-full text-black/50">
                                {product.category}
                              </span>
                              {product.sizes?.slice(0, 3).map(size => (
                                <span key={size} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-black/50">
                                  {size}
                                </span>
                              ))}
                              {product.sizes?.length > 3 && (
                                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-black/50">
                                  +{product.sizes.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <span className="text-2xl font-bold gold-text">₵{product.price.toFixed(2)}</span>
                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={product.stock === 0}
                              className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                                product.stock > 0
                                  ? 'bg-black text-white hover:bg-black-800'
                                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              }`}
                            >
                              <FontAwesomeIcon icon={faShoppingBag} className="text-sm" />
                              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-[1.75rem]">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-black mb-2">No Products Found</h3>
              <p className="text-black/50 text-sm mb-6">Try adjusting your filters or search terms</p>
              <button
                onClick={handleClearFilters}
                className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-black-800 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 rounded-full bg-white shadow-sm hover:shadow-md transition-all disabled:opacity-50 text-sm font-medium text-black/70"
              >
                Previous
              </button>
              {[...Array(pagination.pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-10 h-10 rounded-full transition-all ${
                    pagination.page === i + 1
                      ? 'bg-gold-600 text-white shadow-md'
                      : 'bg-white text-black/70 hover:shadow-md'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 rounded-full bg-white shadow-sm hover:shadow-md transition-all disabled:opacity-50 text-sm font-medium text-black/70"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default CategoryPage
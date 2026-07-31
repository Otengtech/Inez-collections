import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { fetchProducts, setFilters, clearFilters } from '../redux/slices/productSlice'
import ProductGrid from '../components/products/ProductGrid'
import ProductFilters from '../components/products/ProductFilters'
import ScrollReveal from '../components/common/ScrollReveal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faSearch, 
  faFilter, 
  faTimes, 
  faSort,
  faSortAmountDown,
  faSortAmountUp,
  faThLarge,
  faThList,
  faCheck,
  faInfoCircle,
  faTag,
  faStar,
  faClock,
  faTruck,
  faShoppingBag,
  faEye,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons'

const Products = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { products, loading, filters, pagination, error } = useSelector((state) => state.products)
  const [searchInput, setSearchInput] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [sortOpen, setSortOpen] = useState(false)
  const [showStats, setShowStats] = useState(true)

  // Get filters from URL params on mount and when URL changes
  useEffect(() => {
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort')
    const page = searchParams.get('page')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const size = searchParams.get('size')
    const color = searchParams.get('color')
    const rating = searchParams.get('rating')
    
    const newFilters = {}
    
    if (category) {
      newFilters.category = category.toLowerCase()
    }
    if (search) {
      newFilters.search = search
      setSearchInput(search)
    }
    if (sort) newFilters.sort = sort
    if (page) newFilters.page = parseInt(page)
    if (minPrice) newFilters.minPrice = minPrice
    if (maxPrice) newFilters.maxPrice = maxPrice
    if (size) newFilters.size = size
    if (color) newFilters.color = color
    if (rating) newFilters.rating = rating
    
    if (Object.keys(newFilters).length > 0 || isInitialLoad) {
      if (!newFilters.sort && !filters.sort) {
        newFilters.sort = '-createdAt'
      }
      if (!newFilters.page) {
        newFilters.page = 1
      }
      dispatch(setFilters(newFilters))
      setIsInitialLoad(false)
    }
  }, [dispatch, searchParams, isInitialLoad])

  // Fetch products when filters change
  useEffect(() => {
    if (!filters || Object.keys(filters).length === 0) {
      return
    }

    const fetchData = async () => {
      try {
        const queryParams = {}
        Object.keys(filters).forEach(key => {
          if (filters[key] && filters[key] !== '' && key !== 'page') {
            queryParams[key] = filters[key]
          }
        })
        if (!queryParams.page) {
          queryParams.page = 1
        }
        if (!queryParams.sort) {
          queryParams.sort = '-createdAt'
        }
        
        console.log('🛒 Fetching products with params:', queryParams)
        await dispatch(fetchProducts(queryParams)).unwrap()
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }
    
    fetchData()
  }, [dispatch, filters.category, filters.search, filters.minPrice, filters.maxPrice, filters.size, filters.color, filters.sort, filters.page, filters.rating])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      dispatch(setFilters({ search: searchInput, page: 1 }))
      navigate(`/products?search=${encodeURIComponent(searchInput)}`)
    } else {
      dispatch(setFilters({ search: '', page: 1 }))
      navigate('/products')
    }
  }

  const handlePageChange = (page) => {
    dispatch(setFilters({ page }))
    const params = new URLSearchParams(searchParams)
    params.set('page', page)
    navigate(`/products?${params.toString()}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleClearFilters = () => {
    dispatch(clearFilters())
    setSearchInput('')
    navigate('/products')
  }

  const handleSortChange = (sortValue) => {
    dispatch(setFilters({ sort: sortValue, page: 1 }))
    const params = new URLSearchParams(searchParams)
    params.set('sort', sortValue)
    navigate(`/products?${params.toString()}`)
    setSortOpen(false)
  }

  const activeFilterCount = Object.keys(filters).filter(k => 
    filters[k] && k !== 'page' && k !== 'sort' && filters[k] !== '' && k !== 'limit'
  ).length

  const sortOptions = [
    { value: '-createdAt', label: 'Newest First', icon: faClock },
    { value: 'price', label: 'Price: Low to High', icon: faSortAmountUp },
    { value: '-price', label: 'Price: High to Low', icon: faSortAmountDown },
    { value: 'name', label: 'Name: A to Z', icon: faSort },
    { value: '-rating', label: 'Highest Rated', icon: faStar },
  ]

  const getSortLabel = () => {
    const option = sortOptions.find(o => o.value === filters.sort)
    return option ? option.label : 'Sort by'
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 px-4 sm:px-6 lg:px-10">
        <div className="container-custom">
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">Error loading products: {error}</p>
            <button 
              onClick={() => {
                dispatch(fetchProducts({ page: 1, sort: '-createdAt' }))
                navigate('/products')
              }}
              className="mt-4 px-6 py-2 bg-[#D6F04C] text-black rounded-full"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-10 px-4 sm:px-6 lg:px-10">
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsFilterOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-[#D6F04C] text-black px-5 md:px-6 py-2.5 md:py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-semibold text-sm md:text-base hover:bg-[#C5E043]"
      >
        <FontAwesomeIcon icon={faFilter} />
        Filters
        {activeFilterCount > 0 && (
          <span className="w-5 h-5 bg-black text-[#D6F04C] rounded-full text-xs flex items-center justify-center font-bold">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Mobile Filter Overlay */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] bg-white rounded-t-3xl p-4 md:p-6 overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl font-bold text-black">Filters</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="text-gray-600 text-sm md:text-base" />
              </button>
            </div>
            <ProductFilters mobile onClose={() => setIsFilterOpen(false)} />
            {activeFilterCount > 0 && (
              <button
                onClick={() => {
                  handleClearFilters()
                  setIsFilterOpen(false)
                }}
                className="w-full mt-2 text-sm text-gray-500 hover:text-[#D6F04C] transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      )}

      <div className="container-custom max-w-7xl mx-auto">
        {/* Header */}
        <ScrollReveal direction="up">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Our <span className="text-[#D6F04C]">Collection</span>
            </h1>
            <p className="text-black/60 max-w-2xl mx-auto">
              Explore our curated selection of premium fashion items
            </p>
          </div>
        </ScrollReveal>

        {/* Search and Controls */}
        <ScrollReveal direction="up" delay={100}>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search products by name, category, or keyword..."
                  className="w-full px-5 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:border-[#D6F04C] focus:ring-2 focus:ring-[#D6F04C]/30 transition-all shadow-sm pl-12"
                />
                <FontAwesomeIcon 
                  icon={faSearch} 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#D6F04C] text-black px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#C5E043] transition-colors"
                >
                  Search
                </button>
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput('')
                      dispatch(setFilters({ search: '', page: 1 }))
                      navigate('/products')
                    }}
                    className="absolute right-24 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FontAwesomeIcon icon={faTimes} className="text-sm" />
                  </button>
                )}
              </div>
            </form>

            {/* Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-full hover:border-[#D6F04C] transition-all shadow-sm text-sm font-medium text-gray-700"
                >
                  <FontAwesomeIcon icon={faSort} />
                  {getSortLabel()}
                  <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-30 animate-fade-in">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleSortChange(option.value)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#F4F6F2] transition-colors text-left"
                      >
                        <FontAwesomeIcon icon={option.icon} className="text-gray-400 text-xs" />
                        {option.label}
                        {filters.sort === option.value && (
                          <FontAwesomeIcon icon={faCheck} className="ml-auto text-[#D6F04C] text-xs" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-white border border-gray-200 rounded-full overflow-hidden shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-[#D6F04C] text-black' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <FontAwesomeIcon icon={faThLarge} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-[#D6F04C] text-black' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <FontAwesomeIcon icon={faThList} />
                </button>
              </div>

              {/* Stats Toggle */}
              <button
                onClick={() => setShowStats(!showStats)}
                className="px-3 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FontAwesomeIcon icon={faInfoCircle} />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Stats Bar */}
        {showStats && (
          <ScrollReveal direction="up" delay={150}>
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-2xl px-4 py-3 mb-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 text-sm">
                <span className="font-medium text-gray-700">
                  {pagination?.total || 0} Products
                </span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500">
                  Showing {products.length} items
                </span>
                {activeFilterCount > 0 && (
                  <>
                    <span className="text-gray-300">|</span>
                    <span className="text-[#D6F04C] font-medium">
                      {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-3">
                {activeFilterCount > 0 && (
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
                  >
                    <FontAwesomeIcon icon={faTimes} className="text-xs" />
                    Clear all
                  </button>
                )}
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <FontAwesomeIcon icon={faEye} />
                  <span>View: {viewMode === 'grid' ? 'Grid' : 'List'}</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block sticky top-28 w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <ProductFilters />
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 min-w-0 w-full">
            <ProductGrid 
              products={products} 
              loading={loading} 
              columns={viewMode === 'grid' ? 4 : 1} 
              viewMode={viewMode}
            />
            
            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pb-8">
                <div className="text-sm text-gray-500">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} products
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      pagination.page === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    Previous
                  </button>
                  {[...Array(Math.min(pagination.pages, 5))].map((_, i) => {
                    let pageNum
                    if (pagination.pages <= 5) {
                      pageNum = i + 1
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1
                    } else if (pagination.page >= pagination.pages - 2) {
                      pageNum = pagination.pages - 4 + i
                    } else {
                      pageNum = pagination.page - 2 + i
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-lg transition-all ${
                          pagination.page === pageNum
                            ? 'bg-[#D6F04C] text-black shadow-md'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      pagination.page === pagination.pages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products
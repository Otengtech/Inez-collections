import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { fetchProducts, setFilters, clearFilters } from '../redux/slices/productSlice'
import ProductGrid from '../components/products/ProductGrid'
import ProductFilters from '../components/products/ProductFilters'
import ScrollReveal from '../components/common/ScrollReveal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faFilter, faTimes } from '@fortawesome/free-solid-svg-icons'

const Products = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { products, loading, filters, pagination, error } = useSelector((state) => state.products)
  const [searchInput, setSearchInput] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

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
    
    // ✅ Convert category to lowercase for API
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
    
    // Only update if there are filters or it's the initial load
    if (Object.keys(newFilters).length > 0 || isInitialLoad) {
      // Set default sort if not provided
      if (!newFilters.sort && !filters.sort) {
        newFilters.sort = '-createdAt'
      }
      // Set default page if not provided
      if (!newFilters.page) {
        newFilters.page = 1
      }
      dispatch(setFilters(newFilters))
      setIsInitialLoad(false)
    }
  }, [dispatch, searchParams, isInitialLoad])

  // Fetch products when filters change
  useEffect(() => {
    // Skip initial fetch if no filters are set
    if (!filters || Object.keys(filters).length === 0) {
      return
    }

    const fetchData = async () => {
      try {
        // Build query params
        const queryParams = {}
        Object.keys(filters).forEach(key => {
          if (filters[key] && filters[key] !== '' && key !== 'page') {
            queryParams[key] = filters[key]
          }
        })
        // Add page if not present
        if (!queryParams.page) {
          queryParams.page = 1
        }
        // Add sort if not present
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

  const activeFilterCount = Object.keys(filters).filter(k => 
    filters[k] && k !== 'page' && k !== 'sort' && filters[k] !== '' && k !== 'limit'
  ).length

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

      <div className="container-custom">
        {/* Header */}
        <ScrollReveal direction="up">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Our <span className="text-[#D6F04C]">Collection</span>
            </h1>
            <p className="text-black/60 max-w-2xl mx-auto">
              Explore our curated selection of premium fashion items
            </p>
            {activeFilterCount > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
              </p>
            )}
          </div>
        </ScrollReveal>

        {/* Search Bar */}
        <ScrollReveal direction="up" delay={100}>
          <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="w-full px-5 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:border-[#D6F04C] focus:ring-2 focus:ring-[#D6F04C]/30 transition-all shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#D6F04C] transition-colors"
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('')
                    dispatch(setFilters({ search: '', page: 1 }))
                    navigate('/products')
                  }}
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-sm" />
                </button>
              )}
            </div>
          </form>
        </ScrollReveal>

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
            <ProductGrid products={products} loading={loading} columns={3} />
            
            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8 pb-8 flex-wrap">
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
                  const pageNum = i + 1
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
                {pagination.pages > 5 && (
                  <span className="flex items-center px-2 text-gray-400">...</span>
                )}
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products
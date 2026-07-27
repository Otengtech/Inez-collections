import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFilters, clearFilters } from '../../redux/slices/productSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faChevronDown, 
  faChevronUp,
  faSlidersH,
  faTag,
  faRuler,
  faPalette,
  faSort
} from '@fortawesome/free-solid-svg-icons'

const ProductFilters = ({ mobile, onClose }) => {
  const dispatch = useDispatch()
  const { filters } = useSelector((state) => state.products)
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    size: true,
    color: true,
    sort: true,
  })

  // ✅ Use lowercase categories to match database
  const categories = ['All', 'dresses', 'wigs', 'lip-gloss', 'sandals', 'slippers']
  const sizes = ['All', 'XS', 'S', 'M', 'L', 'XL', '35', '36', '37', '38', '39', '40']
  const colors = ['All', 'Black', 'White', 'Gold', 'Pink', 'Red', 'Blue', 'Brown', 'Blonde']
  const sortOptions = [
    { value: '-createdAt', label: 'Newest' },
    { value: 'createdAt', label: 'Oldest' },
    { value: '-price', label: 'Price: High to Low' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-rating', label: 'Highest Rated' },
  ]

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value === 'All' ? '' : value }))
  }

  const handleClearFilters = () => {
    dispatch(clearFilters())
    if (mobile && onClose) {
      onClose()
    }
  }

  const activeFilterCount = Object.keys(filters).filter(k => 
    filters[k] && k !== 'page' && k !== 'sort' && filters[k] !== ''
  ).length

  // Format category name for display
  const formatCategoryName = (cat) => {
    if (cat === 'All') return 'All'
    if (cat === 'lip-gloss') return 'Lip Gloss'
    return cat.charAt(0).toUpperCase() + cat.slice(1)
  }

  return (
    <div className="space-y-1 md:space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 md:mb-4 pb-3 md:pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faSlidersH} className="text-[#D6F04C] text-sm md:text-base" />
          <span className="font-bold text-gray-800 text-sm md:text-base">Filters</span>
          {activeFilterCount > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-[#D6F04C]/20 text-[#D6F04C] text-xs rounded-full font-semibold">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={handleClearFilters}
            className="text-xs md:text-sm text-[#D6F04C] hover:text-[#C5E043] font-medium transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Category */}
      <div className="border-b border-gray-100 last:border-0 py-3 md:py-4">
        <button
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between text-left font-semibold text-gray-800 hover:text-[#D6F04C] transition-colors group"
        >
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faTag} className="text-gray-400 group-hover:text-[#D6F04C] text-sm" />
            <span className="text-sm md:text-base">Category</span>
          </div>
          <FontAwesomeIcon 
            icon={expandedSections.category ? faChevronUp : faChevronDown} 
            className="text-gray-400 text-xs md:text-sm"
          />
        </button>
        {expandedSections.category && (
          <div className="mt-2 md:mt-3">
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleFilterChange('category', cat)}
                  className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
                    (filters.category || 'All') === cat
                      ? 'bg-[#D6F04C] text-black shadow-md scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {formatCategoryName(cat)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="border-b border-gray-100 last:border-0 py-3 md:py-4">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between text-left font-semibold text-gray-800 hover:text-[#D6F04C] transition-colors group"
        >
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faTag} className="text-gray-400 group-hover:text-[#D6F04C] text-sm" />
            <span className="text-sm md:text-base">Price Range</span>
          </div>
          <FontAwesomeIcon 
            icon={expandedSections.price ? faChevronUp : faChevronDown} 
            className="text-gray-400 text-xs md:text-sm"
          />
        </button>
        {expandedSections.price && (
          <div className="mt-2 md:mt-3">
            <div className="flex gap-2 md:gap-3">
              <div className="flex-1">
                <label className="text-[10px] md:text-xs text-gray-500 block mb-1">Min</label>
                <input
                  type="number"
                  placeholder="$0"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D6F04C] focus:ring-2 focus:ring-[#D6F04C]/30 transition-all text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] md:text-xs text-gray-500 block mb-1">Max</label>
                <input
                  type="number"
                  placeholder="$1000"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D6F04C] focus:ring-2 focus:ring-[#D6F04C]/30 transition-all text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Size */}
      <div className="border-b border-gray-100 last:border-0 py-3 md:py-4">
        <button
          onClick={() => toggleSection('size')}
          className="w-full flex items-center justify-between text-left font-semibold text-gray-800 hover:text-[#D6F04C] transition-colors group"
        >
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faRuler} className="text-gray-400 group-hover:text-[#D6F04C] text-sm" />
            <span className="text-sm md:text-base">Size</span>
          </div>
          <FontAwesomeIcon 
            icon={expandedSections.size ? faChevronUp : faChevronDown} 
            className="text-gray-400 text-xs md:text-sm"
          />
        </button>
        {expandedSections.size && (
          <div className="mt-2 md:mt-3">
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleFilterChange('size', size)}
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-lg text-xs md:text-sm font-medium transition-all ${
                    (filters.size || 'All') === size
                      ? 'bg-[#D6F04C] text-black shadow-md scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Color */}
      <div className="border-b border-gray-100 last:border-0 py-3 md:py-4">
        <button
          onClick={() => toggleSection('color')}
          className="w-full flex items-center justify-between text-left font-semibold text-gray-800 hover:text-[#D6F04C] transition-colors group"
        >
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faPalette} className="text-gray-400 group-hover:text-[#D6F04C] text-sm" />
            <span className="text-sm md:text-base">Color</span>
          </div>
          <FontAwesomeIcon 
            icon={expandedSections.color ? faChevronUp : faChevronDown} 
            className="text-gray-400 text-xs md:text-sm"
          />
        </button>
        {expandedSections.color && (
          <div className="mt-2 md:mt-3">
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleFilterChange('color', color)}
                  className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
                    (filters.color || 'All') === color
                      ? 'bg-[#D6F04C] text-black shadow-md scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sort */}
      <div className="border-b border-gray-100 last:border-0 py-3 md:py-4">
        <button
          onClick={() => toggleSection('sort')}
          className="w-full flex items-center justify-between text-left font-semibold text-gray-800 hover:text-[#D6F04C] transition-colors group"
        >
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faSort} className="text-gray-400 group-hover:text-[#D6F04C] text-sm" />
            <span className="text-sm md:text-base">Sort By</span>
          </div>
          <FontAwesomeIcon 
            icon={expandedSections.sort ? faChevronUp : faChevronDown} 
            className="text-gray-400 text-xs md:text-sm"
          />
        </button>
        {expandedSections.sort && (
          <div className="mt-2 md:mt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 md:gap-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange('sort', option.value)}
                  className={`text-left px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                    (filters.sort || '-createdAt') === option.value
                      ? 'bg-[#D6F04C]/10 text-[#D6F04C] border border-[#D6F04C]/30'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Apply Button */}
      {mobile && (
        <button
          onClick={onClose}
          className="w-full bg-[#D6F04C] text-black py-2.5 md:py-3 rounded-full font-semibold hover:bg-[#C5E043] transition-colors mt-4 md:mt-6 text-sm md:text-base"
        >
          Apply Filters
        </button>
      )}
    </div>
  )
}

export default ProductFilters
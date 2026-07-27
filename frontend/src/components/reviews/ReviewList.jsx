import React, { useState } from 'react'
import ReviewCard from './ReviewCard'
import Loader from '../common/Loader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort, faFilter, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'

const ReviewList = ({ 
  reviews, 
  productId, 
  guestId, 
  loading, 
  pagination,
  onPageChange,
  onDelete,
  onEdit,
  showFilters = true 
}) => {
  const [sortBy, setSortBy] = useState('newest')
  const [filterRating, setFilterRating] = useState(0)
  const [showSortMenu, setShowSortMenu] = useState(false)

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'highest', label: 'Highest Rating' },
    { value: 'lowest', label: 'Lowest Rating' },
    { value: 'helpful', label: 'Most Helpful' },
  ]

  const getSortedReviews = () => {
    const sorted = [...reviews]
    
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      case 'highest':
        return sorted.sort((a, b) => b.rating - a.rating)
      case 'lowest':
        return sorted.sort((a, b) => a.rating - b.rating)
      case 'helpful':
        return sorted.sort((a, b) => (b.helpful || 0) - (a.helpful || 0))
      default:
        return sorted
    }
  }

  const getFilteredReviews = () => {
    if (filterRating === 0) return getSortedReviews()
    return getSortedReviews().filter(r => r.rating === filterRating)
  }

  const filteredReviews = getFilteredReviews()

  if (loading) {
    return <Loader />
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-[#F4F6F2] rounded-xl">
        <div className="text-4xl mb-3">📝</div>
        <h4 className="font-semibold text-black mb-1">No Reviews Yet</h4>
        <p className="text-black/50 text-sm">
          Be the first to review this product!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-sm text-black/50 flex items-center gap-1">
              <FontAwesomeIcon icon={faFilter} className="text-xs" />
              Filter:
            </span>
            <div className="flex gap-1">
              {[0, 5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setFilterRating(rating)}
                  className={`px-3 py-1 rounded-full text-xs transition-all ${
                    filterRating === rating
                      ? 'bg-gold-600 text-white'
                      : 'bg-[#F4F6F2] text-black/60 hover:bg-gold-100'
                  }`}
                >
                  {rating === 0 ? 'All' : `${rating}★`}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-[#F4F6F2] rounded-xl text-sm text-black/70 hover:bg-gold-100 transition-colors"
            >
              <FontAwesomeIcon icon={faSort} className="text-xs" />
              {sortOptions.find(opt => opt.value === sortBy)?.label || 'Sort'}
              <FontAwesomeIcon icon={showSortMenu ? faChevronUp : faChevronDown} className="text-xs" />
            </button>

            {showSortMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[160px] z-10">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value)
                      setShowSortMenu(false)
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      sortBy === option.value
                        ? 'text-gold-600 bg-gold-50 font-medium'
                        : 'text-black/70 hover:bg-gold-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Review Count */}
      <div className="text-sm text-black/40">
        Showing {filteredReviews.length} of {reviews.length} reviews
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <ReviewCard
            key={review._id}
            review={review}
            productId={productId}
            guestId={guestId}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center gap-2 pt-4 border-t border-gray-100">
          {[...Array(pagination.pages)].map((_, i) => (
            <button
              key={i}
              onClick={() => onPageChange && onPageChange(i + 1)}
              className={`w-10 h-10 rounded-lg transition-all ${
                pagination.page === i + 1
                  ? 'bg-gold-600 text-white shadow-md'
                  : 'bg-[#F4F6F2] text-black/60 hover:bg-gold-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ReviewList
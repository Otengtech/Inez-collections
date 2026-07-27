import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchReviews, clearReviews } from '../redux/slices/reviewSlice'
import { fetchProductById, clearCurrentProduct } from '../redux/slices/productSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faArrowLeft, 
  faStar, 
  faStarHalf,
  faThumbsUp,
  faShare,
  faFlag,
  faFilter,
  faSort,
  faChevronDown,
  faChevronUp,
  faPen,
  faXmark,
  faComment
} from '@fortawesome/free-solid-svg-icons'
import ReviewCard from '../components/reviews/ReviewCard'
import ReviewSummary from '../components/reviews/ReviewSummary'
import ReviewForm from '../components/reviews/ReviewForm'
import ReviewStats from '../components/reviews/ReviewStats'
import Loader from '../components/common/Loader'
import ScrollReveal from '../components/common/ScrollReveal'

const Reviews = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [filterRating, setFilterRating] = useState(0)
  const [sortBy, setSortBy] = useState('newest')
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [editingReview, setEditingReview] = useState(null)

  const { reviews, summary, pagination, loading: reviewsLoading } = useSelector((state) => state.reviews)
  const { currentProduct, loading: productLoading } = useSelector((state) => state.products)
  const { guestId } = useSelector((state) => state.cart)
  const [guestName, setGuestName] = useState('')

  useEffect(() => {
    const storedName = localStorage.getItem('guestName')
    if (storedName) {
      setGuestName(storedName)
    } else {
      const name = 'Guest_' + Math.random().toString(36).substring(2, 8)
      localStorage.setItem('guestName', name)
      setGuestName(name)
    }

    dispatch(fetchProductById(productId))
    dispatch(fetchReviews({ productId, page: 1, limit: 20 }))

    return () => {
      dispatch(clearCurrentProduct())
      dispatch(clearReviews())
    }
  }, [dispatch, productId])

  const handlePageChange = (page) => {
    dispatch(fetchReviews({ productId, page, limit: 20 }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleReviewAdded = () => {
    dispatch(fetchReviews({ productId, page: 1, limit: 20 }))
    setShowReviewForm(false)
    setEditingReview(null)
  }

  const handleEditReview = (review) => {
    setEditingReview(review)
    setShowReviewForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingReview(null)
    setShowReviewForm(false)
  }

  const getFilteredAndSortedReviews = () => {
    let filtered = [...reviews]
    
    if (filterRating > 0) {
      filtered = filtered.filter(r => r.rating === filterRating)
    }
    
    switch (sortBy) {
      case 'newest':
        return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      case 'oldest':
        return filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      case 'highest':
        return filtered.sort((a, b) => b.rating - a.rating)
      case 'lowest':
        return filtered.sort((a, b) => a.rating - b.rating)
      case 'helpful':
        return filtered.sort((a, b) => (b.helpful || 0) - (a.helpful || 0))
      default:
        return filtered
    }
  }

  const filteredReviews = getFilteredAndSortedReviews()

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'highest', label: 'Highest Rating' },
    { value: 'lowest', label: 'Lowest Rating' },
    { value: 'helpful', label: 'Most Helpful' },
  ]

  const hasUserReviewed = reviews.some(r => r.guestId === guestId)

  if (productLoading || reviewsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (!currentProduct) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 px-4 sm:px-6 lg:px-10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Product not found</p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-[#D6F04C] text-black px-6 py-3 rounded-full font-semibold hover:bg-[#C5E043] transition-colors">
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 px-4 sm:px-6 lg:px-10 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* ============================================ */}
        {/* HEADER */}
        {/* ============================================ */}
        <ScrollReveal direction="up">
          <div className="relative bg-white rounded-[2.5rem] p-4 sm:p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
            <svg className="absolute -top-10 -right-10 w-72 h-72 opacity-[0.08] pointer-events-none" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="80" fill="none" stroke="#000" strokeWidth="0.5" />
              <line x1="0" y1="40" x2="200" y2="0" stroke="#000" strokeWidth="0.5" />
            </svg>

            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="w-10 h-10 rounded-full bg-[#F4F6F2] flex items-center justify-center hover:bg-[#D6F04C]/20 transition-colors"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="text-black/60" />
                </button>
                <div>
                  <Link 
                    to={`/products/${productId}`}
                    className="hover:text-[#D6F04C] transition-colors"
                  >
                    <h1 className="text-xl md:text-2xl font-bold text-black">
                      {currentProduct.name}
                    </h1>
                  </Link>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FontAwesomeIcon
                          key={star}
                          icon={star <= Math.floor(currentProduct.averageRating || 0) ? faStar : faStar}
                          className={`text-sm ${
                            star <= Math.floor(currentProduct.averageRating || 0)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-black/50">
                      {currentProduct.averageRating || 0} ★ ({currentProduct.totalReviews || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {!hasUserReviewed && (
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                    showReviewForm 
                      ? 'bg-gray-200 text-black hover:bg-gray-300' 
                      : 'bg-[#D6F04C] text-black hover:bg-[#C5E043] hover:shadow-lg hover:-translate-y-0.5'
                  }`}
                >
                  <FontAwesomeIcon icon={showReviewForm ? faXmark : faPen} />
                  {showReviewForm ? 'Cancel' : 'Write a Review'}
                </button>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* ============================================ */}
        {/* REVIEW FORM */}
        {/* ============================================ */}
        {showReviewForm && (
          <ScrollReveal direction="up" delay={100}>
            <div className="mt-6 bg-white rounded-[2.5rem] p-4 sm:p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
              <ReviewForm
                productId={productId}
                guestId={guestId}
                guestName={guestName}
                onReviewAdded={handleReviewAdded}
                editingReview={editingReview}
                onCancelEdit={handleCancelEdit}
              />
            </div>
          </ScrollReveal>
        )}

        

        {/* ============================================ */}
        {/* FILTERS & SORT */}
        {/* ============================================ */}
        <ScrollReveal direction="up" delay={250}>
          <div className="mt-6 bg-white rounded-[2.5rem] p-4 z-40 sm:p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-black/50 flex items-center gap-1">
                  <FontAwesomeIcon icon={faFilter} className="text-xs" />
                  Filter:
                </span>
                <div className="flex gap-1">
                  {[0, 5, 4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setFilterRating(rating)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        filterRating === rating
                          ? 'bg-[#D6F04C] text-black shadow-md'
                          : 'bg-[#F4F6F2] text-black/60 hover:bg-[#D6F04C]/20'
                      }`}
                    >
                      {rating === 0 ? 'All' : `${rating}★`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative w-full sm:w-auto">
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="flex items-center justify-between gap-2 w-full sm:w-auto px-4 py-2 bg-[#F4F6F2] rounded-xl text-sm text-black/70 hover:bg-[#D6F04C]/20 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faSort} className="text-xs" />
                    {sortOptions.find(opt => opt.value === sortBy)?.label || 'Sort'}
                  </span>
                  <FontAwesomeIcon icon={showSortMenu ? faChevronUp : faChevronDown} className="text-xs" />
                </button>

                {showSortMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[180px] z-10 animate-fade-in">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value)
                          setShowSortMenu(false)
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          sortBy === option.value
                            ? 'text-[#D6F04C] bg-[#D6F04C]/10 font-medium'
                            : 'text-black/70 hover:bg-[#F4F6F2]'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="text-sm text-black/40 mt-4 pt-4 border-t border-gray-100">
              Showing {filteredReviews.length} of {reviews.length} reviews
            </div>
          </div>
        </ScrollReveal>

        {/* ============================================ */}
        {/* REVIEWS LIST */}
        {/* ============================================ */}
        <ScrollReveal direction="up" delay={300}>
          <div className="mt-6 bg-white rounded-[2.5rem] p-4 sm:p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
            {filteredReviews.length > 0 ? (
              <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredReviews.map((review) => (
                  <ReviewCard
                    key={review._id}
                    review={review}
                    productId={productId}
                    guestId={guestId}
                    onDelete={handleReviewAdded}
                    onEdit={handleEditReview}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-[#F4F6F2] rounded-full flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={faComment} className="text-3xl text-black/20" />
                </div>
                <h4 className="font-semibold text-black text-lg mb-1">No Reviews Found</h4>
                <p className="text-black/50 text-sm mb-4">
                  {filterRating > 0 
                    ? `No ${filterRating}-star reviews yet` 
                    : 'Be the first to review this product!'}
                </p>
                {filterRating > 0 && (
                  <button
                    onClick={() => setFilterRating(0)}
                    className="text-[#D6F04C] hover:text-[#C5E043] text-sm font-medium transition-colors"
                  >
                    Show all reviews
                  </button>
                )}
                {!hasUserReviewed && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="mt-4 bg-[#D6F04C] text-black px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#C5E043] transition-colors"
                  >
                    Write a Review
                  </button>
                )}
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* ============================================ */}
        {/* PAGINATION */}
        {/* ============================================ */}
        {pagination && pagination.pages > 1 && (
          <ScrollReveal direction="up" delay={350}>
            <div className="mt-6 flex justify-center gap-2 flex-wrap">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 rounded-xl bg-[#F4F6F2] text-black/60 hover:bg-[#D6F04C]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                Previous
              </button>
              {[...Array(pagination.pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                    pagination.page === i + 1
                      ? 'bg-[#D6F04C] text-black shadow-md'
                      : 'bg-[#F4F6F2] text-black/60 hover:bg-[#D6F04C]/20'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 rounded-xl bg-[#F4F6F2] text-black/60 hover:bg-[#D6F04C]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                Next
              </button>
            </div>
          </ScrollReveal>
        )}

        {/* ============================================ */}
        {/* BACK TO PRODUCT */}
        {/* ============================================ */}
        <ScrollReveal direction="up" delay={400}>
          <div className="mt-6 text-center">
            <Link
              to={`/products/${productId}`}
              className="inline-flex items-center gap-2 text-black/40 hover:text-[#D6F04C] transition-colors text-sm"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Back to Product
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}

export default Reviews
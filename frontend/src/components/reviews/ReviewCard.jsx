import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faStar, 
  faStarHalf,
  faThumbsUp,
  faUser,
  faClock,
  faFlag,
  faTrash,
  faEdit,
  faCheckCircle,
  faImage
} from '@fortawesome/free-solid-svg-icons'
import { faThumbsUp as faThumbsUpRegular } from '@fortawesome/free-regular-svg-icons'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { markReviewHelpful, deleteReview } from '../../redux/slices/reviewSlice'

const ReviewCard = ({ 
  review, 
  productId, 
  guestId, 
  onDelete,
  onEdit,
  showActions = true 
}) => {
  const dispatch = useDispatch()
  const [isHelpful, setIsHelpful] = useState(false)
  const [helpfulCount, setHelpfulCount] = useState(review.helpful || 0)
  const [loading, setLoading] = useState(false)
  const [showFullComment, setShowFullComment] = useState(false)

  const isAuthor = review.guestId === guestId
  const isLongComment = review.comment?.length > 200

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400 text-xs" />)
      } else if (i - 0.5 <= rating) {
        stars.push(<FontAwesomeIcon key={i} icon={faStarHalf} className="text-yellow-400 text-xs" />)
      } else {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-gray-300 text-xs" />)
      }
    }
    return stars
  }

  const getInitials = (name) => {
    if (!name) return '?'
    // If name is like "Guest_5pkwk1", show "👤" instead
    if (name.toLowerCase().includes('guest')) {
      return '👤'
    }
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const getDisplayName = (name) => {
    if (!name) return 'Anonymous'
    // If name is like "Guest_5pkwk1", show as "Guest"
    if (name.toLowerCase().includes('guest')) {
      return 'Guest'
    }
    return name
  }

  const getRandomColor = (name) => {
    const colors = [
      'bg-pink-500', 'bg-purple-500', 'bg-blue-500', 
      'bg-green-500', 'bg-yellow-500', 'bg-red-500',
      'bg-indigo-500', 'bg-teal-500', 'bg-orange-500'
    ]
    const index = name?.length % colors.length || 0
    return colors[index]
  }

  const formatDate = (date) => {
    const now = new Date()
    const reviewDate = new Date(date)
    const diffTime = Math.abs(now - reviewDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  const handleHelpful = async () => {
    if (isHelpful) return
    setLoading(true)
    try {
      const result = await dispatch(markReviewHelpful({ 
        productId, 
        reviewId: review._id, 
        guestId 
      })).unwrap()
      
      setHelpfulCount(result.data.helpful)
      setIsHelpful(true)
    } catch (error) {
      // Error handled in slice
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setLoading(true)
      try {
        await dispatch(deleteReview({ 
          productId, 
          reviewId: review._id, 
          guestId 
        })).unwrap()
        if (onDelete) onDelete(review._id)
      } catch (error) {
        // Error handled in slice
      } finally {
        setLoading(false)
      }
    }
  }

  const handleEdit = () => {
    if (onEdit) onEdit(review)
  }

  const displayName = getDisplayName(review.guestName)
  const initials = getInitials(review.guestName)
  const isGuest = review.guestName?.toLowerCase().includes('guest')

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {isGuest ? (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center flex-shrink-0 text-gray-500 text-lg">
              👤
            </div>
          ) : (
            <div className={`w-10 h-10 rounded-full ${getRandomColor(review.guestName)} flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm`}>
              {initials}
            </div>
          )}
          
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-800 text-sm">
                {displayName}
              </h4>
              {review.isVerified && (
                <span className="flex items-center gap-0.5 text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-medium">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-[8px]" />
                  Verified
                </span>
              )}
              {isGuest && (
                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                  Guest
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex items-center gap-0.5">
                {renderStars(review.rating)}
              </div>
              <span className="text-[10px] text-gray-400">
                <FontAwesomeIcon icon={faClock} className="mr-1" />
                {formatDate(review.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {showActions && isAuthor && (
          <div className="flex items-center gap-1">
            <button
              onClick={handleEdit}
              disabled={loading}
              className="w-8 h-8 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors flex items-center justify-center"
              title="Edit review"
            >
              <FontAwesomeIcon icon={faEdit} className="text-sm" />
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="w-8 h-8 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors flex items-center justify-center"
              title="Delete review"
            >
              <FontAwesomeIcon icon={faTrash} className="text-sm" />
            </button>
          </div>
        )}
      </div>

      {/* Comment */}
      <div className="mb-3">
        <p className="text-gray-700 text-sm leading-relaxed">
          {showFullComment || !isLongComment 
            ? review.comment 
            : `${review.comment.substring(0, 200)}...`
          }
          {isLongComment && (
            <button
              onClick={() => setShowFullComment(!showFullComment)}
              className="text-[#D6F04C] hover:text-[#C5E043] text-sm font-medium ml-1"
            >
              {showFullComment ? 'Show less' : 'Read more'}
            </button>
          )}
        </p>
      </div>

      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {review.images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Review ${index + 1}`}
                className="w-16 h-16 rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity border border-gray-100"
                onClick={() => window.open(image, '_blank')}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors"></div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <button
            onClick={handleHelpful}
            disabled={loading || isHelpful}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              isHelpful 
                ? 'text-[#D6F04C]' 
                : 'text-gray-400 hover:text-[#D6F04C]'
            } disabled:opacity-50`}
          >
            <FontAwesomeIcon icon={isHelpful ? faThumbsUp : faThumbsUpRegular} className="text-sm" />
            <span className="font-medium">{helpfulCount}</span>
            <span className="text-xs hidden sm:inline">helpful</span>
          </button>
          
          <button className="text-gray-400 hover:text-red-500 transition-colors text-sm flex items-center gap-1">
            <FontAwesomeIcon icon={faFlag} className="text-xs" />
            <span className="text-xs hidden sm:inline">Report</span>
          </button>
        </div>

        {review.updatedAt && review.updatedAt !== review.createdAt && (
          <span className="text-[10px] text-gray-400">(edited)</span>
        )}
      </div>
    </div>
  )
}

export default ReviewCard
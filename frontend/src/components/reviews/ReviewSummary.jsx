import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faStarHalf, faUsers, faThumbsUp } from '@fortawesome/free-solid-svg-icons'

const ReviewSummary = ({ summary, totalHelpful = 0 }) => {
  if (!summary) return null

  const { averageRating, totalReviews, ratingDistribution } = summary

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400 text-lg" />)
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FontAwesomeIcon key={i} icon={faStarHalf} className="text-yellow-400 text-lg" />)
      } else {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-gray-300 text-lg" />)
      }
    }
    return stars
  }

  const getPercentage = (count) => {
    if (totalReviews === 0) return 0
    return (count / totalReviews) * 100
  }

  const maxCount = Math.max(...Object.values(ratingDistribution || {}), 1)

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-semibold text-black text-lg">Customer Reviews</h3>
        <span className="text-sm text-black/40">({totalReviews || 0})</span>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Average Rating */}
        <div className="flex-1 flex flex-col items-center md:items-start justify-center p-4 bg-[#F4F6F2] rounded-xl">
          <div className="text-5xl font-bold text-black">
            {averageRating || 0}
          </div>
          <div className="flex items-center gap-1 mt-2">
            {renderStars(averageRating || 0)}
          </div>
          <div className="text-sm text-black/50 mt-1">
            Based on {totalReviews || 0} reviews
          </div>
          {totalHelpful > 0 && (
            <div className="flex items-center gap-1.5 mt-3 text-sm text-green-600">
              <FontAwesomeIcon icon={faThumbsUp} />
              <span>{totalHelpful} people found this helpful</span>
            </div>
          )}
        </div>

        {/* Right: Rating Distribution */}
        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingDistribution?.[star] || 0
            const percentage = getPercentage(count)
            const maxPercentage = maxCount > 0 ? (count / maxCount) * 100 : 0

            return (
              <div key={star} className="flex items-center gap-3 mb-2 group">
                <div className="flex items-center gap-1 min-w-[70px]">
                  <span className="text-sm font-medium text-black/70">{star}</span>
                  <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-xs" />
                </div>
                <div className="flex-1 relative">
                  <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full gold-gradient rounded-full transition-all duration-700 ease-out group-hover:opacity-80"
                      style={{ width: `${Math.max(percentage, 0)}%` }}
                    />
                  </div>
                </div>
                <div className="min-w-[45px] text-sm text-black/50 text-right font-medium">
                  {count}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Rating Breakdown Summary */}
      {totalReviews > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-4 text-sm text-black/50">
          <span className="flex items-center gap-1">
            <span className="font-medium text-black">⭐ {averageRating}</span>
            average
          </span>
          <span className="w-px h-4 bg-gray-200"></span>
          <span className="flex items-center gap-1">
            <FontAwesomeIcon icon={faUsers} className="text-xs" />
            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </span>
          <span className="w-px h-4 bg-gray-200"></span>
          <span>
            {ratingDistribution?.[5] || 0} five-star reviews
          </span>
        </div>
      )}
    </div>
  )
}

export default ReviewSummary
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faStar, 
  faStarHalf, 
  faThumbsUp, 
  faComment,
  faUsers,
  faCalendar
} from '@fortawesome/free-solid-svg-icons'

const ReviewStats = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return null
  }

  const totalReviews = reviews.length
  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
  const totalHelpful = reviews.reduce((acc, r) => acc + (r.helpful || 0), 0)
  
  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  reviews.forEach(r => {
    ratingDistribution[r.rating] = (ratingDistribution[r.rating] || 0) + 1
  })

  // Get recent reviews (last 7 days)
  const now = new Date()
  const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7))
  const recentReviews = reviews.filter(r => new Date(r.createdAt) > sevenDaysAgo)

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400 text-xs" />)
      } else if (i - 0.5 <= rating) {
        stars.push(<FontAwesomeIcon key={i} icon={faStarHalf} className="text-yellow-400 text-xs" />)
      } else {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-gray-300 text-xs" />)
      }
    }
    return stars
  }

  const stats = [
    {
      label: 'Average Rating',
      value: averageRating.toFixed(1),
      icon: faStar,
      color: 'text-yellow-400',
      bg: 'bg-yellow-50',
      detail: renderStars(averageRating)
    },
    {
      label: 'Total Reviews',
      value: totalReviews,
      icon: faComment,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      detail: `${ratingDistribution[5] || 0} five-star reviews`
    },
    {
      label: 'Helpful Votes',
      value: totalHelpful,
      icon: faThumbsUp,
      color: 'text-green-500',
      bg: 'bg-green-50',
      detail: `${recentReviews.length} reviews this week`
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bg} rounded-xl p-4 flex items-center gap-4`}
        >
          <div className={`${stat.color} text-2xl`}>
            <FontAwesomeIcon icon={stat.icon} />
          </div>
          <div>
            <p className="text-sm text-black/50">{stat.label}</p>
            <p className="text-2xl font-bold text-black">{stat.value}</p>
            <p className="text-xs text-black/40 mt-1">{stat.detail}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ReviewStats
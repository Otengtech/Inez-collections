import React, { useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faStar, 
  faPaperPlane,
  faCamera,
  faTimes,
  faTrash,
  faImage
} from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { addReview, updateReview } from '../../redux/slices/reviewSlice'

const ReviewForm = ({ 
  productId, 
  guestId, 
  guestName, 
  onReviewAdded,
  editingReview = null,
  onCancelEdit 
}) => {
  const dispatch = useDispatch()
  const fileInputRef = useRef(null)
  
  const [rating, setRating] = useState(editingReview?.rating || 0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState(editingReview?.comment || '')
  const [images, setImages] = useState(editingReview?.images || [])
  const [loading, setLoading] = useState(false)
  const [previewImages, setPreviewImages] = useState([])

  const isEditing = !!editingReview

  const handleStarClick = (value) => {
    setRating(value)
  }

  const handleStarHover = (value) => {
    setHoverRating(value)
  }

  const handleStarLeave = () => {
    setHoverRating(0)
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed')
      return
    }

    // In production, upload to server first
    // For now, create object URLs
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      url: URL.createObjectURL(file)
    }))
    
    setPreviewImages([...previewImages, ...newImages])
    setImages([...images, ...newImages.map(img => img.url)])
  }

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
    setPreviewImages(previewImages.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    if (!comment.trim()) {
      toast.error('Please write a review')
      return
    }

    setLoading(true)
    try {
      const reviewData = {
        guestId,
        guestName: guestName || 'Guest User',
        rating,
        comment: comment.trim(),
        images: images,
      }

      if (isEditing) {
        await dispatch(updateReview({
          productId,
          reviewId: editingReview._id,
          reviewData
        })).unwrap()
        toast.success('Review updated successfully! ✏️')
      } else {
        await dispatch(addReview({
          productId,
          reviewData
        })).unwrap()
      }
      
      // Reset form
      setRating(0)
      setComment('')
      setImages([])
      setPreviewImages([])
      
      if (onReviewAdded) onReviewAdded()
      if (onCancelEdit) onCancelEdit()
    } catch (error) {
      // Error handled in slice
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (onCancelEdit) {
      onCancelEdit()
    } else {
      setRating(0)
      setComment('')
      setImages([])
      setPreviewImages([])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-black">
          {isEditing ? 'Edit Your Review' : 'Write a Review'}
        </h4>
        {isEditing && (
          <button
            type="button"
            onClick={handleCancel}
            className="text-sm text-black/40 hover:text-black transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Star Rating */}
      <div>
        <label className="block text-sm font-medium text-black/70 mb-2">
          Your Rating *
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handleStarClick(value)}
              onMouseEnter={() => handleStarHover(value)}
              onMouseLeave={handleStarLeave}
              className="text-2xl transition-all hover:scale-110 focus:outline-none"
            >
              <FontAwesomeIcon
                icon={faStar}
                className={`${
                  (hoverRating || rating) >= value
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
          <span className="ml-3 text-sm text-black/50">
            {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select rating'}
          </span>
        </div>
      </div>

      {/* Review Text */}
      <div>
        <label className="block text-sm font-medium text-black/70 mb-2">
          Your Review *
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="4"
          placeholder="Share your experience with this product..."
          className="w-full px-4 py-3 bg-[#F4F6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-200 transition-all text-sm resize-none border border-transparent focus:border-gold-300"
          maxLength="1000"
          required
        />
        <div className="flex justify-between text-xs text-black/40 mt-1">
          <span>Minimum 10 characters</span>
          <span>{comment.length}/1000</span>
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-black/70 mb-2">
          Add Photos (Optional)
        </label>
        <div className="flex flex-wrap gap-3">
          {previewImages.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image.preview}
                alt={`Review ${index + 1}`}
                className="w-16 h-16 rounded-lg object-cover border-2 border-gold-200"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-md"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          ))}
          {images.length < 5 && (
            <label className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gold-600 hover:bg-gold-50 transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                ref={fileInputRef}
              />
              <div className="text-center">
                <FontAwesomeIcon icon={faCamera} className="text-gray-400 text-lg" />
                <span className="block text-[8px] text-gray-400 mt-0.5">Upload</span>
              </div>
            </label>
          )}
        </div>
        <p className="text-xs text-black/40 mt-2">
          <FontAwesomeIcon icon={faImage} className="mr-1" />
          Upload up to 5 images (JPG, PNG, WebP)
        </p>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-black text-white font-semibold px-6 py-3 rounded-xl hover:bg-black-800 transition-all duration-300 disabled:opacity-50 group"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {isEditing ? 'Updating...' : 'Submitting...'}
            </>
          ) : (
            <>
              {isEditing ? 'Update Review' : 'Submit Review'}
              <FontAwesomeIcon icon={faPaperPlane} className="text-sm group-hover:rotate-12 transition-transform" />
            </>
          )}
        </button>
        
        {!isEditing && (
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium text-black/60"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default ReviewForm
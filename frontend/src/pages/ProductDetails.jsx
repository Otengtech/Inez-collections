import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductById, clearCurrentProduct } from '../redux/slices/productSlice'
import { fetchReviews, clearReviews } from '../redux/slices/reviewSlice'
import ProductDetails from '../components/products/ProductDetails'
import ReviewCard from '../components/reviews/ReviewCard'
import ReviewForm from '../components/reviews/ReviewForm'
import ReviewSummary from '../components/reviews/ReviewSummary'
import Loader from '../components/common/Loader'
import ScrollReveal from '../components/common/ScrollReveal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

const ProductDetailsPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentProduct, loading } = useSelector((state) => state.products)
  const { reviews, summary, pagination, loading: reviewsLoading } = useSelector((state) => state.reviews)
  const { guestId } = useSelector((state) => state.cart)
  const [guestName, setGuestName] = useState('')
  const [showReviewForm, setShowReviewForm] = useState(false)

  useEffect(() => {
    // Get guest name from localStorage or generate one
    const storedName = localStorage.getItem('guestName')
    if (storedName) {
      setGuestName(storedName)
    } else {
      const name = 'Guest_' + Math.random().toString(36).substring(2, 8)
      localStorage.setItem('guestName', name)
      setGuestName(name)
    }

    // Fetch product and reviews
    dispatch(fetchProductById(id))
    dispatch(fetchReviews({ productId: id }))

    return () => {
      dispatch(clearCurrentProduct())
      dispatch(clearReviews())
    }
  }, [dispatch, id])

  const handleReviewAdded = () => {
    dispatch(fetchReviews({ productId: id }))
    setShowReviewForm(false)
  }

  if (loading) {
    return <Loader />
  }

  if (!currentProduct) {
    return (
      <div className="container-custom py-20 text-center">
        <p className="text-black-600">Product not found</p>
      </div>
    )
  }

  return (
    <div className="section-padding mt-28 px-5 md:px-10">
      <div className="container-custom">
        <ScrollReveal direction="up">
          <Link
            to="/products"
            className="inline-flex pl-8 items-center gap-2 text-black-600 hover:text-gold-600 transition-colors mb-8"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Products
          </Link>
        </ScrollReveal>

        {/* Product Details */}
        <ProductDetails product={currentProduct} />
      </div>
    </div>
  )
}

export default ProductDetailsPage
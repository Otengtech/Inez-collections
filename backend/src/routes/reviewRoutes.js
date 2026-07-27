import express from 'express';
import {
  getProductReviews,
  addProductReview,
  updateReview,
  markReviewHelpful,
  deleteReview,
  getReviewStats,
} from '../controllers/reviewController.js';

const router = express.Router({ mergeParams: true });

// GET all reviews for a product
router.get('/', getProductReviews);

// GET review stats only
router.get('/stats', getReviewStats);

// POST add a review
router.post('/', addProductReview);

// PUT update a review
router.put('/:reviewId', updateReview);

// PUT mark review as helpful
router.put('/:reviewId/helpful', markReviewHelpful);

// DELETE a review
router.delete('/:reviewId', deleteReview);

export default router;
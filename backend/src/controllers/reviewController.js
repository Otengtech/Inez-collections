import Product from '../models/Product.js';

// ============================================
// GET ALL REVIEWS FOR A PRODUCT
// ============================================
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const reviewData = product.getReviews(parseInt(page), parseInt(limit));

    res.json({
      success: true,
      data: {
        reviews: reviewData.reviews,
        pagination: reviewData.pagination,
        summary: {
          averageRating: product.averageRating,
          totalReviews: product.totalReviews,
          ratingDistribution: product.ratingDistribution,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message,
    });
  }
};

// ============================================
// ADD REVIEW TO PRODUCT
// ============================================
export const addProductReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { guestId, guestName, rating, comment, images = [] } = req.body;

    // Validate required fields
    if (!guestId || !guestName || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide guestId, guestName, rating, and comment',
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    if (comment.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Comment must be at least 10 characters',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if user already reviewed
    const existingReview = product.reviews.find(
      review => review.guestId === guestId
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product',
      });
    }

    // Add review using model method
    await product.addReview({
      guestId,
      guestName,
      rating,
      comment,
      images,
    });

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: {
        averageRating: product.averageRating,
        totalReviews: product.totalReviews,
        ratingDistribution: product.ratingDistribution,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error adding review',
      error: error.message,
    });
  }
};

// ============================================
// UPDATE REVIEW
// ============================================
export const updateReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const { guestId, rating, comment, images = [] } = req.body;

    if (!guestId) {
      return res.status(400).json({
        success: false,
        message: 'Guest ID is required',
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    if (comment && comment.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Comment must be at least 10 characters',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Find the review
    const reviewIndex = product.reviews.findIndex(
      review => review._id.toString() === reviewId && review.guestId === guestId
    );

    if (reviewIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or you are not the author',
      });
    }

    // Update review
    product.reviews[reviewIndex].rating = rating || product.reviews[reviewIndex].rating;
    product.reviews[reviewIndex].comment = comment || product.reviews[reviewIndex].comment;
    product.reviews[reviewIndex].images = images.length > 0 ? images : product.reviews[reviewIndex].images;
    product.reviews[reviewIndex].updatedAt = new Date();

    await product.save();

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: {
        review: product.reviews[reviewIndex],
        summary: {
          averageRating: product.averageRating,
          totalReviews: product.totalReviews,
          ratingDistribution: product.ratingDistribution,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating review',
      error: error.message,
    });
  }
};

// ============================================
// MARK REVIEW AS HELPFUL
// ============================================
export const markReviewHelpful = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const { guestId } = req.body;

    if (!guestId) {
      return res.status(400).json({
        success: false,
        message: 'Guest ID is required',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if review exists
    const review = product.reviews.id(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Check if user already marked helpful
    if (review.helpfulUsers.includes(guestId)) {
      return res.status(400).json({
        success: false,
        message: 'You already marked this review as helpful',
      });
    }

    // Mark as helpful
    review.helpful += 1;
    review.helpfulUsers.push(guestId);
    await product.save();

    res.json({
      success: true,
      message: 'Review marked as helpful',
      data: {
        helpful: review.helpful,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error marking review as helpful',
    });
  }
};

// ============================================
// DELETE REVIEW
// ============================================
export const deleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const { guestId } = req.body;

    if (!guestId) {
      return res.status(400).json({
        success: false,
        message: 'Guest ID is required',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Find and remove review
    const reviewIndex = product.reviews.findIndex(
      review => review._id.toString() === reviewId && review.guestId === guestId
    );

    if (reviewIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or you are not the author',
      });
    }

    product.reviews.splice(reviewIndex, 1);
    await product.save();

    res.json({
      success: true,
      message: 'Review deleted successfully',
      data: {
        averageRating: product.averageRating,
        totalReviews: product.totalReviews,
        ratingDistribution: product.ratingDistribution,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error.message,
    });
  }
};

// ============================================
// GET REVIEW STATS ONLY
// ============================================
export const getReviewStats = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: {
        averageRating: product.averageRating,
        totalReviews: product.totalReviews,
        ratingDistribution: product.ratingDistribution,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching review stats',
      error: error.message,
    });
  }
};
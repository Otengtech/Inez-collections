import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['dresses', 'wigs', 'lip-gloss', 'sandals', 'slippers'],
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    images: {
      type: [String],
      required: [true, 'At least one image is required'],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'At least one image is required',
      },
    },
    sizes: {
      type: [String],
      default: [],
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '35', '36', '37', '38', '39', '40', '41', '42'],
    },
    colors: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // ============ REVIEW SYSTEM ============
    reviews: [
      {
        guestId: {
          type: String,
          required: true,
        },
        guestName: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          required: true,
          maxlength: 1000,
        },
        images: {
          type: [String],
          default: [],
        },
        isVerified: {
          type: Boolean,
          default: false,
        },
        helpful: {
          type: Number,
          default: 0,
        },
        helpfulUsers: {
          type: [String],
          default: [],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    ratingDistribution: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ============ INDEXES ============
// Index for search
productSchema.index({ name: 'text', description: 'text' });
// Index for category
productSchema.index({ category: 1 });
// Index for rating
productSchema.index({ averageRating: -1 });

// ============ VIRTUALS ============
// Virtual for average rating (backward compatibility)
productSchema.virtual('rating').get(function () {
  return this.averageRating || 0;
});

// ============ PRE-SAVE MIDDLEWARE ============
// Update rating statistics before saving
productSchema.pre('save', function (next) {
  if (this.reviews && this.reviews.length > 0) {
    const total = this.reviews.length;
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = parseFloat((sum / total).toFixed(1));
    this.totalReviews = total;
    
    // Update rating distribution
    this.ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    this.reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        this.ratingDistribution[review.rating] = (this.ratingDistribution[review.rating] || 0) + 1;
      }
    });
  } else {
    this.averageRating = 0;
    this.totalReviews = 0;
    this.ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  }
  next();
});

// ============ INSTANCE METHODS ============

// Add or update review
productSchema.methods.addReview = async function (reviewData) {
  const { guestId, guestName, rating, comment, images = [] } = reviewData;
  
  // Check if user already reviewed
  const existingReviewIndex = this.reviews.findIndex(
    review => review.guestId === guestId
  );

  if (existingReviewIndex !== -1) {
    // Update existing review
    this.reviews[existingReviewIndex].rating = rating;
    this.reviews[existingReviewIndex].comment = comment;
    this.reviews[existingReviewIndex].images = images;
    this.reviews[existingReviewIndex].updatedAt = new Date();
  } else {
    // Add new review
    this.reviews.push({
      guestId,
      guestName,
      rating,
      comment,
      images,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  await this.save();
  return this;
};

// Mark review as helpful
productSchema.methods.markHelpful = async function (reviewId, guestId) {
  const review = this.reviews.id(reviewId);
  if (!review) {
    throw new Error('Review not found');
  }

  if (review.helpfulUsers.includes(guestId)) {
    throw new Error('You already marked this review as helpful');
  }

  review.helpful += 1;
  review.helpfulUsers.push(guestId);
  await this.save();
  return review;
};

// Get reviews with pagination
productSchema.methods.getReviews = function (page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const total = this.reviews.length;
  const reviews = this.reviews
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(skip, skip + limit);
  
  return {
    reviews,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// Get review statistics
productSchema.methods.getReviewStats = function () {
  return {
    averageRating: this.averageRating,
    totalReviews: this.totalReviews,
    ratingDistribution: this.ratingDistribution,
  };
};

// Check if user has reviewed
productSchema.methods.hasUserReviewed = function (guestId) {
  return this.reviews.some(review => review.guestId === guestId);
};

// Get user's review
productSchema.methods.getUserReview = function (guestId) {
  return this.reviews.find(review => review.guestId === guestId) || null;
};

// Delete review
productSchema.methods.deleteReview = async function (reviewId, guestId) {
  const reviewIndex = this.reviews.findIndex(
    review => review._id.toString() === reviewId && review.guestId === guestId
  );

  if (reviewIndex === -1) {
    throw new Error('Review not found or you are not the author');
  }

  this.reviews.splice(reviewIndex, 1);
  await this.save();
  return this;
};

// ============ STATIC METHODS ============

// Get products with highest ratings
productSchema.statics.getTopRated = function (limit = 10) {
  return this.find({ isActive: true })
    .sort({ averageRating: -1, totalReviews: -1 })
    .limit(limit);
};

// Get products with most reviews
productSchema.statics.getMostReviewed = function (limit = 10) {
  return this.find({ isActive: true })
    .sort({ totalReviews: -1 })
    .limit(limit);
};

// Search products with review stats
productSchema.statics.searchWithReviews = function (searchTerm) {
  return this.find(
    { 
      $text: { $search: searchTerm },
      isActive: true 
    },
    { 
      score: { $meta: 'textScore' },
      name: 1,
      price: 1,
      images: 1,
      averageRating: 1,
      totalReviews: 1,
    }
  )
  .sort({ score: { $meta: 'textScore' } });
};

const Product = mongoose.model('Product', productSchema);
export default Product;
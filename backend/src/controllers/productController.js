import Product from '../models/Product.js';
import connectDB from '../config/database.js';
import mongoose from 'mongoose';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    // Ensure database is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('⏳ Connecting to database...');
      await connectDB();
      // Wait a moment for connection to stabilize
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const { 
      limit = 10, 
      page = 1, 
      category, 
      search, 
      minPrice, 
      maxPrice, 
      size, 
      color, 
      rating,
      sort = '-createdAt' 
    } = req.query;

    console.log('🔍 [Backend] Product query params:', { category, search, minPrice, maxPrice, size, color, rating, sort, page, limit });

    // Build query
    const query = { isActive: true };

    // Category filter - CASE INSENSITIVE
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Size filter
    if (size && size !== 'All') {
      query.sizes = { $in: [size] };
    }

    // Color filter
    if (color && color !== 'All') {
      query.colors = { $in: [color] };
    }

    // Rating filter
    if (rating) {
      query.averageRating = { $gte: Number(rating) };
    }

    const skip = (page - 1) * limit;
    const limitNum = Number(limit);

    // Sort options
    let sortOptions = {};
    switch (sort) {
      case '-createdAt': sortOptions = { createdAt: -1 }; break;
      case 'createdAt': sortOptions = { createdAt: 1 }; break;
      case '-price': sortOptions = { price: -1 }; break;
      case 'price': sortOptions = { price: 1 }; break;
      case '-rating': sortOptions = { averageRating: -1 }; break;
      default: sortOptions = { createdAt: -1 };
    }

    // Execute query with a timeout
    const products = await Product.find(query)
      .skip(skip)
      .limit(limitNum)
      .sort(sortOptions)
      .lean()
      .maxTimeMS(8000);

    const total = await Product.countDocuments(query).maxTimeMS(8000);

    console.log(`📦 [Backend] Found ${products.length} products (total: ${total})`);

    res.json({
      success: true,
      products,
      pagination: {
        page: Number(page),
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('❌ [Backend] Error fetching products:', error);
    
    // Handle timeout specifically
    if (error.name === 'MongoTimeoutError' || error.message?.includes('timed out')) {
      return res.status(504).json({
        success: false,
        message: 'Database query timed out. Please try again with simpler filters.',
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message,
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    // Ensure database is connected
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    
    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('❌ [Backend] Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message,
    });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
export const getProductsByCategory = async (req, res) => {
  try {
    // Ensure database is connected
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const { category } = req.params;
    const { limit = 10, page = 1 } = req.query;
    
    const skip = (page - 1) * limit;
    
    const products = await Product.find({ 
      category: { $regex: new RegExp(`^${category}$`, 'i') }, 
      isActive: true 
    })
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .lean();
    
    const total = await Product.countDocuments({ 
      category: { $regex: new RegExp(`^${category}$`, 'i') }, 
      isActive: true 
    });
    
    res.json({
      success: true,
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('❌ [Backend] Error fetching products by category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products by category',
      error: error.message,
    });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Public (demo)
export const createProduct = async (req, res) => {
  try {
    // Ensure category is lowercase
    if (req.body.category) {
      req.body.category = req.body.category.toLowerCase();
    }
    
    const product = new Product(req.body);
    await product.save();
    
    console.log('✅ [Backend] Product created:', product.name);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    console.error('❌ [Backend] Error creating product:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating product',
      error: error.message,
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Public (demo)
export const updateProduct = async (req, res) => {
  try {
    // Ensure category is lowercase
    if (req.body.category) {
      req.body.category = req.body.category.toLowerCase();
    }
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    
    console.log('✅ [Backend] Product updated:', product.name);
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    console.error('❌ [Backend] Error updating product:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating product',
      error: error.message,
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Public (demo)
export const deleteProduct = async (req, res) => {
  try {
    // Soft delete - set isActive to false instead of actually deleting
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    
    console.log('🗑️ [Backend] Product deleted (soft):', product.name);
    
    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('❌ [Backend] Error deleting product:', error);
    res.status(400).json({
      success: false,
      message: 'Error deleting product',
      error: error.message,
    });
  }
};

// @desc    Add product rating
// @route   POST /api/products/:id/rate
// @access  Public
export const addProductRating = async (req, res) => {
  try {
    const { rating, guestId, guestName, comment } = req.body;
    const productId = req.params.id;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }
    
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    
    // Add review using the model method
    await product.addReview({
      guestId: guestId || 'guest-' + Date.now(),
      guestName: guestName || 'Anonymous',
      rating,
      comment: comment || '',
      images: [],
    });
    
    console.log('⭐ [Backend] Rating added for product:', product.name);
    
    res.json({
      success: true,
      message: 'Rating added successfully',
      data: {
        averageRating: product.averageRating,
        totalReviews: product.totalReviews,
        ratingDistribution: product.ratingDistribution,
      },
    });
  } catch (error) {
    console.error('❌ [Backend] Error adding rating:', error);
    res.status(400).json({
      success: false,
      message: 'Error adding rating',
      error: error.message,
    });
  }
};
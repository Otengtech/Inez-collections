import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Get guest cart
// @route   GET /api/cart/:guestId
// @access  Public
export const getCart = async (req, res) => {
  try {
    const { guestId } = req.params;
    
    let cart = await Cart.findOne({ guestId }).populate('items.productId');

    if (!cart) {
      cart = new Cart({ guestId, items: [] });
      await cart.save();
    }

    res.json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message,
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Public
export const addToCart = async (req, res) => {
  try {
    const { guestId, productId, quantity = 1, size = null, color = null } = req.body;

    // Check if product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available: ${product.stock}`,
      });
    }

    // Get or create cart
    let cart = await Cart.findOne({ guestId });
    if (!cart) {
      cart = new Cart({ guestId, items: [] });
    }

    // Add item using the schema method
    await cart.addItem(productId, quantity, size, color);
    
    // Populate product details
    await cart.populate('items.productId');

    res.json({
      success: true,
      message: 'Item added to cart successfully',
      cart,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message,
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Public
export const updateCartItem = async (req, res) => {
  try {
    const { guestId, productId, quantity, size = null, color = null } = req.body;
    const { itemId } = req.params;

    let cart = await Cart.findOne({ guestId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    await cart.updateQuantity(productId, quantity, size, color);
    await cart.populate('items.productId');

    res.json({
      success: true,
      message: 'Cart updated successfully',
      cart,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating cart',
      error: error.message,
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Public
export const removeFromCart = async (req, res) => {
  try {
    const { guestId, productId, size = null, color = null } = req.query;
    const { itemId } = req.params;

    let cart = await Cart.findOne({ guestId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    await cart.removeItem(productId, size, color);
    await cart.populate('items.productId');

    res.json({
      success: true,
      message: 'Item removed from cart successfully',
      cart,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message,
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear/:guestId
// @access  Public
export const clearCart = async (req, res) => {
  try {
    const { guestId } = req.params;

    let cart = await Cart.findOne({ guestId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    await cart.clearCart();

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message,
    });
  }
};

// @desc    Sync cart from localStorage
// @route   POST /api/cart/sync
// @access  Public
export const syncCart = async (req, res) => {
  try {
    const { guestId, items } = req.body;

    let cart = await Cart.findOne({ guestId });
    if (!cart) {
      cart = new Cart({ guestId, items: [] });
    }

    // Clear existing items
    cart.items = [];

    // Add all items from localStorage
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product && product.stock >= item.quantity) {
        cart.items.push({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size || null,
          color: item.color || null,
        });
      }
    }

    await cart.save();
    await cart.populate('items.productId');

    res.json({
      success: true,
      message: 'Cart synced successfully',
      cart,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error syncing cart',
      error: error.message,
    });
  }
};
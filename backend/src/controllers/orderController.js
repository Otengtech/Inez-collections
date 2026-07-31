// controllers/orderController.js
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import { generateOrderId } from '../utils/helpers.js';
import { sendOrderConfirmation, sendAdminOrderNotification, sendOrderStatusUpdate } from '../services/emailService.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res) => {
  try {
    const { guestId, items, shippingAddress, paymentMethod } = req.body;

    // Validate required fields
    if (!guestId || !items || !items.length || !shippingAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Validate shipping address fields (simplified)
    const { fullName, email, phone, address, deliveryType } = shippingAddress;
    if (!fullName || !email || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all shipping address fields',
      });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address',
      });
    }

    // Validate delivery type
    if (deliveryType && !['delivery', 'pickup'].includes(deliveryType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid delivery type. Must be either "delivery" or "pickup"',
      });
    }

    // Validate items and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      // Validate item fields
      if (!item.productId || !item.quantity || item.quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Invalid item data. Each item must have productId and quantity >= 1',
        });
      }

      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`,
        });
      }

      // Check stock
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        });
      }

      // Update product stock
      product.stock -= item.quantity;
      await product.save();

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        size: item.size || null,
        color: item.color || null,
        image: product.images && product.images[0] ? product.images[0] : null,
      });

      totalAmount += product.price * item.quantity;
    }

    // Generate order number
    const orderNumber = generateOrderId();

    // Create order with simplified shipping address
    const order = new Order({
      orderNumber,
      guestId,
      items: orderItems,
      totalAmount,
      shippingAddress: {
        fullName,
        email,
        phone,
        address,
        deliveryType: deliveryType || 'delivery',
      },
      paymentMethod,
      status: 'pending',
      paymentStatus: 'pending',
    });

    await order.save();

    // Clear user's cart
    await Cart.findOneAndDelete({ guestId });

    // Send email confirmations
    try {
      await sendOrderConfirmation(order, guestId);
      await sendAdminOrderNotification(order);
      console.log(`📧 Order confirmation emails sent for ${order._id}`);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the order if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message,
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:orderId
// @access  Public
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { guestId } = req.query;

    if (!guestId) {
      return res.status(400).json({
        success: false,
        message: 'Guest ID is required',
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (order.guestId !== guestId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this order',
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message,
    });
  }
};

// @desc    Get all orders for a guest
// @route   GET /api/orders/guest/:guestId
// @access  Public
export const getGuestOrders = async (req, res) => {
  try {
    const { guestId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!guestId) {
      return res.status(400).json({
        success: false,
        message: 'Guest ID is required',
      });
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ guestId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments({ guestId }),
    ]);

    res.json({
      success: true,
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get guest orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message,
    });
  }
};

// @desc    Get user orders (for authenticated users)
// @route   GET /api/orders/user
// @access  Private
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { page = 1, limit = 10 } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments({ userId }),
    ]);

    res.json({
      success: true,
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message,
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:orderId/status
// @access  Public/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    // Prevent updating to cancelled if already shipped or delivered
    if (status === 'cancelled' && (order.status === 'shipped' || order.status === 'delivered')) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel an order that is already shipped or delivered',
      });
    }

    order.status = status;
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    await order.save();

    // Send email notification
    try {
      await sendOrderStatusUpdate(order, status);
      console.log(`📧 Order status update email sent for ${orderId}`);
    } catch (emailError) {
      console.error('Status update email failed:', emailError);
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message,
    });
  }
};

// @desc    Update payment status
// @route   PUT /api/orders/:orderId/payment
// @access  Public/Admin
export const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus, paymentId } = req.body;

    if (!paymentStatus) {
      return res.status(400).json({
        success: false,
        message: 'Payment status is required',
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const validPaymentStatuses = ['pending', 'completed', 'failed', 'refunded'];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid payment status. Must be one of: ${validPaymentStatuses.join(', ')}`,
      });
    }

    order.paymentStatus = paymentStatus;
    if (paymentId) {
      order.paymentId = paymentId;
    }

    await order.save();

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      order,
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating payment status',
      error: error.message,
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:orderId/cancel
// @access  Public
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { guestId } = req.body;

    if (!guestId) {
      return res.status(400).json({
        success: false,
        message: 'Guest ID is required',
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (order.guestId !== guestId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to cancel this order',
      });
    }

    if (order.status === 'shipped' || order.status === 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage',
      });
    }

    if (order.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Order is already cancelled',
      });
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity },
      });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order,
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling order',
      error: error.message,
    });
  }
};

// @desc    Get order statistics (for admin)
// @route   GET /api/orders/stats
// @access  Private/Admin
export const getOrderStats = async (req, res) => {
  try {
    const [totalOrders, pendingOrders, processingOrders, shippedOrders, deliveredOrders, cancelledOrders] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'processing' }),
      Order.countDocuments({ status: 'shipped' }),
      Order.countDocuments({ status: 'delivered' }),
      Order.countDocuments({ status: 'cancelled' }),
    ]);

    const revenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' }, paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue: revenue.length > 0 ? revenue[0].total : 0,
      },
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order statistics',
      error: error.message,
    });
  }
};

// @desc    Get recent orders (for admin)
// @route   GET /api/orders/recent
// @access  Private/Admin
export const getRecentOrders = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('Get recent orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent orders',
      error: error.message,
    });
  }
};

// @desc    Get all orders (for admin)
// @route   GET /api/orders/all
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(query),
    ]);

    res.json({
      success: true,
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message,
    });
  }
};

// controllers/orderController.js

// @desc    Delete order (admin only)
// @route   DELETE /api/orders/:orderId
// @access  Private/Admin
export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if order can be deleted (only cancelled or delivered orders can be deleted)
    if (order.status === 'pending' || order.status === 'processing' || order.status === 'shipped') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete an order that is pending, processing, or shipped. Please cancel it first.',
      });
    }

    // If order is cancelled, restore product stock before deleting
    if (order.status === 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity },
        });
      }
    }

    // Delete the order
    await Order.findByIdAndDelete(orderId);

    console.log(`🗑️ Order ${orderId} deleted successfully`);

    res.json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting order',
      error: error.message,
    });
  }
};

// @desc    Delete multiple orders (admin only)
// @route   DELETE /api/orders/bulk-delete
// @access  Private/Admin
export const bulkDeleteOrders = async (req, res) => {
  try {
    const { orderIds } = req.body;

    if (!orderIds || !orderIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Please provide order IDs to delete',
      });
    }

    // Find all orders
    const orders = await Order.find({ _id: { $in: orderIds } });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: 'No orders found to delete',
      });
    }

    // Check for orders that cannot be deleted
    const invalidOrders = orders.filter(
      order => order.status === 'pending' || order.status === 'processing' || order.status === 'shipped'
    );

    if (invalidOrders.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete ${invalidOrders.length} order(s) that are pending, processing, or shipped. Please cancel them first.`,
        invalidOrderIds: invalidOrders.map(o => o._id),
      });
    }

    // Restore stock for cancelled orders
    for (const order of orders) {
      if (order.status === 'cancelled') {
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { stock: item.quantity },
          });
        }
      }
    }

    // Delete all orders
    const result = await Order.deleteMany({ _id: { $in: orderIds } });

    console.log(`🗑️ ${result.deletedCount} orders deleted successfully`);

    res.json({
      success: true,
      message: `${result.deletedCount} order(s) deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Bulk delete orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting orders',
      error: error.message,
    });
  }
};

// @desc    Force delete order (admin only - no restrictions)
// @route   DELETE /api/orders/:orderId/force
// @access  Private/Admin
export const forceDeleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Restore stock for cancelled orders
    if (order.status === 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity },
        });
      }
    }

    // Force delete the order
    await Order.findByIdAndDelete(orderId);

    console.log(`🗑️ Order ${orderId} force deleted successfully`);

    res.json({
      success: true,
      message: 'Order force deleted successfully',
    });
  } catch (error) {
    console.error('Force delete order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting order',
      error: error.message,
    });
  }
};
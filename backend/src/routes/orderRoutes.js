// routes/orderRoutes.js
import express from 'express';
import {
  createOrder,
  getOrderById,
  getGuestOrders,
  getUserOrders,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  getOrderStats,
  getRecentOrders,
  getAllOrders,
  deleteOrder,
  bulkDeleteOrders,
  forceDeleteOrder
} from '../controllers/orderController.js';

const router = express.Router();

// Public routes
router.post('/', createOrder);
router.get('/:orderId', getOrderById);
router.get('/guest/:guestId', getGuestOrders);

// Admin routes - add these
router.get('/admin/all', getAllOrders);
router.get('/admin/stats', getOrderStats);
router.get('/admin/recent', getRecentOrders);
router.get('/user', getUserOrders);

// Update routes
router.put('/:orderId/status', updateOrderStatus);
router.put('/:orderId/payment', updatePaymentStatus);
router.put('/:orderId/cancel', cancelOrder);

// Delete routes (admin only)
router.delete('/:orderId', deleteOrder);
router.delete('/:orderId/force', forceDeleteOrder);
router.post('/bulk-delete', bulkDeleteOrders);

export default router;
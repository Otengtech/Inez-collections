import express from 'express';
import {
  createOrder,
  getOrderById,
  getGuestOrders,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/:orderId', getOrderById);
router.get('/guest/:guestId', getGuestOrders);

// Update routes
router.put('/:orderId/status', updateOrderStatus);
router.put('/:orderId/payment', updatePaymentStatus);
router.put('/:orderId/cancel', cancelOrder);

export default router;
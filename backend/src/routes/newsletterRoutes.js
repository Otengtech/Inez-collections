import express from 'express';
import {
  subscribeNewsletter,
  unsubscribeNewsletter,
  getSubscribers,
  sendBulkNewsletter,
  deleteSubscriber,
  bulkDeleteSubscribers,
  deleteInactiveSubscribers,
  deleteAllSubscribers
} from '../controllers/newsletterController.js';

const router = express.Router();

// Public routes
router.post('/subscribe', subscribeNewsletter);
router.post('/unsubscribe', unsubscribeNewsletter);

// Admin routes
router.get('/subscribers', getSubscribers);
router.post('/send', sendBulkNewsletter);

// Delete routes (admin only)
router.delete('/:id', deleteSubscriber);
router.delete('/bulk-delete', bulkDeleteSubscribers);
router.delete('/delete-inactive', deleteInactiveSubscribers);
router.delete('/delete-all', deleteAllSubscribers);

export default router;
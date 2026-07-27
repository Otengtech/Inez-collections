import express from 'express';
import {
  subscribeNewsletter,
  unsubscribeNewsletter,
  getSubscribers,
  sendBulkNewsletter,
} from '../controllers/newsletterController.js';

const router = express.Router();

// Public routes
router.post('/subscribe', subscribeNewsletter);
router.post('/unsubscribe', unsubscribeNewsletter);

// Admin routes
router.get('/subscribers', getSubscribers);
router.post('/send', sendBulkNewsletter);

export default router;
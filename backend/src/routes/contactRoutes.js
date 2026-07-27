import express from 'express';
import {
  submitContact,
  getContacts,
  getContactById,
  updateContactStatus,
  replyToContact,
} from '../controllers/contactController.js';
import { contactLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/', contactLimiter, submitContact);
router.get('/', getContacts);
router.get('/:id', getContactById);
router.put('/:id/status', updateContactStatus);
router.post('/:id/reply', replyToContact);

export default router;
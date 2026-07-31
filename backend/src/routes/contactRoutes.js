import express from 'express';
import {
  submitContact,
  getContacts,
  getContactById,
  updateContactStatus,
  replyToContact,
  deleteContact,
  bulkDeleteContacts,
  deleteAllContacts
} from '../controllers/contactController.js';
import { contactLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/', contactLimiter, submitContact);
router.get('/', getContacts);
router.get('/:id', getContactById);
router.put('/:id/status', updateContactStatus);
router.post('/:id/reply', replyToContact);

// Delete routes (admin only)
router.delete('/:id', deleteContact);
router.delete('/bulk-delete', bulkDeleteContacts);
router.delete('/delete-all', deleteAllContacts);

export default router;
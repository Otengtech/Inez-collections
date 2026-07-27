import express from 'express';
import {
  getProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import reviewRoutes from './reviewRoutes.js';

const router = express.Router();

// ============================================
// REVIEW ROUTES (nested under products)
// ============================================
router.use('/:productId/reviews', reviewRoutes);

// ============================================
// PRODUCT ROUTES
// ============================================
router.get('/', getProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
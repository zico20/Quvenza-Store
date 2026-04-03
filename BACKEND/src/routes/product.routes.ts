import { Router } from 'express';
import { verifyToken, requireAdmin } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { upload } from '../middlewares/upload.middleware';
import { createProductSchema, updateProductSchema } from '../schemas/product.schema';
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct, uploadProductImages } from '../controllers/product.controller';

const router = Router();
router.get('/', listProducts);
router.get('/:slug', getProduct);
router.post('/', verifyToken, requireAdmin, validate(createProductSchema), createProduct);
router.put('/:id', verifyToken, requireAdmin, validate(updateProductSchema), updateProduct);
router.delete('/:id', verifyToken, requireAdmin, deleteProduct);
router.post('/:id/images', verifyToken, requireAdmin, upload.array('images', 10), uploadProductImages);
export default router;

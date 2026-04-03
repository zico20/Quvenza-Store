import { Router } from 'express';
import { verifyToken, requireAdmin } from '../middlewares/auth.middleware';
import { listCategories, getCategory, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller';

const router = Router();
router.get('/', listCategories);
router.get('/:slug', getCategory);
router.post('/', verifyToken, requireAdmin, createCategory);
router.put('/:id', verifyToken, requireAdmin, updateCategory);
router.delete('/:id', verifyToken, requireAdmin, deleteCategory);
export default router;

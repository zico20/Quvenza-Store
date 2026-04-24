import { Router } from 'express';
import { verifyToken, requireAdmin } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createCategorySchema, updateCategorySchema } from '../schemas/category.schema';
import { listCategories, getCategory, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller';

const router = Router();
router.get('/', listCategories);
router.get('/:slug', getCategory);
router.post('/', verifyToken, requireAdmin, validate(createCategorySchema), createCategory);
router.put('/:id', verifyToken, requireAdmin, validate(updateCategorySchema), updateCategory);
router.delete('/:id', verifyToken, requireAdmin, deleteCategory);
export default router;

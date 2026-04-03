import { Router } from 'express';
import { verifyToken, requireAdmin } from '../middlewares/auth.middleware';
import { getAllOrders, updateOrderStatus } from '../controllers/order.controller';
import { getAllUsers } from '../controllers/user.controller';
import { validate } from '../middlewares/validate.middleware';
import { updateOrderStatusSchema } from '../schemas/order.schema';

const router = Router();
router.use(verifyToken, requireAdmin);
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', validate(updateOrderStatusSchema), updateOrderStatus);
router.get('/customers', getAllUsers);
export default router;

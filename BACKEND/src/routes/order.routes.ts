import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createOrderSchema } from '../schemas/order.schema';
import { createOrder, getUserOrders, getOrder } from '../controllers/order.controller';

const router = Router();
router.use(verifyToken);
router.post('/', validate(createOrderSchema), createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrder);
export default router;

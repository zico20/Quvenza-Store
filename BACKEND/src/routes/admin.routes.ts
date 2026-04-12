import { Router } from 'express';
import { verifyToken, requireAdmin } from '../middlewares/auth.middleware';
import {
  getAdminOrders,
  getAdminOrderById,
  updateOrderStatus,
  exportOrders,
  downloadInvoice,
} from '../controllers/order.controller';
import { getAllUsers } from '../controllers/user.controller';
import { validate } from '../middlewares/validate.middleware';
import { updateOrderStatusSchema } from '../schemas/order.schema';

const router = Router();
router.use(verifyToken, requireAdmin);

// Orders — export must come before :id to avoid Express treating 'export' as an id
router.get('/orders/export', exportOrders);
router.get('/orders', getAdminOrders);
router.get('/orders/:id', getAdminOrderById);
router.patch('/orders/:id/status', validate(updateOrderStatusSchema), updateOrderStatus);
router.get('/orders/:id/invoice', downloadInvoice);

router.get('/customers', getAllUsers);

export default router;

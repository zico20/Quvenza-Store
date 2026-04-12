import { Router } from 'express';
import { verifyToken, requireAdmin } from '../middlewares/auth.middleware';
import {
  getAdminOrders,
  getAdminOrderById,
  updateOrderStatus,
  exportOrders,
  downloadInvoice,
} from '../controllers/order.controller';
import { validate } from '../middlewares/validate.middleware';
import { updateOrderStatusSchema } from '../schemas/order.schema';
import { getLowStock } from '../controllers/product.controller';
import { getAdminStats, getCustomers, getCustomerDetail, toggleCustomerStatus } from '../controllers/admin.controller';

const router = Router();
router.use(verifyToken, requireAdmin);

router.get('/stats', getAdminStats);

// Orders — export and invoice routes must come before :id
router.get('/orders/export', exportOrders);
router.get('/orders', getAdminOrders);
router.get('/orders/:id', getAdminOrderById);
router.patch('/orders/:id/status', validate(updateOrderStatusSchema), updateOrderStatus);
router.get('/orders/:id/invoice', downloadInvoice);

router.get('/products/low-stock', getLowStock);

router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomerDetail);
router.patch('/customers/:id/toggle-status', toggleCustomerStatus);

export default router;

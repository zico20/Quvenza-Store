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
import {
  listAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  resetAdminPassword,
  changeOwnPassword,
  updateOwnProfile,
} from '../controllers/admin-user.controller';
import {
  createAdminUserSchema,
  updateAdminUserSchema,
  changeOwnPasswordSchema,
  resetAdminPasswordSchema,
} from '../schemas/admin-user.schema';

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

// Admin user management
router.get('/users',                       listAdminUsers);
router.post('/users', validate(createAdminUserSchema), createAdminUser);
router.patch('/users/:id', validate(updateAdminUserSchema), updateAdminUser);
router.delete('/users/:id',                deleteAdminUser);
router.patch('/users/:id/reset-password', validate(resetAdminPasswordSchema), resetAdminPassword);

// Own profile management
router.patch('/me/password', validate(changeOwnPasswordSchema), changeOwnPassword);
router.patch('/me/profile',  validate(updateAdminUserSchema),   updateOwnProfile);

export default router;

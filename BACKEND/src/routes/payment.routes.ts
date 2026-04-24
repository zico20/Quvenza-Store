import { Router } from 'express';
import { verifyToken, requireAdmin } from '../middlewares/auth.middleware';
import { initiatePayment, confirmPayment, refundPayment } from '../controllers/payment.controller';

const router = Router();
router.use(verifyToken);
router.post('/initiate', initiatePayment);
router.post('/confirm', confirmPayment);
router.post('/refund', requireAdmin, refundPayment);
export default router;

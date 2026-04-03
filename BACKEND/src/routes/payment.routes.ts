import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware';
import { initiatePayment, confirmPayment, refundPayment } from '../controllers/payment.controller';

const router = Router();
router.use(verifyToken);
router.post('/initiate', initiatePayment);
router.post('/confirm', confirmPayment);
router.post('/refund', refundPayment);
export default router;

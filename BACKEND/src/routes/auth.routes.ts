import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validate } from '../middlewares/validate.middleware';
import { verifyToken } from '../middlewares/auth.middleware';
import { registerSchema, loginSchema, refreshTokenSchema } from '../schemas/auth.schema';
import { registerController, loginController, refreshController, logoutController, meController } from '../controllers/auth.controller';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();
router.post('/register', authLimiter, validate(registerSchema), registerController);
router.post('/login', authLimiter, validate(loginSchema), loginController);
router.post('/refresh', validate(refreshTokenSchema), refreshController);
router.post('/logout', verifyToken, logoutController);
router.get('/me', verifyToken, meController);
export default router;

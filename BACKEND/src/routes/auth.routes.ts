import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware';
import { verifyToken } from '../middlewares/auth.middleware';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { registerController, loginController, refreshController, logoutController, meController } from '../controllers/auth.controller';

const router = Router();
router.post('/register', validate(registerSchema), registerController);
router.post('/login', validate(loginSchema), loginController);
router.post('/refresh', refreshController);
router.post('/logout', verifyToken, logoutController);
router.get('/me', verifyToken, meController);
export default router;

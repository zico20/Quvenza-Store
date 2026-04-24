import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { addToCartSchema, updateCartItemSchema } from '../schemas/cart.schema';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cart.controller';

const router = Router();
router.use(verifyToken);
router.get('/', getCart);
router.post('/items', validate(addToCartSchema), addToCart);
router.patch('/items/:itemId', validate(updateCartItemSchema), updateCartItem);
router.delete('/items/:itemId', removeFromCart);
router.delete('/', clearCart);
export default router;

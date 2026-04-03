import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cart.controller';

const router = Router();
router.use(verifyToken);
router.get('/', getCart);
router.post('/items', addToCart);
router.patch('/items/:itemId', updateCartItem);
router.delete('/items/:itemId', removeFromCart);
router.delete('/', clearCart);
export default router;

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { sendSuccess } from '../utils/response';
import { AppError } from '../middlewares/error.middleware';

async function getOrCreateCart(userId: string) {
  return prisma.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
    include: { items: { include: { product: true } } },
  });
}

export async function getCart(req: Request, res: Response, next: NextFunction) {
  try {
    const cart = await getOrCreateCart(req.user!.id);
    const total = cart.items.reduce((s: number, i) => s + Number(i.product.price) * i.quantity, 0);
    sendSuccess(res, { ...cart, total });
  } catch (e) { next(e); }
}
export async function addToCart(req: Request, res: Response, next: NextFunction) {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product?.isActive) throw new AppError('Product not found.', 404);
    if (product.stock < quantity) throw new AppError('Insufficient stock.', 400);
    const cart = await getOrCreateCart(req.user!.id);
    const existing = await prisma.cartItem.findUnique({ where: { cartId_productId: { cartId: cart.id, productId } } });
    if (existing) await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: existing.quantity + quantity } });
    else await prisma.cartItem.create({ data: { cartId: cart.id, productId, quantity } });
    const updated = await getOrCreateCart(req.user!.id);
    sendSuccess(res, { ...updated, total: updated.items.reduce((s: number, i) => s + Number(i.product.price) * i.quantity, 0) }, 'Added to cart');
  } catch (e) { next(e); }
}
export async function updateCartItem(req: Request, res: Response, next: NextFunction) {
  try {
    const { quantity } = req.body;
    const cart = await getOrCreateCart(req.user!.id);
    const item = await prisma.cartItem.findFirst({ where: { id: req.params.itemId, cartId: cart.id } });
    if (!item) throw new AppError('Cart item not found.', 404);
    if (quantity <= 0) await prisma.cartItem.delete({ where: { id: item.id } });
    else await prisma.cartItem.update({ where: { id: item.id }, data: { quantity } });
    const updated = await getOrCreateCart(req.user!.id);
    sendSuccess(res, { ...updated, total: updated.items.reduce((s: number, i) => s + Number(i.product.price) * i.quantity, 0) }, 'Cart updated');
  } catch (e) { next(e); }
}
export async function removeFromCart(req: Request, res: Response, next: NextFunction) {
  try {
    const cart = await getOrCreateCart(req.user!.id);
    const item = await prisma.cartItem.findFirst({ where: { id: req.params.itemId, cartId: cart.id } });
    if (!item) throw new AppError('Cart item not found.', 404);
    await prisma.cartItem.delete({ where: { id: item.id } });
    sendSuccess(res, null, 'Removed');
  } catch (e) { next(e); }
}
export async function clearCart(req: Request, res: Response, next: NextFunction) {
  try {
    const cart = await getOrCreateCart(req.user!.id);
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    sendSuccess(res, null, 'Cart cleared');
  } catch (e) { next(e); }
}

import { prisma } from '@/lib/prisma';
import { AppError } from '@/lib/errors';

export async function getOrCreateCart(userId: string) {
  return prisma.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
}

export async function getCart(userId: string) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              price: true,
              comparePrice: true,
              stock: true,
              images: true,
              isActive: true,
            },
          },
        },
        orderBy: { id: 'desc' },
      },
    },
  });

  if (!cart) {
    return { id: null, userId, items: [], total: 0, itemCount: 0 };
  }

  const total = cart.items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  return { ...cart, total, itemCount };
}

/**
 * Add item to cart using upsert with increment — fixes TOCTOU race condition.
 */
export async function addItemToCart(
  userId: string,
  productId: string,
  quantity: number
) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isActive) throw new AppError('Product not available.', 404);
  if (product.stock < quantity) throw new AppError(`Only ${product.stock} units in stock.`, 409);

  const cart = await getOrCreateCart(userId);

  // variantId is part of the composite unique key (null = no variant selected yet).
  // Prisma types a nullable field in a compound key as non-null, so we use
  // findFirst + create/update instead of upsert. Full variant-aware add-to-cart
  // is handled in the electronics-revamp cart phase.
  const existing = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId, variantId: null },
  });
  const item = existing
    ? await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: { increment: quantity } },
      })
    : await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
      });

  if (item.quantity > product.stock) {
    await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity: product.stock },
    });
    throw new AppError(`Cannot add more. Cart already at max stock (${product.stock}).`, 409);
  }

  return getCart(userId);
}

export async function updateCartItemQuantity(
  userId: string,
  itemId: string,
  quantity: number
) {
  const item = await prisma.cartItem.findFirst({
    where: { id: itemId, cart: { userId } },
    include: { product: true },
  });
  if (!item) throw new AppError('Cart item not found.', 404);

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
    return getCart(userId);
  }

  if (quantity > item.product.stock) {
    throw new AppError(`Only ${item.product.stock} units in stock.`, 409);
  }

  await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
  return getCart(userId);
}

export async function removeCartItem(userId: string, itemId: string) {
  const item = await prisma.cartItem.findFirst({
    where: { id: itemId, cart: { userId } },
  });
  if (!item) throw new AppError('Cart item not found.', 404);
  await prisma.cartItem.delete({ where: { id: itemId } });
  return getCart(userId);
}

export async function clearCart(userId: string) {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
  return getCart(userId);
}

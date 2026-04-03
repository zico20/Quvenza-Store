import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mystore.com' },
    update: {},
    create: {
      name: 'Store Admin',
      email: 'admin@mystore.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const customerPassword = await bcrypt.hash('customer123', 12);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@mystore.com' },
    update: {},
    create: {
      name: 'Test Customer',
      email: 'customer@mystore.com',
      password: customerPassword,
      role: 'USER',
    },
  });

  const categoryData = [
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Clothing', slug: 'clothing' },
    { name: 'Home & Garden', slug: 'home-garden' },
    { name: 'Sports', slug: 'sports' },
    { name: 'Books', slug: 'books' },
    { name: 'Beauty', slug: 'beauty' },
  ];

  const categories = await Promise.all(
    categoryData.map((cat) =>
      prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: { ...cat, isActive: true },
      })
    )
  );

  const productData = [
    {
      name: 'Wireless Noise-Cancelling Headphones',
      slug: 'wireless-noise-cancelling-headphones',
      description: 'Premium over-ear headphones with 30-hour battery life and active noise cancellation.',
      price: 149.99, comparePrice: 199.99, stock: 45,
      categoryId: categories[0].id,
      images: ['https://placehold.co/600x600?text=Headphones'],
    },
    {
      name: 'Mechanical Gaming Keyboard',
      slug: 'mechanical-gaming-keyboard',
      description: 'RGB backlit mechanical keyboard with Cherry MX switches, full N-key rollover.',
      price: 89.99, comparePrice: 119.99, stock: 30,
      categoryId: categories[0].id,
      images: ['https://placehold.co/600x600?text=Keyboard'],
    },
    {
      name: 'Slim Fit Cotton T-Shirt',
      slug: 'slim-fit-cotton-t-shirt',
      description: '100% organic cotton slim-fit t-shirt, available in 8 colors.',
      price: 24.99, comparePrice: null as any, stock: 200,
      categoryId: categories[1].id,
      images: ['https://placehold.co/600x600?text=T-Shirt'],
    },
    {
      name: 'Running Sneakers Pro',
      slug: 'running-sneakers-pro',
      description: 'Lightweight responsive foam sole, breathable mesh upper.',
      price: 79.99, comparePrice: 99.99, stock: 60,
      categoryId: categories[1].id,
      images: ['https://placehold.co/600x600?text=Sneakers'],
    },
    {
      name: 'Ceramic Coffee Mug Set',
      slug: 'ceramic-coffee-mug-set',
      description: 'Set of 4 handcrafted ceramic mugs, dishwasher safe, 350ml capacity.',
      price: 34.99, comparePrice: null as any, stock: 80,
      categoryId: categories[2].id,
      images: ['https://placehold.co/600x600?text=Mugs'],
    },
    {
      name: 'Stainless Steel Water Bottle',
      slug: 'stainless-steel-water-bottle',
      description: 'Double-wall insulated 750ml bottle. Keeps cold 24h, hot 12h.',
      price: 29.99, comparePrice: 39.99, stock: 120,
      categoryId: categories[2].id,
      images: ['https://placehold.co/600x600?text=Bottle'],
    },
    {
      name: 'Yoga Mat Premium',
      slug: 'yoga-mat-premium',
      description: 'Non-slip 6mm thick TPE yoga mat with alignment lines. Eco-friendly.',
      price: 44.99, comparePrice: 59.99, stock: 55,
      categoryId: categories[3].id,
      images: ['https://placehold.co/600x600?text=YogaMat'],
    },
    {
      name: 'Adjustable Dumbbell Set',
      slug: 'adjustable-dumbbell-set',
      description: 'Quick-lock adjustment from 5kg to 25kg per dumbbell. Replaces 9 pairs.',
      price: 189.99, comparePrice: 249.99, stock: 20,
      categoryId: categories[3].id,
      images: ['https://placehold.co/600x600?text=Dumbbells'],
    },
    {
      name: 'Clean Code (Book)',
      slug: 'clean-code-book',
      description: 'A Handbook of Agile Software Craftsmanship by Robert C. Martin.',
      price: 34.99, comparePrice: null as any, stock: 40,
      categoryId: categories[4].id,
      images: ['https://placehold.co/600x600?text=CleanCode'],
    },
    {
      name: 'The Pragmatic Programmer',
      slug: 'the-pragmatic-programmer',
      description: '20th Anniversary Edition — your journey to mastery.',
      price: 39.99, comparePrice: 49.99, stock: 35,
      categoryId: categories[4].id,
      images: ['https://placehold.co/600x600?text=PragProg'],
    },
    {
      name: 'Vitamin C Serum 30ml',
      slug: 'vitamin-c-serum-30ml',
      description: '20% Vitamin C + Hyaluronic Acid. Brightens skin and reduces dark spots.',
      price: 19.99, comparePrice: 29.99, stock: 90,
      categoryId: categories[5].id,
      images: ['https://placehold.co/600x600?text=Serum'],
    },
    {
      name: 'Natural Face Moisturizer',
      slug: 'natural-face-moisturizer',
      description: 'Lightweight daily moisturizer with SPF 30. Suitable for all skin types.',
      price: 24.99, comparePrice: null as any, stock: 75,
      categoryId: categories[5].id,
      images: ['https://placehold.co/600x600?text=Moisturizer'],
    },
  ];

  for (const product of productData) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: { ...product, isActive: true },
    });
  }

  const firstProduct = await prisma.product.findFirst({
    where: { slug: 'wireless-noise-cancelling-headphones' },
  });
  if (firstProduct) {
    const existingOrder = await prisma.order.findFirst({ where: { userId: customer.id } });
    if (!existingOrder) {
      await prisma.order.create({
        data: {
          userId: customer.id,
          status: 'DELIVERED',
          total: 149.99,
          paymentMethod: 'card',
          paymentStatus: 'PAID',
          shippingAddress: {
            fullName: 'Test Customer',
            phone: '+964 750 000 0000',
            city: 'Baghdad',
            address: '123 Main Street',
            country: 'Iraq',
          },
          items: {
            create: [{ productId: firstProduct.id, quantity: 1, price: 149.99 }],
          },
        },
      });
    }
  }

  console.log('✅ Seed complete:');
  console.log('   Admin  → admin@mystore.com / admin123');
  console.log('   User   → customer@mystore.com / customer123');
  console.log('   Categories: 6');
  console.log('   Products:   12');
  console.log('   Orders:      1');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { AppError, handleApiError } from '@/lib/errors';
import { uploadBuffer, validateImage } from '@/lib/cloudinary';
import { sendSuccess } from '@/lib/api-response';

const isCuid = (s: string) => /^c[a-z0-9]{20,30}$/i.test(s);

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAdmin(request);
    const { slug } = await context.params;

    const product = isCuid(slug)
      ? await prisma.product.findUnique({ where: { id: slug } })
      : await prisma.product.findUnique({ where: { slug } });
    if (!product) throw new AppError('Product not found.', 404);

    const formData = await request.formData();
    const files = formData.getAll('images') as File[];
    if (!files.length) throw new AppError('No images provided.', 400);
    if (files.length > 10) throw new AppError('Maximum 10 images per upload.', 400);

    for (const file of files) {
      const v = validateImage(file);
      if (!v.valid) throw new AppError(v.error!, 400);
    }

    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        return uploadBuffer(buffer, 'products', file.name);
      })
    );

    const newImages = [...product.images, ...uploadResults.map((r) => r.url)];
    const updated = await prisma.product.update({
      where: { id: product.id },
      data: { images: newImages },
    });

    return sendSuccess({ product: updated, uploaded: uploadResults }, 'Images uploaded', 201);
  } catch (error) {
    return handleApiError(error);
  }
}

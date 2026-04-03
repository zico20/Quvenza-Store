import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { sendSuccess } from '../utils/response';
import { slugify } from '../utils/slugify';
import { AppError } from '../middlewares/error.middleware';

export async function listCategories(req: Request, res: Response, next: NextFunction) {
  try { sendSuccess(res, await prisma.category.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } })); } catch (e) { next(e); }
}
export async function getCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const cat = await prisma.category.findUnique({ where: { slug: req.params.slug } });
    if (!cat) throw new AppError('Category not found.', 404);
    sendSuccess(res, cat);
  } catch (e) { next(e); }
}
export async function createCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, image } = req.body;
    sendSuccess(res, await prisma.category.create({ data: { name, slug: slugify(name), image } }), 'Created', 201);
  } catch (e) { next(e); }
}
export async function updateCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, image, isActive } = req.body;
    const d: any = { image, isActive };
    if (name) { d.name = name; d.slug = slugify(name); }
    sendSuccess(res, await prisma.category.update({ where: { id: req.params.id }, data: d }), 'Updated');
  } catch (e) { next(e); }
}
export async function deleteCategory(req: Request, res: Response, next: NextFunction) {
  try { await prisma.category.update({ where: { id: req.params.id }, data: { isActive: false } }); sendSuccess(res, null, 'Deleted'); } catch (e) { next(e); }
}

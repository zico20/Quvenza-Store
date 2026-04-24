import { Request, Response, NextFunction } from 'express';
import * as productService from '../services/products/product.service';
import { getLowStockProducts } from '../services/products/product.service';
import { config } from '../config/env';
import { parsePaginationQuery } from '../utils/pagination';
import { sendSuccess, sendPaginated } from '../utils/response';

export async function listProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const pagination = parsePaginationQuery(req);
    const { categoryId, search, sort } = req.query as Record<string, string>;
    const result = await productService.getProducts(pagination, { categoryId, search, sort });
    sendPaginated(res, result.products, result.pagination);
  } catch (e) { next(e); }
}
export async function getProduct(req: Request, res: Response, next: NextFunction) {
  try { sendSuccess(res, await productService.getProductBySlug(req.params.slug)); } catch (e) { next(e); }
}
export async function createProduct(req: Request, res: Response, next: NextFunction) {
  try { sendSuccess(res, await productService.createProduct(req.body), 'Product created', 201); } catch (e) { next(e); }
}
export async function updateProduct(req: Request, res: Response, next: NextFunction) {
  try { sendSuccess(res, await productService.updateProduct(req.params.id, req.body), 'Updated'); } catch (e) { next(e); }
}
export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  try { await productService.softDeleteProduct(req.params.id); sendSuccess(res, null, 'Deleted'); } catch (e) { next(e); }
}
export async function uploadProductImages(req: Request, res: Response, next: NextFunction) {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files?.length) { res.status(400).json({ success: false, message: 'No files uploaded' }); return; }
    const imageUrls = files.map((f) => `${config.BACKEND_URL}/uploads/${f.filename}`);
    sendSuccess(res, await productService.updateProduct(req.params.id, { images: imageUrls }), 'Images uploaded');
  } catch (e) { next(e); }
}

export const getLowStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const threshold = parseInt(req.query.threshold as string) || 5;
    const products = await getLowStockProducts(threshold);
    sendSuccess(res, products);
  } catch (error) { next(error); }
};

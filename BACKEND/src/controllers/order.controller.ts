import { Request, Response, NextFunction } from 'express';
import * as orderService from '../services/orders/order.service';
import { parsePaginationQuery } from '../utils/pagination';
import { sendSuccess, sendPaginated } from '../utils/response';

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try { sendSuccess(res, await orderService.createOrder({ ...req.body, userId: req.user!.id }), 'Order created', 201); } catch (e) { next(e); }
}
export async function getUserOrders(req: Request, res: Response, next: NextFunction) {
  try { const r = await orderService.getUserOrders(req.user!.id, parsePaginationQuery(req)); sendPaginated(res, r.orders, r.pagination); } catch (e) { next(e); }
}
export async function getOrder(req: Request, res: Response, next: NextFunction) {
  try { sendSuccess(res, await orderService.getOrderById(req.params.id, req.user!.id)); } catch (e) { next(e); }
}
export async function getAllOrders(req: Request, res: Response, next: NextFunction) {
  try { const r = await orderService.getAllOrders(parsePaginationQuery(req), req.query.status as string); sendPaginated(res, r.orders, r.pagination); } catch (e) { next(e); }
}
export async function updateOrderStatus(req: Request, res: Response, next: NextFunction) {
  try { sendSuccess(res, await orderService.updateOrderStatus(req.params.id, req.body.status), 'Status updated'); } catch (e) { next(e); }
}

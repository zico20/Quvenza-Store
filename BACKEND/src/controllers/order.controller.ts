import { Request, Response, NextFunction } from 'express';
import * as orderService from '../services/orders/order.service';
import { orderExportService } from '../services/orders/order-export.service';
import { invoiceService } from '../services/orders/invoice.service';
import { parsePaginationQuery } from '../utils/pagination';
import { sendSuccess, sendPaginated } from '../utils/response';

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await orderService.createOrder({ ...req.body, userId: req.user!.id }), 'Order created', 201);
  } catch (e) { next(e); }
}

export async function getUserOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const r = await orderService.getUserOrders(req.user!.id, parsePaginationQuery(req));
    sendPaginated(res, r.orders, r.pagination);
  } catch (e) { next(e); }
}

export async function getOrder(req: Request, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await orderService.getOrderById(req.params.id, req.user!.id));
  } catch (e) { next(e); }
}

export async function getAllOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const r = await orderService.getAllOrders(parsePaginationQuery(req), req.query.status as string);
    sendPaginated(res, r.orders, r.pagination);
  } catch (e) { next(e); }
}

export async function getAdminOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit, search, status, paymentStatus, dateFrom, dateTo, sortBy, sortOrder } = req.query;
    const result = await orderService.getAdminOrders({
      page: parseInt(page as string) || 1,
      limit: parseInt(limit as string) || 10,
      search: search as string,
      status: status as string,
      paymentStatus: paymentStatus as string,
      dateFrom: dateFrom as string,
      dateTo: dateTo as string,
      sortBy: sortBy as string,
      sortOrder: (sortOrder as 'asc' | 'desc') || 'desc',
    });
    sendPaginated(res, result.orders, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      pages: result.pages,
    });
  } catch (e) { next(e); }
}

export async function getAdminOrderById(req: Request, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await orderService.getOrderById(req.params.id));
  } catch (e) { next(e); }
}

export async function updateOrderStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    const adminId = (req as any).user.id;
    sendSuccess(res, await orderService.updateOrderStatus(id, status, adminId, note), 'تم تحديث حالة الطلب');
  } catch (e) { next(e); }
}

export async function exportOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, paymentStatus, dateFrom, dateTo } = req.query;
    const buffer = await orderExportService.exportToExcel({
      status: status as string,
      paymentStatus: paymentStatus as string,
      dateFrom: dateFrom as string,
      dateTo: dateTo as string,
    });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=orders-${Date.now()}.xlsx`);
    res.send(buffer);
  } catch (e) { next(e); }
}

export async function downloadInvoice(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const buffer = await invoiceService.generateInvoice(id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${id.slice(-8)}.pdf`);
    res.send(buffer);
  } catch (e) { next(e); }
}

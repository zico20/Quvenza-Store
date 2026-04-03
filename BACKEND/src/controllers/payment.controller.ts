import { Request, Response, NextFunction } from 'express';
import * as paymentService from '../services/payments/payment.service';
import { sendSuccess } from '../utils/response';

export async function initiatePayment(req: Request, res: Response, next: NextFunction) {
  try { sendSuccess(res, await paymentService.initiatePayment(req.body.orderId, req.body.currency)); } catch (e) { next(e); }
}
export async function confirmPayment(req: Request, res: Response, next: NextFunction) {
  try { sendSuccess(res, await paymentService.confirmOrderPayment(req.body.orderId, req.body.paymentIntentId)); } catch (e) { next(e); }
}
export async function refundPayment(req: Request, res: Response, next: NextFunction) {
  try { sendSuccess(res, await paymentService.refundOrderPayment(req.body.orderId, req.body.paymentIntentId, req.body.amount)); } catch (e) { next(e); }
}

import { Request, Response, NextFunction } from 'express';
import { notificationService } from '../services/notifications/notification.service';
import { sendSuccess, sendPaginated } from '../utils/response';
import { buildPaginationMeta } from '../utils/pagination';

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const unreadOnly = req.query.unreadOnly === 'true';
    const result = await notificationService.getAll(page, limit, unreadOnly);
    sendPaginated(res, result.notifications, buildPaginationMeta(result.total, page, limit));
  } catch (error) { next(error); }
};

export const getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = await notificationService.getUnreadCount();
    sendSuccess(res, { count });
  } catch (error) { next(error); }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await notificationService.markAsRead(req.params.id);
    sendSuccess(res, null, 'تم تعليم الإشعار كمقروء');
  } catch (error) { next(error); }
};

export const markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await notificationService.markAllAsRead();
    sendSuccess(res, null, 'تم تعليم جميع الإشعارات كمقروءة');
  } catch (error) { next(error); }
};

export const deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await notificationService.delete(req.params.id);
    sendSuccess(res, null, 'تم حذف الإشعار');
  } catch (error) { next(error); }
};

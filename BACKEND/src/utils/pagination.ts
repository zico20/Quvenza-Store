import { Request } from 'express';
import { PAGINATION_DEFAULT_LIMIT, PAGINATION_MAX_LIMIT } from '../config/constants';

export interface PaginationQuery { page: number; limit: number; skip: number; }

export function parsePaginationQuery(req: Request): PaginationQuery {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(PAGINATION_MAX_LIMIT, Math.max(1, parseInt(req.query.limit as string) || PAGINATION_DEFAULT_LIMIT));
  return { page, limit, skip: (page - 1) * limit };
}

export function buildPaginationMeta(total: number, page: number, limit: number) {
  return { page, limit, total, pages: Math.ceil(total / limit) };
}

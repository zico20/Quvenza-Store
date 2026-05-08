import { PAGINATION_DEFAULT_LIMIT, PAGINATION_MAX_LIMIT } from '../config/constants';

export interface PaginationQuery { page: number; limit: number; skip: number; }

export function parsePaginationParams(params: URLSearchParams | Record<string, string | string[] | undefined>): PaginationQuery {
  const get = (key: string): string | undefined =>
    params instanceof URLSearchParams ? (params.get(key) ?? undefined) : (Array.isArray(params[key]) ? params[key][0] : params[key] as string | undefined);
  const page = Math.max(1, parseInt(get('page') ?? '1') || 1);
  const limit = Math.min(PAGINATION_MAX_LIMIT, Math.max(1, parseInt(get('limit') ?? String(PAGINATION_DEFAULT_LIMIT)) || PAGINATION_DEFAULT_LIMIT));
  return { page, limit, skip: (page - 1) * limit };
}

export function buildPaginationMeta(total: number, page: number, limit: number) {
  return { page, limit, total, totalPages: Math.ceil(total / limit) };
}

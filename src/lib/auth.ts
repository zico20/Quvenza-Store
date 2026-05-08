import { SignJWT, jwtVerify, type JWTPayload as JoseJWTPayload } from 'jose';
import bcrypt from 'bcryptjs';
import { AppError } from './errors';

const BCRYPT_ROUNDS = 12;

const ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'dev-only-fallback-secret-min-32-chars-aaaaaaaaa'
);
const REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET ?? 'dev-only-fallback-refresh-secret-different-aaaaa'
);
const ACCESS_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '15m';
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN ?? '7d';

export interface JwtPayload extends JoseJWTPayload {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthUser {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function generateTokens(payload: { id: string; email: string; role: string }) {
  const accessToken = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_EXPIRES_IN)
    .sign(ACCESS_SECRET);

  const refreshToken = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(REFRESH_EXPIRES_IN)
    .sign(REFRESH_SECRET);

  return { accessToken, refreshToken };
}

export async function verifyAccessToken(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, ACCESS_SECRET);
  return payload as JwtPayload;
}

export async function verifyRefreshToken(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, REFRESH_SECRET);
  return payload as JwtPayload;
}

export async function getAuthFromRequest(req: Request): Promise<AuthUser | null> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);
  try {
    const payload = await verifyAccessToken(token);
    return { id: payload.id, email: payload.email, role: payload.role };
  } catch {
    return null;
  }
}

export async function requireAuth(req: Request): Promise<AuthUser> {
  const user = await getAuthFromRequest(req);
  if (!user) throw new AppError('Authentication required.', 401);
  return user;
}

export async function requireAdmin(req: Request): Promise<AuthUser> {
  const user = await requireAuth(req);
  if (user.role !== 'ADMIN') throw new AppError('Admin access required.', 403);
  return user;
}

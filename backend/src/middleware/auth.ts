import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

/** Sir .env dan oʻqiladi. Boʻlmasa yoki zaif boʻlsa — server ishga tushmaydi. */
export function jwtSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 16 || s === 'fallback_secret') {
    throw new Error('JWT_SECRET sozlanmagan yoki juda zaif (kamida 16 belgi kerak).');
  }
  return s;
}

export const signToken = (user: { id: string; role: string }) =>
  jwt.sign({ id: user.id, role: user.role }, jwtSecret(), { expiresIn: '7d' });

function readToken(req: Request): string | null {
  const h = req.headers.authorization;
  if (!h) return null;
  const [scheme, token] = h.split(' ');
  return scheme === 'Bearer' && token ? token : null;
}

/** Token majburiy. */
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = readToken(req);
  if (!token) return res.status(401).json({ error: 'Tizimga kiring.' });
  try {
    const d = jwt.verify(token, jwtSecret()) as any;
    req.user = { id: d.id, role: d.role };
    next();
  } catch {
    return res.status(401).json({ error: 'Seans muddati tugagan. Qayta kiring.' });
  }
};

/** Token boʻlsa foydalanuvchini aniqlaydi, boʻlmasa davom etadi. */
export const optionalAuth = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const token = readToken(req);
  if (token) {
    try {
      const d = jwt.verify(token, jwtSecret()) as any;
      req.user = { id: d.id, role: d.role };
    } catch {}
  }
  next();
};

export const authenticate = authMiddleware;

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: 'Bu amal uchun ruxsat yoʻq.' });
    }
    next();
  };
};

export const adminOnly = [authenticate, authorize(['SUPER_ADMIN'])];

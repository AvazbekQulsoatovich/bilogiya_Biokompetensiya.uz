import { Request, Response, NextFunction } from 'express';

type Bucket = { count: number; reset: number };

/** Oddiy xotiradagi tezlik cheklovchi (IP + kalit boʻyicha). */
export function rateLimit(opts: { windowMs: number; max: number; key?: (req: Request) => string; message?: string }) {
  const hits = new Map<string, Bucket>();
  setInterval(() => {
    const now = Date.now();
    for (const [k, b] of hits) if (b.reset < now) hits.delete(k);
  }, 60_000).unref();

  return (req: Request, res: Response, next: NextFunction) => {
    const id = `${req.ip}|${opts.key ? opts.key(req) : ''}`;
    const now = Date.now();
    let b = hits.get(id);
    if (!b || b.reset < now) {
      b = { count: 0, reset: now + opts.windowMs };
      hits.set(id, b);
    }
    b.count += 1;
    if (b.count > opts.max) {
      res.setHeader('Retry-After', String(Math.ceil((b.reset - now) / 1000)));
      return res.status(429).json({ error: opts.message || "Juda koʻp urinish. Birozdan soʻng qayta urinib koʻring." });
    }
    next();
  };
}

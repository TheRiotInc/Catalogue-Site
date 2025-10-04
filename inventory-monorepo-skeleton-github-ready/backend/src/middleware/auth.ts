
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../server';

export async function requireAuth(req: any, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).send('no auth');
  const token = header.split(' ')[1];
  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return res.status(401).send('invalid user');
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send('invalid token');
  }
}

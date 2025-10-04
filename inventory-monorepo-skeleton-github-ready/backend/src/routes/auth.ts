
import express from 'express';
import { prisma } from '../server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send('bad');
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).send('invalid');
  const ok = bcrypt.compareSync(password, user.password);
  if (!ok) return res.status(401).send('invalid');
  const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '8h' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

export default router;

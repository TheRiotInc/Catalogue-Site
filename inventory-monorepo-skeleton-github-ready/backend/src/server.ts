
import express from 'express';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import authRouter from './routes/auth';
import inventoryRouter from './routes/inventory';
import { attachSocketHandlers } from './realtime';
import { initMQTT } from './iot/mqttBridge';

const app = express();
const server = http.createServer(app);
const io = new IOServer(server, { cors: { origin: '*' } });

export const prisma = new PrismaClient();
export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/inventory', inventoryRouter);

app.get('/health', (_, res) => res.json({ ok: true }));

attachSocketHandlers(io);
initMQTT({ redis, prisma });

const PORT = parseInt(process.env.PORT || '4000');
server.listen(PORT, () => console.log(`API + realtime listening on ${PORT}`));

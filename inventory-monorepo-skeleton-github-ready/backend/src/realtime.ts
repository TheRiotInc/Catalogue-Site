
import { Server as IOServer } from 'socket.io';
import Redis from 'ioredis';

export function attachSocketHandlers(io: IOServer) {
  io.on('connection', (socket) => {
    console.log('socket connected', socket.id);
    socket.on('subscribe', (payload: { room: string }) => socket.join(payload.room));
    socket.on('unsubscribe', (payload: { room: string }) => socket.leave(payload.room));
  });

  const sub = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  sub.psubscribe('inventory:*', (err, count) => {});
  sub.on('pmessage', (_, channel: string, message: string) => {
    const parts = channel.split(':');
    const type = parts[1];
    const id = parts[2];
    const payload = JSON.parse(message);
    if (type === 'update') {
      io.to(`product:${id}`).emit('inventory:update', payload);
      io.to(`location:${payload.locationId || 'all'}`).emit('inventory:update', payload);
    }
  });
}

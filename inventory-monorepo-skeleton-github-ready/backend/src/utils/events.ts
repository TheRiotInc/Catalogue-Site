
import { redis } from '../server';

export async function publishInventoryUpdate(productId: string, payload: any) {
  const ch = `inventory:update:${productId}`;
  await redis.publish(ch, JSON.stringify(payload));
}

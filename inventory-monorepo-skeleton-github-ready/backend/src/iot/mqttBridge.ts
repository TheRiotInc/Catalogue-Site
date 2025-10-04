
import mqtt from 'mqtt';
import { prisma, redis } from '../server';

export function initMQTT({ redis, prisma }: any) {
  try {
    const client = mqtt.connect(process.env.MQTT_URL || 'mqtt://localhost:1883');
    client.on('connect', () => client.subscribe('rfid/+/read'));
    client.on('message', async (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        const { tag, gatewayId } = payload;
        const batch = await prisma.batch.findFirst({ where: { serialNumber: tag } });
        if (batch) {
          await prisma.$executeRaw`INSERT INTO "TraceEvent"( "id", "batchId", "kind", "qty", "metadata", "createdAt") VALUES (gen_random_uuid(), ${batch.id}, 'RFID_DETECT', 1, ${JSON.stringify(payload)}, now())`;
          await redis.publish(`inventory:update:${batch.productId}`, JSON.stringify({ productId: batch.productId, locationId: 'unknown', qtyDelta: 0, meta: payload }));
        }
      } catch (err) { console.error('mqtt msg error', err); }
    });
  } catch (err) { console.error('mqtt init error', err); }
}

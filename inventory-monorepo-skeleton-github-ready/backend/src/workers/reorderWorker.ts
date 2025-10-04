
import { prisma } from '../server';
import { createPurchaseOrder } from '../services/poService';

async function run() {
  const low = await prisma.$queryRawUnsafe(`SELECT p.id, COALESCE(sum(i.qty),0) as total, COALESCE(p.threshold,10) as threshold FROM "Product" p LEFT JOIN "Inventory" i ON i."productId" = p.id GROUP BY p.id HAVING COALESCE(sum(i.qty),0) < COALESCE(p.threshold,10)`);
  for (const p of low) {
    const deficit = Math.max((p.threshold * 2) - p.total, 10);
    await createPurchaseOrder(p.id, deficit);
    console.log('created PO for', p.id, 'qty', deficit);
  }
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });

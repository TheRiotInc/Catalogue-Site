
import express from 'express';
import { prisma } from '../server';
import { publishInventoryUpdate } from '../utils/events';
import { requireAuth } from '../middleware/auth';
const router = express.Router();

router.get('/list', requireAuth, async (req, res) => {
  const items = await prisma.inventory.findMany({ include: { product: true, location: true } });
  res.json(items);
});

router.post('/scan', requireAuth, async (req, res) => {
  const { barcode, locationId, qty = 1 } = req.body;
  if (!barcode) return res.status(400).send('barcode required');
  const product = await prisma.product.findUnique({ where: { barcode } });
  if (!product) return res.status(404).send('product not found');
  // upsert inventory (find location or fallback)
  const locId = locationId || (await prisma.location.findFirst())?.id;
  if (!locId) return res.status(500).send('no location');
  await prisma.inventory.upsert({
    where: { productId_locationId: { productId: product.id, locationId: locId } },
    update: { qty: { increment: qty } },
    create: { productId: product.id, locationId: locId, qty }
  });
  await publishInventoryUpdate(product.id, { productId: product.id, locationId: locId, qtyDelta: qty });
  res.json({ ok: true });
});

router.post('/move', requireAuth, async (req, res) => {
  const { productId, fromLocationId, toLocationId, qty } = req.body;
  if (!productId || !fromLocationId || !toLocationId || !qty) return res.status(400).send('bad');
  try {
    await prisma.$transaction(async (tx) => {
      await tx.inventory.updateMany({ where: { productId, locationId: fromLocationId, qty: { gte: qty } }, data: { qty: { decrement: qty } } });
      await tx.inventory.upsert({ where: { productId_locationId: { productId, locationId: toLocationId } }, update: { qty: { increment: qty } }, create: { productId, locationId: toLocationId, qty } });
    });
    await publishInventoryUpdate(productId, { productId, locationId: toLocationId, qtyDelta: qty });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).send('error');
  }
});

export default router;

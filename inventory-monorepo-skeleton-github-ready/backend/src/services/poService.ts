
import { prisma } from '../server';

export async function createPurchaseOrder(productId: string, qty: number) {
  const product = await prisma.product.findUnique({ where: { id: productId }, include: { supplier: true } });
  if (!product || !product.supplier) return null;
  // naive create PO
  const po = await prisma.purchaseOrder.create({ data: { supplierId: product.supplier.id, createdById: 'system', status: 'PENDING', totalQty: qty } });
  return po;
}


import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main(){
  const hashed = bcrypt.hashSync('changeme', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { email: 'admin@example.com', name: 'Admin', password: hashed, role: 'ADMIN' }
  });

  const supplier = await prisma.supplier.upsert({
    where: { name: 'ACME Supplies' },
    update: {},
    create: { name: 'ACME Supplies', email: 'sales@acme.test', leadTimeDays: 7 }
  });

  const loc = await prisma.location.upsert({
    where: { name: 'Main Warehouse' },
    update: {},
    create: { name: 'Main Warehouse', type: 'WAREHOUSE', address: '123 Warehouse Rd' }
  });

  const prod = await prisma.product.upsert({
    where: { sku: 'ABC-001' },
    update: {},
    create: { sku: 'ABC-001', name: 'Widget A', unit: 'pcs', barcode: '1234567890123', supplierId: supplier.id, threshold: 20 }
  });

  await prisma.inventory.upsert({
    where: { productId_locationId: { productId: prod.id, locationId: loc.id } },
    update: {},
    create: { productId: prod.id, locationId: loc.id, qty: 100 }
  });

  console.log('seed complete');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

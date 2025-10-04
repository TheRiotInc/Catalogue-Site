#!/bin/sh
echo "Running migrations and seeding database..."
npx prisma migrate deploy
npx prisma db seed
echo "Starting backend..."
npm run start

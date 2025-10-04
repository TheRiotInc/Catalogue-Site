
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --production
COPY . .
RUN npx prisma generate || true
EXPOSE 4000
CMD ["node", "dist/server.js"]

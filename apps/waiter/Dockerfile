FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/waiter/package.json ./apps/waiter/
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY packages/shared ./packages/shared
COPY apps/waiter ./apps/waiter
COPY package.json ./
WORKDIR /app/apps/waiter
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /app/apps/waiter/.next/standalone ./
COPY --from=builder /app/apps/waiter/.next/static ./apps/waiter/.next/static
EXPOSE 3000
CMD ["node", "apps/waiter/server.js"]

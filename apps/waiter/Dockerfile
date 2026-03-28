FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/waiter/package.json ./apps/waiter/
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/waiter/node_modules ./apps/waiter/node_modules
COPY packages/shared ./packages/shared
COPY apps/waiter ./apps/waiter
COPY package.json package-lock.json ./
WORKDIR /app/apps/waiter
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /app/apps/waiter/.next/standalone ./
COPY --from=builder /app/apps/waiter/.next/static ./apps/waiter/.next/static
COPY --from=builder /app/apps/waiter/public ./apps/waiter/public 2>/dev/null || true
EXPOSE 3000
CMD ["node", "apps/waiter/server.js"]

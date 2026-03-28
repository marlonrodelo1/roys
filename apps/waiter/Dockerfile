FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/waiter/package.json ./apps/waiter/
RUN npm ci
COPY packages/shared ./packages/shared
COPY apps/waiter ./apps/waiter
WORKDIR /app/apps/waiter
RUN npm run build
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["npx", "next", "start", "-p", "3000"]

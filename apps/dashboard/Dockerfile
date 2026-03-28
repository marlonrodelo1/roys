FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/dashboard/package.json ./apps/dashboard/
RUN npm ci
COPY packages/shared ./packages/shared
COPY apps/dashboard ./apps/dashboard
WORKDIR /app/apps/dashboard
RUN npm run build
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["npx", "next", "start", "-p", "3000"]

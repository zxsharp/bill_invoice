FROM node:20-alpine AS builder
WORKDIR /app

# copy package files first for better caching
COPY package.json package-lock.json* tsconfig.json ./
COPY src ./src

RUN npm ci
RUN npm run build

FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

CMD ["node", "dist/server.js"]

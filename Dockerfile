# ════════════════ STAGE 1: BUILD FRONTEND ════════════════
FROM node:20-alpine AS frontend-builder
WORKDIR /app

# Copy root configurations and package.json
COPY package*.json ./
RUN npm ci

# Copy source code and build frontend assets
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
RUN npm run build

# ════════════════ STAGE 2: RUN TIME BACKEND ════════════════
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy backend configurations and package.json
COPY server/package*.json ./server/
RUN cd server && npm ci --only=production

# Create database persistent directory with write permissions for node user
RUN mkdir -p /data && chown -R node:node /data

# Copy built frontend assets from builder
COPY --from=frontend-builder /app/dist ./dist

# Copy backend code with appropriate ownership
COPY --chown=node:node server/ ./server/

# Set working user to node for security
USER node

EXPOSE 3001

# Run server
CMD ["node", "server/server.js"]

# ============================================
# Build Arguments
# ============================================
ARG BUILD_MODE=production

# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm install && npm cache clean --force

# ============================================
# Stage 2: Development
# ============================================
FROM deps AS development

WORKDIR /app

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ============================================
# Stage 3: Builder (for production)
# ============================================
FROM deps AS builder

WORKDIR /app

COPY . .
RUN npm run build

# ============================================
# Stage 4: Production
# ============================================
FROM nginx:alpine AS production

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

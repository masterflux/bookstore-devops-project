# ===========================
# Stage 1: Build Frontend (Next.js)
# ===========================
FROM node:18 AS frontend-builder

# Set working directory for frontend
WORKDIR /app/frontend

# Copy package.json and install dependencies
COPY frontend/bookstorefe/package.json ./
RUN npm install

# Copy frontend source code
COPY frontend/bookstorefe ./

# Build frontend
RUN npm run build

# ===========================
# Stage 2: Build Backend (Catalog Service - Plain JavaScript)
# ===========================
FROM node:18 AS catalogservice-builder

# Set working directory for catalogservice
WORKDIR /app/backend/catalogservice

# Copy package.json and install dependencies
COPY backend/catalogservice/package.json ./
RUN npm install

# Copy catalogservice source code
COPY backend/catalogservice ./

# ===========================
# Stage 3: Build Backend (Cart Service - NestJS TypeScript)
# ===========================
FROM node:18 AS cartservice-builder

# Set working directory for cartservice
WORKDIR /app/backend/cartservice

# Copy package.json and install dependencies
COPY backend/cartservice/package.json ./
RUN npm install

# Copy cartservice source code
COPY backend/cartservice ./

# Build cartservice (NestJS TypeScript project)
RUN npm run build

# ===========================
# Stage 4: Runtime Image
# ===========================
FROM node:18

# Set working directory
WORKDIR /app

# Copy built frontend from frontend-builder
COPY --from=frontend-builder /app/frontend /app/frontend

# Copy built catalogservice from catalogservice-builder
COPY --from=catalogservice-builder /app/backend/catalogservice /app/backend/catalogservice

# Copy built cartservice from cartservice-builder
COPY --from=cartservice-builder /app/backend/cartservice /app/backend/cartservice

# Install frontend dependencies (required for `npm start`)
WORKDIR /app/frontend
RUN npm install --production

# Expose backend and frontend ports
EXPOSE 3000 4000

# Set environment variables
ENV NODE_ENV=production

# Start both frontend and backend services
CMD ["sh", "-c", "node /app/backend/catalogservice/index.js & node /app/backend/cartservice/dist/main.js & npm start --prefix /app/frontend"]

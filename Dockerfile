# ===========================
# Stage 1: Build Frontend
# ===========================
FROM node:18 AS frontend-builder

WORKDIR /app/frontend

# Copy package files and install dependencies
COPY frontend/bookstorefe/package.json /app/frontend/
RUN npm install

# Copy frontend source code
COPY frontend/bookstorefe ./

# Build frontend 
RUN npm run build

# ===========================
# Stage 2: Build Backend
# ===========================
FROM node:18 AS backend-builder

WORKDIR /app/backend

# Install dependencies for catalogservice
WORKDIR /app/backend/catalogservice
COPY backend/catalogservice/package.json ./
RUN npm install
COPY backend/catalogservice ./

# Install dependencies for cartservice
WORKDIR /app/backend/cartservice
COPY backend/cartservice/package.json ./
RUN npm install
COPY backend/cartservice ./
RUN npm run build

# ===========================
# Stage 3: Runtime Image
# ===========================
FROM node:18

WORKDIR /app

# Copy built frontend and backend from build stages
COPY --from=frontend-builder /app/frontend/.next /app/frontend/.next
COPY --from=backend-builder /app/backend/catalogservice /app/backend/catalogservice
COPY --from=backend-builder /app/backend/cartservice /app/backend/cartservice

# Expose backend and frontend ports
EXPOSE 3000 4000  

# Set environment variables
ENV NODE_ENV=production

# Start both frontend and backend services
CMD ["sh", "-c", "node backend/catalogservice/dist/main.js & node backend/cartservice/dist/main.js & npm --prefix frontend/bookstorefe start"]

FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy .env.example file
COPY .env.example .env.example

# Set environment variables
ENV NODE_ENV=production

# Expose port if needed (for health checks, etc.)
# EXPOSE 8080

# Start the application
CMD ["node", "dist/index.js"] 

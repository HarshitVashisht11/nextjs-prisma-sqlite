# Base image for building the app
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application files
COPY . .

# Install SQLite CLI for Prisma
RUN apk add --no-cache sqlite

# Run Prisma migrations
RUN npx prisma migrate deploy

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js app with static export
RUN npm run build

# Production image
FROM nginx:alpine AS production

# Copy built static files to Nginx
COPY --from=base /app/out /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

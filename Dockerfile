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

# Build Next.js app
RUN npm run build

# Production image
FROM node:20-alpine AS production

WORKDIR /app

# Copy compiled app and dependencies
COPY --from=base /app/package.json /app/package-lock.json ./
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/next.config.ts ./next.config.ts

# Expose the port used by Next.js
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "start"]

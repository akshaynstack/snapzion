# Stage 1: Build the app
FROM node:18-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy dependency files first for efficient caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all project files, including .env.local
COPY . . 

# Build the Next.js app
RUN npm run build

# Stage 2: Create a minimal image to run the app
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy only the built files from Stage 1
COPY --from=builder /app ./

# Install only production dependencies
RUN npm install --production

# Copy .env.local into the container
COPY .env.local .env.local

# Expose the port Next.js runs on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
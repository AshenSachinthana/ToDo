# Use Node.js 18 on Alpine Linux (small size)
FROM node:22-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start NestJS in development mode (with hot reload)
CMD ["npm", "run", "start:dev"]
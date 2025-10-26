# Use Node.js 18 on Alpine Linux
FROM node:22-alpine
# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Expose port 3000
EXPOSE 5173

# Start React development server
CMD ["npm", "run", "dev"]
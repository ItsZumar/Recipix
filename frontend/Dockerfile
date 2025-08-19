FROM node:18-alpine

# Install necessary packages
RUN apk add --no-cache git

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose Expo ports
EXPOSE 19006 19000 19001 19002

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:19006 || exit 1

# Start Expo in web mode
CMD ["npm", "run", "web"]

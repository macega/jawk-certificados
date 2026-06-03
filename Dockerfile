# Use lightweight Node alpine image
FROM node:alpine

# Set application directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production

# Copy application source files
COPY server.js ./
COPY robots.txt ./
COPY index.html ./
COPY css/ ./css/
COPY js/ ./js/
COPY assets/ ./assets/

# Expose server port (configured in server.js/env)
EXPOSE 80

# Start server
CMD ["npm", "start"]

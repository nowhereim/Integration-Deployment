# Use the official Node.js image as a base
FROM node:22.4.1

# Set the working directory
WORKDIR /usr/src/app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .


# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 2323

# Run the application
CMD ["npm", "run", "start:prod"]

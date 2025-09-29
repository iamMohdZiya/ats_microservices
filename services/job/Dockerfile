FROM node:18

WORKDIR /app

# Copy package files first (important for npm install to work)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your service code
COPY . .

EXPOSE 4002

CMD ["node", "app.js"]

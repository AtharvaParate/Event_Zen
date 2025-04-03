FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN rm -rf node_modules && npm install

COPY . .

EXPOSE 8084
CMD ["npm", "start"] 
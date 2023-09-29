FROM node:18-alpine
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
RUN npx prisma generate

EXPOSE 2802

CMD ["node", "src/main.js"]
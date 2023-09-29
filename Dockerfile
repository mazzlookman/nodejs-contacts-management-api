FROM node:18-alpine
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
COPY .env .
RUN npx prisma generate
RUN npx prisma migrate dev

EXPOSE 3000

CMD ["node", "src/main.js"]
FROM node:20.11.1-alpine

WORKDIR /appilcation

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
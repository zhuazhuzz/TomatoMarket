FROM node:latest

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

RUN npm install -g nodemon

COPY . .

EXPOSE 4002

CMD ["nodemon", "index.js"]
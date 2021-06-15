FROM node:12.13-alpine

WORKDIR /usr/src/app

COPY ./Back-end/package*.json ./

RUN npm install

COPY ./Back-end/. .

RUN npm run build

CMD ["node", "dist/main"]
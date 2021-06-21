FROM node:12.13-alpine

WORKDIR /usr/src/app

COPY ./backend/package*.json ./

RUN npm install

COPY ./backend/. .

RUN npm run build

CMD ["node", "dist/main"]
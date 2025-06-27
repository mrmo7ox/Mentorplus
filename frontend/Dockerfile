FROM node:24

WORKDIR /app

COPY frontend/package*.json ./

RUN npm i

COPY frontend/ ./

EXPOSE 3000

CMD [ "npm", "start" ] 
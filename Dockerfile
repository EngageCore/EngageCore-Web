FROM node:20.18-alpine

WORKDIR /app
COPY . .
RUN npm install

EXPOSE 5173
ENTRYPOINT ["npm","run","dev"]
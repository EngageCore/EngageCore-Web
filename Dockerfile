# Static production build served by nginx.
# The previous image ran `npm run dev` (a Vite dev server) in production; that
# cost ~10x the memory and served unbundled sources. The original is kept as
# Dockerfile.devserver.
FROM node:20.18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

# Empty base URL => the app issues same-origin /api requests, which nginx
# proxies to engage-service. Avoids CORS and mixed content.
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL
ARG VITE_API_KEY=""
ENV VITE_API_KEY=$VITE_API_KEY

RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

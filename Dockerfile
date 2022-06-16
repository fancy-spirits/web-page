# Webpage
FROM node:16 as build-webpage

WORKDIR /usr/local/app

COPY ./fancy-spirits-webpage /usr/local/app/

RUN npm ci
RUN npm run build

# Backend
FROM node:16 as build-backend

WORKDIR /usr/local/app

COPY ./fancy-spirits-backend /usr/local/app/

RUN npm ci
RUN npm run build

# Serve
FROM nginx:latest
COPY --from=build-webpage /usr/local/app/dist/fancy-spirits-webpage /usr/share/nginx/html/webpage
COPY --from=build-backend /usr/local/app/dist/fancy-spirits-backend /usr/share/nginx/html/backend

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
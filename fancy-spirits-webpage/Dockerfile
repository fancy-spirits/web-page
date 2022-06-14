# Build
FROM node:16 as build

WORKDIR /usr/local/app

COPY ./ /usr/local/app/

RUN npm ci
RUN npm run build

# Serve
FROM nginx:latest
COPY --from=build /usr/local/app/dist/fancy-spirits-webpage /usr/share/nginx/html

EXPOSE 80
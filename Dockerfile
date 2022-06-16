# Build
FROM node:16 as build

WORKDIR /usr/local/app

COPY ./fancy-spirits-webpage /usr/local/app/
COPY ./fancy-spirits-backend /usr/local/app/backend

RUN npm ci
RUN npm run build

RUN cd backend && npm ci
RUN cd backend && npm run build

# Serve
FROM nginx:latest
COPY --from=build /usr/local/app/dist/fancy-spirits-webpage /usr/share/nginx/html
COPY --from=build /usr/local/app/backend/dist/fancy-spirits-backend /usr/share/nginx/html/backend

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
FROM node:16

WORKDIR /usr/local/app

COPY . /usr/local/app/

RUN npm ci
RUN npm run build

ENV PORT=5000

EXPOSE 5000

CMD ["node", "dist/app.js"]
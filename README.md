# readme

## frontend 
frontend code: This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

example dockerfile

``` sh
FROM node:18-alpine
cd frontend/bookstorefe
RUN npm install --omit=dev
RUN npm build
EXPOSE 3000
CMD ["npm", "start"]
```

## backend - catalog
use expresjs based on Nodejs  (https://github.com/expressjs/express)

example dockerfile

``` sh
FROM node:18-alpine
cd backend/catalogservice
RUN npm install --omit=dev
EXPOSE 3001
CMD ["node", "index.js"]
```

## backend - cart and user
use nestjs based on Nodejs  (https://github.com/nestjs/nest)

example dockerfile

``` sh
FROM node:18-alpine
cd backend/cartservice
RUN npm install --omit=dev
RUN npm build
EXPOSE 3002
CMD ["node", "dist/main"]
```
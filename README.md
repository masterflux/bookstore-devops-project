# readme

## frontend 
frontend code: This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

example dockerfile

``` sh
FROM node:22
cd frontend/bookstorefe
RUN npm i 
RUN next build
RUN next start
```
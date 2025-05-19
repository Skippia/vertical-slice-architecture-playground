FROM node:20-alpine as development

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY pnpm-lock.yaml /usr/src/app/
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install -g pnpm

COPY apps/checkout-service apps/checkout-service

COPY libs libs

RUN pnpm install -r

RUN npm run build checkout-service

FROM node:20-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY pnpm-lock.yaml /usr/src/app/

RUN npm install -g pnpm

RUN pnpm install --prod

COPY --from=development /usr/src/app/dist ./dist

RUN pwd
RUN ls -a

CMD ["node", "./dist/apps/checkout-service/main"]


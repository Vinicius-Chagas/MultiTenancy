# Build stage

FROM node:alpine AS builder

WORKDIR /app

COPY package*.json yarn.lock .yarnrc.yml ./

RUN corepack enable

RUN yarn set version stable

RUN yarn install --immutable

COPY . .

RUN yarn build

# Production stage

RUN yarn cache clean

ARG PORT

ENV PORT=${PORT}

EXPOSE ${PORT}

CMD [ "yarn migration:run && yarn start:prod" ]
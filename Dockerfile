  
FROM node:16-alpine as builder

WORKDIR /usr/app

COPY package.json .
COPY yarn.lock .

RUN yarn --frozen-lockfile

COPY . .

RUN yarn build

# * ====================
FROM node:16-alpine as modules

WORKDIR /usr/app

RUN apk --no-cache add curl bash
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin

COPY package.json .
COPY yarn.lock .

RUN yarn --frozen-lockfile --production
#RUN npm install -g npm@7.20.0
# RUN npm prune --production
RUN /usr/local/bin/node-prune

# * ====================
FROM alpine:latest as main

RUN apk --no-cache add nodejs=14.17.1-r0

WORKDIR /usr/app/

COPY --from=modules /usr/app/node_modules node_modules
COPY --from=builder /usr/app/.next .next
COPY package.json .
COPY public .

ENV NODE_ENV production

CMD ["./node_modules/next/dist/bin/next", "start"]
EXPOSE 3000

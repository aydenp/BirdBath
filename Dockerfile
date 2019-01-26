FROM node:carbon

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn client-prod

EXPOSE 8080
CMD [ "yarn", "server-prod" ]
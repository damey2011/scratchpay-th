FROM node:16.20.0 as app-base

LABEL maintainer="Damilola Adeyemi <adeyemidamilola3@gmail.com>"

WORKDIR /usr/app/

COPY ./package*.json /usr/app/

RUN npm install -g typescript ts-node-dev

RUN npm install

COPY ./tsconfig.json ./jest.*.config.js ./.env.sample /usr/app/

COPY ./src /usr/app/src/

COPY ./tests  /usr/app/tests/

EXPOSE 8080

FROM app-base as app-ci

RUN npm run build

RUN npm prune --production

CMD ["npm", "run", "start"]

FROM app-base as app-dev

CMD ["npm", "run", "dev"]

# https://medium.com/@kartikio/setup-node-ts-local-development-environment-with-docker-and-hot-reloading-922db9016119
FROM node:16-alpine

RUN mkdir -p /app/node_modules && chown -R node:node /app

WORKDIR /app

COPY package.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 3001

ENV NODE_ENV=development

CMD ["npm", "run", "development"]
FROM node:16.14.2
WORKDIR /wd
COPY ./package.json .
COPY ./package-lock.json .
RUN npm ci
COPY ./src ./src
COPY ./test ./test
RUN npm run build
RUN mv ./dist /dist

FROM node:18.13.0-alpine as build
ADD package.json /package.json
ENV NODE_PATH=/node_modules
ENV PATH=$PATH:/node_modules/.bin
WORKDIR /app
ADD . /app
RUN npm install --silent
RUN npm run
EXPOSE 80
CMD [ "npm", "start" ]
FROM node

WORKDIR /code
COPY package.json .
COPY package-lock.json .
RUN npm install

ENV PATH /code/node_modules/.bin:$PATH

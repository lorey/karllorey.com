FROM node

# Install dependencies outside of /code so they don't get overwritten by bind mount
WORKDIR /deps
COPY package.json package-lock.json ./
RUN npm install

ENV NODE_PATH=/deps/node_modules
ENV PATH=/deps/node_modules/.bin:$PATH

WORKDIR /code

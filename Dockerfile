# app prepare
FROM node:14.18.1-alpine3.14
WORKDIR /usr
COPY package.json package-lock.json ./
COPY tsconfig.build.json tsconfig.json ./
COPY src ./src
RUN npm install
RUN npm run build

# app run in production mode
FROM node:14.18.1-alpine3.14
WORKDIR /usr
COPY package.json package-lock.json config/ ./
RUN npm install --only=production
COPY --from=0 /usr/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]

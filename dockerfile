FROM node:22

# cwd
WORKDIR /usr/src/app

# set version variable
ARG VERSION
ENV APPLICATION_VERSION=${VERSION}

# copy pkg files
COPY package*.json ./
COPY prisma ./prisma/

# install deps
RUN npm install

# generate prisma client
RUN npx prisma generate

# copy code
COPY . .

# build both the api & web
RUN npm run web:build
RUN npm run api:build

# copy built code
COPY --from=builder ./dist /usr/src/app/dist
COPY --from=builder ./src/router/dist /usr/src/app/api-dist

# copy prisma setup
COPY prisma ./prisma

# setup environment
ENV NODE_ENV production
ENV PORT 3000
EXPOSE $PORT

# healthcheck config
HEALTHCHECK --interval=10s --timeout=3s --start-period=20s \
    CMD curl -f http://localhost:$PORT/api/health || exit 1

# start
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]


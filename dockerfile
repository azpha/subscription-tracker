FROM node:22

# cwd
WORKDIR /usr/src/app

# set version variable
ARG VERSION
ENV APPLICATION_VERSION=${VERSION}

# setup project
COPY package*.json ./
RUN npm install

# copy files & setup database
COPY . .

# expose router
ENV PORT 3000
EXPOSE $PORT

# healthcheck
HEALTHCHECK --interval=10s --timeout=3s --start-period=20s \
    CMD curl -f http://localhost:$PORT/api/health || exit 1

# start service
CMD ["npm", "run", "start"]


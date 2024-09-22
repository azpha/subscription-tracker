FROM node:22

# cwd
WORKDIR /usr/src/app

# setup project
COPY package*.json ./
RUN npm install

# copy files & setup database
COPY . .
RUN npm run api:db:push

# expose router
EXPOSE 3000

# start service
CMD ["npm", "run", "start"]


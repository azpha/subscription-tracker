FROM node:22
WORKDIR /usr/src/app

# for pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# app config
COPY package*.json .

# copy files
COPY prisma ./prisma
COPY . .
RUN npm i -g serve
RUN pnpm i

# build apps
ENV NODE_ENV production
RUN npm run build:api
RUN npm run build:web

# expose ports
EXPOSE 3000
EXPOSE 3001

# run app
CMD [ "sh", "-c", "pnpm run db:deploy && pnpm run start" ]
# subscription-tracker

Easily manage your subscriptions, get notified when they are expiring.
Design inspired by [Kumail Nanji](https://x.com/KumailNanji/status/1837108447642538368)

# Running

Running this project is fairly simple. You can either run it in Docker or via a process manager like PM2.

## Docker

You can run this via the CLI;

```bash
docker run -d \
    --name tracker \
    -p 3000:3000 \
    -e DISCORD_WEBHOOK=https://discord.com/api/webhooks/ \
    -e TIMEZONE=America/New_York \
    -v sub-tracker-data:/usr/src/app \
    ghcr.io/azpha/subscription-tracker:latest
```

or, if you would prefer docker-compose, there is an [example script](./docker-compose.yml) in this repository that you can deploy with.

# Running Locally

This project is fairly easy to run locally. All you need to do is

- create a `.env` in the root directory with the below contents
- use 2 terminals
  - run `npm run api:dev` in one
  - run `npm run web:dev` in the other
- access at `localhost:3000`

Change values as needed;

```bash
PROXY="true" # proxies / requests to Vite server for HMR
DISCORD_WEBHOOK=https://discord.com/api/webhooks/... # webhook
TIMEZONE=America/New_York # IANA timezone
```

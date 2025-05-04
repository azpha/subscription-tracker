# subscription-tracker

A simple tracker for all of your subscriptions.

<a href="https://github.com/azpha/subscription-tracker">
<img alt="GPL 2.0 License" src="https://img.shields.io/github/license/azpha/subscription-tracker.svg"/>
</a>
<a href="https://github.com/azpha/subscription-tracker/releases">
<img alt="Current Release" src="https://img.shields.io/github/release/azpha/subscription-tracker.svg"/>
</a>

---

This is a simple subscription-tracker to track & monitor all of your ongoing
financial subscriptions. It has support for Discord notifications, with Slack
and support for other webhooks in progress.

## Deployment

Included in this repository is a `docker-compose.yaml` to quickly deploy via
a Docker container. It includes a MariaDB container which you can configure as
you wish. I highly recommend changing the `super_secret` credentials for the
database lol, just modify the environment variables in the compose config.

```yaml
networks:
  subs-network:
    name: subs-network
volumes:
  subs-db:

services:
  db:
    image: mariadb
    restart: unless-stopped
    networks:
      - subs-network
    volumes:
      - subs-db:/var/lib/mysql
    environment:
      MARIADB_ROOT_PASSWORD: super_secret
      MARIADB_USER: subscription
      MARIADB_PASSWORD: super_secret
      MARIADB_DATABASE: subscription
    healthcheck:
      test: ["CMD", "healthcheck.sh", "--connect", "--innodb_initialized"]
      start_period: 10s
      interval: 10s
      timeout: 5s
      retries: 3

  subscription-tracker:
    image: ghcr.io/azpha/subscription-tracker:latest
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
    networks:
      - subs-network
    ports:
      - 3000:3000
      - 3001:3001
    environment:
      - DATABASE_URL=mysql://subscription:super_secret@db:3306/subscription
      - DISCORD_WEBHOOK=https://discord.com/api/webhooks/xxxxxxxxx/xxxxxxx
```

## Development

The first step is setting up a database. I run MariaDB in WSL, but it is up to you
what you do. Once you have a database setup, install project dependencies using **pnpm**.

```bash
pnpm i
```

This project also uses **Prisma**, so you'll have to apply all migrations to the database. You can do that using the `db:dev:apply` script.

```bash
pnpm run db:dev:apply
```

After you've done that, you're good to go! Run the dev script of the component you're working on, or both in separate terminals if you're modifying both.

```bash
pnpm run dev:api
pnpm run dev:web
```

**That's it!** You're all setup to contribute to subscription-tracker.

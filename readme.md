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
financial subscriptions. It has support for Discord & Ntfy notifications, with Slack
and support for other webhooks in progress.

## Deployment

Included in this repository is a `docker-compose.yaml` to quickly deploy via
a Docker container.

```yaml
volumes:
  subs:

services:
  subscription-tracker:
    image: ghcr.io/azpha/subscription-tracker:latest
    restart: unless-stopped
    ports:
      - 3000:3000
    volumes:
      - "subs:/app"
    environment:
      - BASE_URL=https://subs.domain.tld
```

## Configuration

There are a few configuration changes you can make to make your instance yours. All can be placed in the `enivronment` section of the docker-compose config as displayed above.

- `BASE_URL` - the hostname of your subscription-tracker instance. Used for sending you to your instance when clicking on notifications

## Development

Install project dependencies using **pnpm**.

```bash
pnpm i
```

This project uses **Prisma** as an ORM, you can find all the code related to this in the `packages/prisma` folder. You'll need to deploy migrations to a local SQLite database

```bash
pnpm run db:migrate
```

After you've done that, you're good to go! Run the dev script of the component you're working on, or both in separate terminals if you're modifying both.

```bash
pnpm run dev:api
pnpm run dev:web
```

**That's it!** You're all setup to contribute to subscription-tracker.

## Components

### frontend

The frontend application, built using the **Vite** framework in React + TypeScript.

```
| frontend
|   src
|     assets <- static assets
|     components <- react components
|     utils <- utilities like the API interface + types
|     App.tsx <- the SPA
|     main.tsx <- the root of React
```

### backend

The API application, built using **Express**. All database operations are done with **Prisma ORM**, request validation using **Zod**.

```
| backend
|   src
|     index.ts <- root of the Express project
|     cron.ts <- the logic for the Cronjob that runs at midnight
|     controllers <- business logic for endpoints
|     routers <- endpoint configuration
|     utils <- database configuration, request schemas
```

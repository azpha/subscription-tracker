<img alt="Subber Logo" width="100" src="https://storage.alexav.gg/content/subber.png" />

# subber

<a href="https://github.com/azpha/subber">
<img alt="GPL 2.0 License" src="https://img.shields.io/github/license/azpha/subber.svg"/>
</a>
<a href="https://github.com/azpha/subber/releases">
<img alt="Current Release" src="https://img.shields.io/github/release/azpha/subber.svg"/>
</a>
<a href="https://github.com/azpha/subber/actions">
<img alt="Build Workflow" src="https://img.shields.io/github/actions/workflow/status/azpha/subber/docker-publish.yml">
</a>

Easily track all of your active subscriptions & get notified when you're about to be charged. Has support for both Discord and Ntfy notifications depending on your preferences.

## Table of Contents

- [Deployment](#deployment)
- [Configuration](#configuration)
- [Development](#development)
  - [Prisma](#Prisma)

---

## Deployment

Docker is the most recommended way to deploy this service. There is a handy `docker-compose.yml` file in the root of the repository if you need. It should look something like this

```yaml
volumes:
  subs:

services:
  subber:
    image: ghcr.io/azpha/subber:latest
    restart: unless-stopped
    ports:
      - 3000:3000
    volumes:
      - "subs:/files"
    environment:
      - BASE_URL=https://subs.domain.tld
```

## Configuration

There are a few configuration changes you can make to make your instance yours. All can be placed in the `enivronment` section of the docker-compose config as displayed above.

- `BASE_URL` - the hostname of your subber instance (w/o a trailing slash). Used for sending you to your instance when clicking on notifications

## Development

Pretty simple to get started with;

```bash
pnpm i
pnpm --filter database run db:migrate # sets up initial migrations
pnpm run dev
```

And you should be up and running!

### Prisma

When you modify the Prisma schema, make sure to run a migration and then rebuild the Database package.

```
pnpm --filter database run db:migrate
pnpm --filter database build
```

This ensures the latest Prisma client + types are given to the backend.

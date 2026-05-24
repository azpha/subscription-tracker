# subber

<a href="https://github.com/azpha/subber">
<img alt="GPL 2.0 License" src="https://img.shields.io/github/license/azpha/subber.svg"/>
</a>
<a href="https://github.com/azpha/subber/releases">
<img alt="Current Release" src="https://img.shields.io/github/release/azpha/subber.svg"/>
</a>

Easily track all of your active subscriptions & get notified when you're about to be charged. Has support for both Discord and Ntfy notifications depending on your preferences.

## Deployment

Docker is the most recommended way to deploy this service. There is a handy `docker-compose.yml` file in the root of the repository if you need. It should look something like this

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
      - "subs:/files"
    environment:
      - BASE_URL=https://subs.domain.tld
```

## Configuration

There are a few configuration changes you can make to make your instance yours. All can be placed in the `enivronment` section of the docker-compose config as displayed above.

- `BASE_URL` - the hostname of your subber instance (w/o a trailing slash). Used for sending you to your instance when clicking on notifications

## Development

Install project dependencies using **pnpm**.

```bash
pnpm i
```

This project uses **Prisma** as an ORM, you can find all the code related to this in the `packages/prisma` folder. You'll need to deploy migrations to a local SQLite database

```bash
pnpm --filter database run db:migrate
```

After you've done that, you're good to go! Run the dev script of the component you're working on, or both in separate terminals if you're modifying both.

```bash
pnpm run dev:api
pnpm run dev:web
```

**That's it!** You're all setup to contribute to subber.

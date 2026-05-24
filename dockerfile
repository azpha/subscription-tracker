# ── base ──────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ── deps ──────────────────────────────────────────────────────────────────────
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json  ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/database/package.json ./packages/database/

RUN pnpm install --frozen-lockfile --prod=false

# ── builder ───────────────────────────────────────────────────────────────────
FROM deps AS builder
WORKDIR /app

RUN pnpm install -g typescript

COPY . .

RUN pnpm run build

# ── runner ────────────────────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app

RUN mkdir -p ./files

ARG VERSION
ENV APPLICATION_VERSION=${VERSION}
ENV NODE_ENV=production

COPY --from=builder /app/apps/backend/package.json    ./apps/backend/package.json
COPY --from=builder /app/apps/backend/dist            ./apps/backend/dist
COPY --from=builder /app/apps/backend/node_modules    ./apps/backend/node_modules
COPY --from=builder /app/apps/frontend/package.json   ./apps/frontend/package.json
COPY --from=builder /app/apps/frontend/dist           ./apps/frontend/dist
COPY --from=builder /app/packages/database            ./packages/database
COPY --from=builder /app/node_modules                 ./node_modules
COPY --from=builder /app/package.json                 ./package.json
COPY --from=builder /app/pnpm-workspace.yaml          ./pnpm-workspace.yaml

EXPOSE 3000

CMD ["pnpm", "run", "start"]
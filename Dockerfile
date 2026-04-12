FROM oven/bun:1.3.12-alpine AS base

FROM base AS builder
WORKDIR /build
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM base
COPY --from=builder /build/.output/server server
RUN adduser -D app
USER app
ENTRYPOINT ["/server"]

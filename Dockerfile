FROM oven/bun:1.3.12-alpine AS builder
WORKDIR /build
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM alpine:3.21
RUN apk add --no-cache libstdc++ libgcc
COPY --from=builder /build/.output/server server
RUN adduser -D app
USER app
ENTRYPOINT ["/server"]

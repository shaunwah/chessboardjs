FROM oven/bun

WORKDIR /app

COPY . .
RUN bun install --frozen-lockfile
COPY . .

ENV PORT=3000

EXPOSE ${PORT}

ENTRYPOINT bun run /app/index.ts
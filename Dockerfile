# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install

# Copy the rest of the files
COPY . ./

# Final stage
FROM oven/bun:1 AS runner

WORKDIR /app

# Copy node_modules and source code
COPY --from=builder /app /app

ENV NODE_ENV=production

# Run migrations on production db
RUN bun db:generate
RUN bun db:migrate

# Start the application
CMD ["bun", "run", "start"]

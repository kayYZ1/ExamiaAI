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

# Run migrations on production db
RUN bun db:generate-prod
RUN bun db:migrate-prod

# Start the application
CMD ["bun", "run", "start"]

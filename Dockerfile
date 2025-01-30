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

# Start the application
CMD ["bun", "run", "start"]

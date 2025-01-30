# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copy the rest of the files
COPY . ./

# Final stage
FROM oven/bun:1 AS runner

WORKDIR /app

# Copy node_modules and source code
COPY --from=builder /app /app

# Set environment variables (if needed)
ENV NODE_ENV=production

# Start the application
CMD ["bun", "run", "start"]

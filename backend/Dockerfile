# Stage 1: Build the Go binary
FROM golang:1.23 AS builder

WORKDIR /app

# Copy go.mod and go.sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the source code
COPY . .

# Build the Go app
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o app .

# Stage 2: Run the Go binary in a smaller environment
FROM debian:bullseye-slim

# Install CA certificates
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN useradd -m appuser

WORKDIR /app

# Copy built binary from builder stage
COPY --from=builder /app/app .

# Switch to non-root user
USER appuser

# Expose port (change if different)
EXPOSE 8080

# Run the binary
CMD ["./app"]

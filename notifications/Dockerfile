# Étape de build
FROM golang:1.21.3-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o notifications-service

# Étape d'exécution
FROM alpine:3.18.4
WORKDIR /app
COPY --from=builder /app/notifications-service .
EXPOSE 3000
CMD ["./notifications-service"]
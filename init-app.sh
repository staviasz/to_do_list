#!/bin/sh

echo "Installing dependencies..."
pnpm install
echo "Dependencies already installed."

# echo "Running migrations..."
# pnpm prisma generate
# pnpm prisma migrate deploy

# echo "Running seeders..."
# pnpm prisma:seed

echo "Starting server..."
pnpm start:dev

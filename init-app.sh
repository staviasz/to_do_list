#!/bin/sh

echo "Installing dependencies..."
pnpm install
echo "Dependencies already installed."

echo "Running migrations..."
pnpm prisma:deploy


echo "Starting server..."
pnpm run start:dev

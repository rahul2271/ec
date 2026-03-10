#!/bin/bash

# Generate Prisma client
echo "Generating Prisma client..."
cd /vercel/share/v0-project
npx prisma generate

echo "Prisma client generated successfully!"

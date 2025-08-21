#!/bin/bash

echo "🚀 Starting Adminify Demo..."
echo ""

# Build all packages
echo "📦 Building packages..."
cd packages/adminify-plugin && pnpm build
cd ../..

# Start the example CLI with adminify plugin
echo "🎯 Starting example CLI with Adminify plugin..."
cd apps/example-cli

# Run the dev server through the plugin
./bin/dev.js dev
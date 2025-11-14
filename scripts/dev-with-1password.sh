#!/bin/bash

# Development script using 1Password CLI for credentials
# This script injects secrets from 1Password at runtime

echo "🔐 Starting development server with 1Password credentials..."

# Check if 1Password CLI is installed
if ! command -v op &> /dev/null; then
    echo "❌ 1Password CLI (op) is not installed."
    echo "Please install it from: https://developer.1password.com/docs/cli/get-started"
    exit 1
fi

# Check if user is signed in to 1Password
if ! op account list &> /dev/null; then
    echo "📝 Please sign in to 1Password:"
    eval $(op signin)
fi

# Run the dev server with injected environment variables
echo "🚀 Starting TinaCMS with credentials from 1Password..."
op run --env-file="./.env.1password.template" -- npm run dev
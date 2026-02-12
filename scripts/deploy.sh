#!/bin/bash

echo "Deploying Bitcoin Lending Protocol..."

# Check if clarinet is installed
if ! command -v clarinet &> /dev/null; then
    echo "Error: Clarinet not found. Please install it first."
    exit 1
fi

# Deploy contracts
echo "Deploying contracts..."
clarinet integrate

echo "Deployment complete!"

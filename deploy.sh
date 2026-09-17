#!/bin/bash

# Define color codes
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if the environment is passed as an argument
if [ -z "$1" ]; then
  echo -e "${RED}No environment specified. Usage: ./deploy.sh [development|production]${NC}"
  exit 1
fi

ENV=$1

# Set the correct directory based on the environment
if [ "$ENV" = "production" ]; then
  APP_DIR="/home/propwebsite/n8n.proposaly.io"
  PM2_ENV="production"
  GIT_BRANCH="production"
elif [ "$ENV" = "development" ]; then
  APP_DIR="/home/propwebsite/test-n8n.proposaly.io"
  PM2_ENV="development"
  GIT_BRANCH="main"
else
  echo -e "${RED}Invalid environment specified. Usage: ./deploy.sh [development|production]${NC}"
  exit 1
fi

# Navigate to the project directory
if ! cd "$APP_DIR"; then
  echo -e "${RED}Failed to cd to $APP_DIR. Aborting deployment.${NC}"
  exit 1
fi

# Pull the latest changes from the git repository
if ! git pull origin "$GIT_BRANCH"; then
  echo -e "${RED}Failed to pull latest changes. Aborting deployment.${NC}"
  exit 1
fi

# Uninstall current build and node modules
rm -rf node_modules

# Install dependencies
if ! npm install; then
    echo -e "${RED}Failed to install dependencies. Aborting deployment.${NC}"
    exit 1
fi

# Build the node
if ! npm run build; then
    echo -e "${RED}Build failed. Aborting deployment without restarting PM2.${NC}"
    exit 1
fi

# Link the node
if ! npm link; then
    echo -e "${RED}Failed to link the node. Aborting deployment without restarting PM2.${NC}"
    exit 1
fi

# The link should have been made before running this script, if not, do the following:
# Go to ~/.n8n/nodes: npm link n8n-nodes-proposaly

# Check if the PM2 process is already running
if pm2 list | grep -q "n8n"; then
  echo "PM2 process already running. Restarting..."
  if ! pm2 restart ecosystem.config.js --env $ENV; then
    echo -e "${RED}Failed to restart PM2. Aborting deployment.${NC}"
    exit 1
  fi
else
  echo "No PM2 process found. Starting new process..."
  if ! pm2 start ecosystem.config.js --env $ENV; then
    echo -e "${RED}Failed to start PM2. Aborting deployment.${NC}"
    exit 1
  fi
fi

echo "Deployment to $ENV environment completed successfully."

#!/bin/bash

# Script to commit and push recent changes to GitHub
# Usage: ./scripts/commit-and-push.sh

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== EventZen - Commit and Push Script ===${NC}"

# Check if there are changes to commit
if [ -z "$(git status --porcelain)" ]; then
  echo -e "${RED}No changes to commit.${NC}"
  exit 0
fi

# Show the changes that will be committed
echo -e "${YELLOW}The following changes will be committed:${NC}"
git status --short

# Confirm whether to proceed
read -p "Do you want to proceed with committing these changes? (y/n): " confirm
if [[ $confirm != [yY] && $confirm != [yY][eE][sS] ]]; then
  echo -e "${RED}Operation cancelled.${NC}"
  exit 0
fi

# Get commit message
echo -e "${YELLOW}Enter a meaningful commit message:${NC}"
read -e commit_message

if [ -z "$commit_message" ]; then
  commit_message="Fix: Registration event display issue and documentation update"
  echo -e "${YELLOW}Using default commit message: ${commit_message}${NC}"
fi

# Stage the changes
echo -e "${GREEN}Staging changes...${NC}"
git add .

# Commit the changes
echo -e "${GREEN}Committing changes...${NC}"
git commit -m "$commit_message"

# Check if there's a remote set
if ! git remote | grep -q origin; then
  echo -e "${RED}No remote repository 'origin' found.${NC}"
  exit 1
fi

# Push the changes
echo -e "${YELLOW}Do you want to push the changes to the remote repository? (y/n): ${NC}"
read -p "" push_confirm

if [[ $push_confirm != [yY] && $push_confirm != [yY][eE][sS] ]]; then
  echo -e "${YELLOW}Changes have been committed locally but not pushed.${NC}"
  echo -e "${YELLOW}Use 'git push' when you are ready to push the changes.${NC}"
  exit 0
fi

# Get the current branch
current_branch=$(git rev-parse --abbrev-ref HEAD)

echo -e "${GREEN}Pushing changes to origin/${current_branch}...${NC}"
git push origin $current_branch

if [ $? -eq 0 ]; then
  echo -e "${GREEN}Successfully pushed changes to GitHub!${NC}"
else
  echo -e "${RED}Failed to push changes. Please check your connection and permissions.${NC}"
  echo -e "${YELLOW}You can manually push using: git push origin ${current_branch}${NC}"
fi

exit 0 
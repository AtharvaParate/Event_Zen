#!/bin/bash

# Script to verify that all required image directories exist
# and create them if necessary

FRONTEND_DIR="./frontend"
PUBLIC_DIR="$FRONTEND_DIR/public"
IMAGES_DIR="$PUBLIC_DIR/images"

# Image directories to check
DIRECTORIES=(
  "$IMAGES_DIR"
  "$IMAGES_DIR/events"
  "$IMAGES_DIR/profiles"
  "$IMAGES_DIR/vendors"
  "$IMAGES_DIR/defaults"
)

echo "Checking image directories for EventZen..."

# Check if public directory exists
if [ ! -d "$PUBLIC_DIR" ]; then
  echo "❌ Error: Public directory not found at $PUBLIC_DIR"
  exit 1
fi

# Create image directories if they don't exist
for dir in "${DIRECTORIES[@]}"; do
  if [ ! -d "$dir" ]; then
    echo "Creating directory: $dir"
    mkdir -p "$dir"
  else
    echo "✅ Directory exists: $dir"
  fi
done

# Check for required default images
DEFAULT_IMAGES=(
  "$IMAGES_DIR/defaults/event-default.jpg"
  "$IMAGES_DIR/defaults/profile-default.jpg"
  "$IMAGES_DIR/defaults/vendor-default.jpg"
)

for img in "${DEFAULT_IMAGES[@]}"; do
  if [ ! -f "$img" ]; then
    echo "⚠️ Warning: Default image not found: $img"
    
    # Create placeholder images if they don't exist
    dir=$(dirname "$img")
    if [ ! -d "$dir" ]; then
      mkdir -p "$dir"
    fi
    
    # Create an empty image file with a note
    echo "This is a placeholder. Replace with a real image." > "$img"
    echo "Created placeholder for $img"
  else
    echo "✅ Default image exists: $img"
  fi
done

echo "Image directory verification complete!"
exit 0 
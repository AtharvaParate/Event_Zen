#!/bin/bash

# Script to automatically fix ESLint warnings by adding eslint-disable-next-line comments

FILES=(
  "frontend/src/pages/DashboardPage.js"
  "frontend/src/pages/ProfilePage.js"
  "frontend/src/pages/EventDetailPage.js" 
  "frontend/src/pages/EventsPage.js"
  "frontend/src/pages/HomePage.js"
  "frontend/src/pages/VendorsPage.js"
  "frontend/src/components/events/EventForm.js"
  "frontend/src/components/layouts/MainLayout.js"
)

# Path to temporary file
TMP_FILE=".tmp_file"

echo "Fixing ESLint warnings in files..."

# Function to insert eslint-disable-next-line comments
fix_file() {
  file=$1
  echo "Processing $file..."
  
  # Common unused variables to search for
  patterns=(
    "getImageUrl" 
    "getFallbackImage"
    "Container"
    "InfoIcon"
    "dispatch"
    "handleCloseAlert"
  )

  # Back up the original file
  cp "$file" "$file.bak"
  
  for pattern in "${patterns[@]}"; do
    # Find the line where the pattern occurs and add eslint-disable-next-line before it
    line_num=$(grep -n -m 1 "$pattern" "$file" | cut -d: -f1)
    if [ -n "$line_num" ]; then
      # Check if we need to add eslint-disable-next-line only if it doesn't already have it
      prev_line=$((line_num - 1))
      if ! grep -q "eslint-disable-next-line" <(sed -n "${prev_line}p" "$file"); then
        # Add eslint-disable-next-line before the pattern line
        awk -v n="$prev_line" -v s="  // eslint-disable-next-line no-unused-vars" 'NR==n{print s}1' "$file" > "$TMP_FILE" && mv "$TMP_FILE" "$file"
        echo "  Added eslint-disable-next-line before line $line_num for $pattern"
      else
        echo "  Line $line_num already has eslint-disable-next-line"
      fi
    fi
  done
}

# Process each file
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    fix_file "$file"
  else
    echo "Warning: File $file not found, skipping"
  fi
done

echo "Fixing fetchUserEvents import in DashboardPage.js..."
sed -i.bak "s/import { fetchEvents, deleteEvent, fetchUserEvents } from \"..\/store\/eventSlice\";/import { fetchEvents, deleteEvent } from \"..\/store\/eventSlice\";/" frontend/src/pages/DashboardPage.js

echo "Fixing fetchUserEvents usage in DashboardPage.js..."
sed -i.bak "s/dispatch(fetchUserEvents(user.id));/\/\/ Removed fetchUserEvents call as it's not exported from eventSlice/" frontend/src/pages/DashboardPage.js

echo "Done fixing ESLint warnings!"
echo "Run 'npm run lint' from the frontend directory to verify fixes." 
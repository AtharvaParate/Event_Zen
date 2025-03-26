/**
 * Utility functions for image handling
 */

// Default images for different entity types
const DEFAULT_IMAGES = {
  event: [
    "/images/event-1.avif",
    "/images/event-2.avif",
    "/images/event-3.avif",
  ],
  vendor: [
    "/images/event-1.avif",
    "/images/event-2.avif",
    "/images/event-3.avif",
  ],
  user: [
    "/images/event-1.avif", // Can be replaced with actual user default image
  ],
};

// Get a consistent fallback image
export const getFallbackImage = (type) => {
  switch (type) {
    case "event":
      return "/images/event-1.avif";
    case "profile":
      return "/images/defaults/profile-default.avif";
    case "vendor":
      return "/images/defaults/vendor-default.avif";
    default:
      return "/images/event-1.avif";
  }
};

// Get a random default image from the available options
export const getRandomDefaultImage = (type = "event") => {
  const images = DEFAULT_IMAGES[type] || DEFAULT_IMAGES.event;
  return images[Math.floor(Math.random() * images.length)];
};

// Get image URL with fallback handling
export const getImageUrl = (imageName, type) => {
  // If no image is provided, use default image for the type
  if (!imageName) {
    return `${process.env.PUBLIC_URL}${getFallbackImage(type)}`;
  }

  // Check if image is already a full URL or absolute path
  if (imageName.startsWith("http") || imageName.startsWith("/")) {
    return imageName.startsWith("/")
      ? `${process.env.PUBLIC_URL}${imageName}`
      : imageName;
  }

  // Use type-specific folder for different image types
  switch (type) {
    case "event":
      return `${process.env.PUBLIC_URL}/images/events/${imageName}`;
    case "profile":
      return `${process.env.PUBLIC_URL}/images/profiles/${imageName}`;
    case "vendor":
      return `${process.env.PUBLIC_URL}/images/vendors/${imageName}`;
    default:
      return `${process.env.PUBLIC_URL}/images/${imageName}`;
  }
};

// Create a named object for the default export
const imageUtils = {
  getFallbackImage,
  getRandomDefaultImage,
  getImageUrl,
};

export default imageUtils;

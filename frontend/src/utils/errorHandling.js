/**
 * Utility functions for error handling, particularly for Material-UI issues
 */

/**
 * Applies patches to prevent common Material-UI errors in development mode
 * Particularly useful for getBoundingClientRect errors
 */
export const applyMaterialUIPatches = () => {
  // Only apply in development or when there's an explicit flag
  if (process.env.NODE_ENV === "development" || window.PATCH_MUI_ERRORS) {
    // Patch getBoundingClientRect
    patchGetBoundingClientRect();

    // Add error handler for transitions
    patchTransitionErrors();

    console.info("Material-UI patches applied");
  }
};

/**
 * Patches the getBoundingClientRect native method to return safe values
 * when elements don't exist in the DOM yet
 */
const patchGetBoundingClientRect = () => {
  const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;

  Element.prototype.getBoundingClientRect = function () {
    try {
      return originalGetBoundingClientRect.apply(this, arguments);
    } catch (e) {
      console.warn("getBoundingClientRect error patched:", e.message);
      // Return a default DOMRect-like object with required properties
      return {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      };
    }
  };

  // Store the original for cleanup
  window.__original_getBoundingClientRect = originalGetBoundingClientRect;
};

/**
 * Patches transition errors by overriding the requestAnimationFrame
 * to catch errors during animations
 */
const patchTransitionErrors = () => {
  const originalRAF = window.requestAnimationFrame;

  window.requestAnimationFrame = (callback) => {
    return originalRAF((timestamp) => {
      try {
        callback(timestamp);
      } catch (e) {
        console.warn("Animation frame error patched:", e.message);
      }
    });
  };

  // Store the original for cleanup
  window.__original_requestAnimationFrame = originalRAF;
};

/**
 * Removes applied patches (useful for test cleanup)
 */
export const removeMaterialUIPatches = () => {
  if (window.__original_getBoundingClientRect) {
    Element.prototype.getBoundingClientRect =
      window.__original_getBoundingClientRect;
    delete window.__original_getBoundingClientRect;
  }

  if (window.__original_requestAnimationFrame) {
    window.requestAnimationFrame = window.__original_requestAnimationFrame;
    delete window.__original_requestAnimationFrame;
  }

  console.info("Material-UI patches removed");
};

// Create a named variable for default export to fix ESLint warning
// eslint-disable-next-line import/no-anonymous-default-export
const errorHandlingExport = {
  applyMaterialUIPatches,
  removeMaterialUIPatches,
};

export default errorHandlingExport;

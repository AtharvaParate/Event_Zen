/**
 * Material-UI Transition Fixes
 *
 * This file contains fixes for common Material-UI issues, particularly related to
 * animations and transitions in development mode.
 */

/**
 * Applies a patch for the getBoundingClientRect() issue in Material-UI animations
 * This is especially important in React 18 with Strict Mode.
 */
export const applyMUITransitionFixes = () => {
  // Save original methods
  const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
  const originalRequestAnimationFrame = window.requestAnimationFrame;
  const originalGetComputedStyle = window.getComputedStyle;

  // ------ PATCH 1: getBoundingClientRect ------
  Element.prototype.getBoundingClientRect = function () {
    try {
      return originalGetBoundingClientRect.apply(this, arguments);
    } catch (e) {
      console.warn("getBoundingClientRect error patched", e);
      // Return a default object with required properties
      return {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      };
    }
  };

  // ------ PATCH 2: requestAnimationFrame ------
  window.requestAnimationFrame = function (callback) {
    return originalRequestAnimationFrame.call(window, (timestamp) => {
      try {
        callback(timestamp);
      } catch (e) {
        console.warn("Animation frame error patched", e);
      }
    });
  };

  // ------ PATCH 3: getComputedStyle ------
  window.getComputedStyle = function (element, pseudoElt) {
    try {
      return originalGetComputedStyle.call(window, element, pseudoElt);
    } catch (e) {
      console.warn("getComputedStyle error patched", e);
      // Return a minimal CSSStyleDeclaration-like object
      return {
        getPropertyValue: () => "",
        setProperty: () => {},
      };
    }
  };

  // ------ PATCH 4: Force disable transitions via CSS ------
  // Add a global style to disable all animations/transitions in development
  if (process.env.NODE_ENV === "development") {
    const style = document.createElement("style");
    style.id = "mui-transition-fix";
    style.innerHTML = `
      .MuiModal-root,
      .MuiPopover-root,
      .MuiPopper-root,
      .MuiDrawer-root,
      .MuiCollapse-root,
      .MuiAlert-root,
      .MuiSnackbar-root,
      .MuiFade-root,
      .MuiGrow-root,
      .MuiSlide-root,
      .MuiZoom-root {
        animation: none !important;
        transition: none !important;
        transform: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Return a cleanup function
  return () => {
    // Restore original methods when needed
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    window.requestAnimationFrame = originalRequestAnimationFrame;
    window.getComputedStyle = originalGetComputedStyle;

    // Remove the global style
    const style = document.getElementById("mui-transition-fix");
    if (style) {
      style.remove();
    }
  };
};

/**
 * CSS for disabling all animations and transitions
 * Useful for components that have animation issues
 */
export const disableTransitions = {
  animation: "none !important",
  transition: "none !important",
  transform: "none !important",
};

/**
 * MUI Menu component props to prevent animation issues
 */
export const safeMenuProps = {
  disablePortal: true,
  transitionDuration: 0,
  keepMounted: true,
  disableScrollLock: true,
  sx: disableTransitions,
  PaperProps: {
    sx: disableTransitions,
  },
};

/**
 * MUI Dialog component props to prevent animation issues
 */
export const safeDialogProps = {
  disablePortal: true,
  transitionDuration: 0,
  keepMounted: true,
  disableScrollLock: true,
  sx: disableTransitions,
  PaperProps: {
    sx: disableTransitions,
  },
};

/**
 * MUI Snackbar component props to prevent animation issues
 */
export const safeSnackbarProps = {
  disableWindowBlurListener: true,
  sx: disableTransitions,
  TransitionComponent: undefined, // Disable transition entirely
};

// Create a named variable for default export to fix ESLint warning
// eslint-disable-next-line import/no-anonymous-default-export
const muiFixesExport = {
  applyMUITransitionFixes,
  disableTransitions,
  safeMenuProps,
  safeDialogProps,
  safeSnackbarProps,
};

export default muiFixesExport;

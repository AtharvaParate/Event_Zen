import React from "react";
import { Fade, Grow, Slide, Zoom } from "@mui/material";
import { disableTransitions } from "../../utils/muiFixes";

/**
 * SafeTransition is a component that wraps Material-UI transition components
 * to prevent the common getBoundingClientRect() error in development mode
 *
 * It provides a safe alternative to using MUI transition components directly
 */

// Disable all transitions in development to prevent errors
const DISABLE_ALL_TRANSITIONS = process.env.NODE_ENV === "development";

/**
 * A safe wrapper for MUI's Fade component
 */
export const SafeFade = ({ children, ...props }) => {
  if (DISABLE_ALL_TRANSITIONS) {
    return children;
  }
  return <Fade {...props}>{children}</Fade>;
};

/**
 * A safe wrapper for MUI's Grow component
 */
export const SafeGrow = ({ children, ...props }) => {
  if (DISABLE_ALL_TRANSITIONS) {
    return children;
  }
  return <Grow {...props}>{children}</Grow>;
};

/**
 * A safe wrapper for MUI's Slide component
 */
export const SafeSlide = ({ children, ...props }) => {
  if (DISABLE_ALL_TRANSITIONS) {
    return children;
  }
  return <Slide {...props}>{children}</Slide>;
};

/**
 * A safe wrapper for MUI's Zoom component
 */
export const SafeZoom = ({ children, ...props }) => {
  if (DISABLE_ALL_TRANSITIONS) {
    return children;
  }
  return <Zoom {...props}>{children}</Zoom>;
};

/**
 * A list of styles that can be applied to components to disable transitions
 */
export const safeStyles = {
  noTransition: disableTransitions,
  noAnimation: {
    ...disableTransitions,
    animationName: "none !important",
    animationDuration: "0s !important",
  },
  noTransform: {
    transform: "none !important",
  },
};

// Create a named variable for default export to fix ESLint warning
// eslint-disable-next-line import/no-anonymous-default-export
const safeTransitionExport = {
  SafeFade,
  SafeGrow,
  SafeSlide,
  SafeZoom,
  safeStyles,
};

export default safeTransitionExport;

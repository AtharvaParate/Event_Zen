import React from "react";
import { Box } from "@mui/material";

/**
 * PageContainer component with consistent spacing and width
 * This component ensures proper content layout regardless of sidebar presence
 */
const PageContainer = ({ children, ...props }) => {
  return (
    <Box
      sx={{
        width: "100%",
        boxSizing: "border-box",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3 },
        mx: "auto",
        maxWidth: "100%", // Take full width of parent
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        ...props.sx,
      }}
      {...props}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          mx: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default PageContainer;

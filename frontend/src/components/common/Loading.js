import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const Loading = ({ message = "Loading...", fullScreen = false }) => {
  const content = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
        height: fullScreen ? "100vh" : "100%",
        width: "100%",
      }}
    >
      <CircularProgress size={60} thickness={4} color="primary" />
      {message && (
        <Typography
          variant="h6"
          sx={{ mt: 2, color: "text.secondary", textAlign: "center" }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );

  return fullScreen ? (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: "background.paper",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      {content}
    </Box>
  ) : (
    content
  );
};

export default Loading;

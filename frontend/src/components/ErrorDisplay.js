import React from "react";
import { Paper, Typography, Button, Box } from "@mui/material";
import {
  Warning as WarningIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

/**
 * A reusable error display component with a retry button
 * @param {Object} props - Component properties
 * @param {string} props.message - Error message to display
 * @param {function} props.onRetry - Callback function for retry action
 * @param {boolean} props.fullPage - Whether to display as a full page or inline component
 */
const ErrorDisplay = ({ message, onRetry, fullPage = false }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        textAlign: "center",
        margin: fullPage ? "2rem auto" : "1rem 0",
        maxWidth: fullPage ? "600px" : "100%",
        backgroundColor: "rgba(253, 237, 237, 0.8)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <WarningIcon color="error" sx={{ fontSize: fullPage ? 60 : 40 }} />

        <Typography variant={fullPage ? "h5" : "h6"} color="error" gutterBottom>
          {message || "An error occurred"}
        </Typography>

        <Typography variant="body2" color="text.secondary" paragraph>
          This could be due to a server issue or a network problem. Please try
          again or contact support if the problem persists.
        </Typography>

        {onRetry && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={onRetry}
          >
            Try Again
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default ErrorDisplay;

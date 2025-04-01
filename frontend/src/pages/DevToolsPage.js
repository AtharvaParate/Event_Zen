import React from "react";
import { Container, Typography, Paper, Box, Divider } from "@mui/material";
import TestBackendUpdates from "../components/TestBackendUpdates";

/**
 * Developer tools page for testing and debugging the application
 */
const DevToolsPage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Developer Tools
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This page contains tools for testing and debugging the application. It
          should not be accessible in production.
        </Typography>
      </Paper>

      {/* API Testing Tool */}
      <TestBackendUpdates />

      {/* System Info */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          System Information
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box
          component="dl"
          sx={{
            display: "grid",
            gridTemplateColumns: "max-content 1fr",
            gap: "8px 16px",
          }}
        >
          <Box component="dt" sx={{ fontWeight: "bold" }}>
            API Config:
          </Box>
          <Box component="dd">
            <pre style={{ margin: 0, overflow: "auto" }}>
              {JSON.stringify(
                {
                  BUDGET_API_URL:
                    process.env.REACT_APP_BUDGET_API_URL ||
                    "http://localhost:8083/api",
                  EVENT_API_URL:
                    process.env.REACT_APP_EVENT_API_URL ||
                    "http://localhost:8081/api",
                  USE_MOCK_DATA: false,
                },
                null,
                2
              )}
            </pre>
          </Box>
          <Box component="dt" sx={{ fontWeight: "bold" }}>
            Node Environment:
          </Box>
          <Box component="dd">{process.env.NODE_ENV}</Box>
        </Box>
      </Paper>

      {/* Usage Instructions */}
      <Paper elevation={1} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          How to Test Backend Updates
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" component="ol" sx={{ pl: 2 }}>
          <li>
            Use the "Test Backend Updates" section to send API requests to the
            backend
          </li>
          <li>Select a predefined endpoint or enter a custom one</li>
          <li>Choose the appropriate HTTP method (GET, POST, PUT, DELETE)</li>
          <li>For POST/PUT requests, enter the request body in JSON format</li>
          <li>Click "Send Request" to execute the API call</li>
          <li>
            View the response data to verify that changes were applied correctly
          </li>
          <li>
            Compare with the actual UI by navigating to the appropriate page
          </li>
        </Typography>
      </Paper>
    </Container>
  );
};

export default DevToolsPage;

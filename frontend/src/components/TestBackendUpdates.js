import React, { useState } from "react";
import {
  Paper,
  Typography,
  Button,
  TextField,
  Box,
  Grid,
  Divider,
  CircularProgress,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Send as SendIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import axios from "axios";
import { API_CONFIG } from "../config/apiConfig";

/**
 * A component for testing backend API calls and verifying updates
 * This is a developer tool to be used during development/testing
 */
const TestBackendUpdates = () => {
  const [apiUrl, setApiUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [requestBody, setRequestBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  // Test endpoints with dropdown options
  const testEndpoints = [
    {
      label: "All Budgets",
      value: `${API_CONFIG.BUDGET_API_URL}/budgets`,
      method: "GET",
    },
    {
      label: "Budget by ID",
      value: `${API_CONFIG.BUDGET_API_URL}/budgets/1`,
      method: "GET",
    },
    {
      label: "Update Budget",
      value: `${API_CONFIG.BUDGET_API_URL}/budgets/1`,
      method: "PUT",
    },
    {
      label: "All Events",
      value: `${API_CONFIG.EVENT_API_URL}/events`,
      method: "GET",
    },
    {
      label: "Event by ID",
      value: `${API_CONFIG.EVENT_API_URL}/events/1`,
      method: "GET",
    },
  ];

  const handleEndpointSelect = (endpoint) => {
    setApiUrl(endpoint.value);
    setMethod(endpoint.method);
    if (endpoint.method === "PUT" && endpoint.value.includes("/budgets/")) {
      // Sample update body for budget
      setRequestBody(
        JSON.stringify(
          {
            name: "Updated Budget Name",
            totalBudget: 30000,
            notes: "Updated via test tool on " + new Date().toISOString(),
          },
          null,
          2
        )
      );
    } else {
      setRequestBody("");
    }
  };

  const handleApiCall = async () => {
    setLoading(true);
    setError(null);

    try {
      let response;
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      switch (method) {
        case "GET":
          response = await axios.get(apiUrl, config);
          break;
        case "POST":
          response = await axios.post(apiUrl, JSON.parse(requestBody), config);
          break;
        case "PUT":
          response = await axios.put(apiUrl, JSON.parse(requestBody), config);
          break;
        case "DELETE":
          response = await axios.delete(apiUrl, config);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      setResponse(response);
      console.log("Backend API Response:", response);
    } catch (err) {
      setError(err);
      console.error("Backend API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, my: 3 }}>
      <Typography variant="h5" gutterBottom>
        Test Backend Updates
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Use this tool to test API calls and verify that data is being updated in
        the backend.
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Quick Test Endpoints</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
            {testEndpoints.map((endpoint, index) => (
              <Button
                key={index}
                variant="outlined"
                size="small"
                onClick={() => handleEndpointSelect(endpoint)}
              >
                {endpoint.label}
              </Button>
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            label="API URL"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="Enter API URL (e.g., http://localhost:8083/api/budgets)"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            select
            label="Method"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            SelectProps={{
              native: true,
            }}
          >
            {["GET", "POST", "PUT", "DELETE"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </TextField>
        </Grid>

        {(method === "POST" || method === "PUT") && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Request Body (JSON)"
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              multiline
              rows={4}
              placeholder='{"key": "value"}'
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={handleApiCall}
            disabled={loading || !apiUrl}
            startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
          >
            {loading ? "Sending..." : "Send Request"}
          </Button>
        </Grid>
      </Grid>

      {error && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: "error.light",
            color: "error.contrastText",
            mb: 2,
          }}
        >
          <Typography variant="subtitle2">Error:</Typography>
          <Typography variant="body2">
            {error.message}
            {error.response && (
              <>
                <br />
                Status: {error.response.status} {error.response.statusText}
                <br />
                {JSON.stringify(error.response.data, null, 2)}
              </>
            )}
          </Typography>
        </Paper>
      )}

      {response && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              Response ({response.status} {response.statusText})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                p: 2,
                bgcolor: "background.default",
                borderRadius: 1,
                overflow: "auto",
                maxHeight: "300px",
              }}
            >
              <pre>{JSON.stringify(response.data, null, 2)}</pre>
            </Box>
          </AccordionDetails>
        </Accordion>
      )}
    </Paper>
  );
};

export default TestBackendUpdates;

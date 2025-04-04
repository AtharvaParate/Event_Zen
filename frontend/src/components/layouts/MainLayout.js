import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Box, CssBaseline, Snackbar } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import Alert from "../common/Alert";
import { clearAlert } from "../../store/uiSlice";
import { SafeSlide } from "../common/SafeTransition";

// Transition function for Snackbar to prevent scrollTop error
const SlideTransition = (props) => {
  return <SafeSlide {...props} direction="up" />;
};

// Fixed drawer width - must be consistent across all components
const drawerWidth = 240;

// eslint-disable-next-line no-unused-vars
const MainLayout = () => {
  const dispatch = useDispatch();
  const { alert, darkMode } = useSelector((state) => state.ui);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState(null);

  // Create theme when darkMode changes
  useEffect(() => {
    const newTheme = createTheme({
      palette: {
        mode: darkMode ? "dark" : "light",
        primary: {
          main: "#1976d2",
        },
        secondary: {
          main: "#f50057",
        },
        background: {
          default: darkMode ? "#121212" : "#f7f9fc",
          paper: darkMode ? "#1e1e1e" : "#ffffff",
        },
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              backgroundColor: darkMode ? "#121212" : "#f7f9fc",
              color: darkMode ? "#ffffff" : "#000000",
              transition: "background-color 0.2s ease",
              margin: 0,
              padding: 0,
              boxSizing: "border-box",
              overflowX: "hidden",
            },
          },
        },
        // Ensure buttons and other components respect the color mode
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: "none",
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              transition: "background-color 0.2s ease",
            },
          },
        },
      },
    });

    setTheme(newTheme);
  }, [darkMode]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") return;
    dispatch(clearAlert());
  };

  // If theme hasn't been created yet, return nothing or a loading indicator
  if (!theme) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", width: "100%" }}>
        <CssBaseline />
        <Header onDrawerToggle={handleDrawerToggle} />
        <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />

        {/* Main content area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` },
            ml: { xs: 0, md: `${drawerWidth}px` },
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            bgcolor: "background.default",
            color: "text.primary",
            overflow: "hidden",
            position: "relative",
            boxSizing: "border-box",
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              width: "100%",
              marginTop: "64px", // Height of AppBar
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
            }}
          >
            {alert && (
              <Snackbar
                open={Boolean(alert)}
                autoHideDuration={6000}
                TransitionComponent={SlideTransition}
                disableWindowBlurListener={true}
                onClose={handleCloseAlert}
              >
                <Alert
                  onClose={handleCloseAlert}
                  severity={alert.type}
                  sx={{ width: "100%" }}
                >
                  {alert.message}
                </Alert>
              </Snackbar>
            )}
            <Outlet />
          </Box>
          <Footer />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default MainLayout;

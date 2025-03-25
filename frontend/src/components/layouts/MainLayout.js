import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Box, CssBaseline, Container } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import Alert from "../common/Alert";
import { clearAlert } from "../../store/uiSlice";

const MainLayout = () => {
  const dispatch = useDispatch();
  const { alert, drawer, darkMode } = useSelector((state) => state.ui);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCloseAlert = () => {
    dispatch(clearAlert());
  };

  const theme = createTheme({
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
  });

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}
      >
        <CssBaseline />
        <Header onDrawerToggle={handleDrawerToggle} />
        <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />

        <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
          <Container maxWidth="lg">
            {alert && <Alert />}
            <Outlet />
          </Container>
        </Box>

        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default MainLayout;

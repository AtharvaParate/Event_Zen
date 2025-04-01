import React from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  Event as EventIcon,
  Store as StoreIcon,
  Dashboard as DashboardIcon,
  EventAvailable as CreateEventIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Login as LoginIcon,
  AppRegistration as RegisterIcon,
  AttachMoney as BudgetIcon,
} from "@mui/icons-material";

const drawerWidth = 240;

const Sidebar = ({ mobileOpen, onDrawerToggle }) => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const isSelected = (path) => location.pathname === path;

  const drawer = (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 2,
          ...theme.mixins.toolbar,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Menu
        </Typography>
        {isMobile && (
          <IconButton onClick={onDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            component={RouterLink}
            to="/"
            selected={isSelected("/")}
          >
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            component={RouterLink}
            to="/events"
            selected={isSelected("/events")}
          >
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            <ListItemText primary="Events" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            component={RouterLink}
            to="/vendors"
            selected={isSelected("/vendors")}
          >
            <ListItemIcon>
              <StoreIcon />
            </ListItemIcon>
            <ListItemText primary="Vendors" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        {isAuthenticated ? (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/dashboard"
                selected={isSelected("/dashboard")}
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/events/create"
                selected={isSelected("/events/create")}
              >
                <ListItemIcon>
                  <CreateEventIcon />
                </ListItemIcon>
                <ListItemText primary="Create Event" />
              </ListItemButton>
            </ListItem>
            {user?.role === "ADMIN" && (
              <ListItem disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to="/admin/users"
                  selected={isSelected("/admin/users")}
                >
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Manage Users" />
                </ListItemButton>
              </ListItem>
            )}
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/profile"
                selected={isSelected("/profile")}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/attendees"
                selected={isSelected("/attendees")}
              >
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Attendees" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/registrations"
                selected={isSelected("/registrations")}
              >
                <ListItemIcon>
                  <EventIcon />
                </ListItemIcon>
                <ListItemText primary="Registrations" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/budgets"
                selected={isSelected("/budgets")}
              >
                <ListItemIcon>
                  <BudgetIcon />
                </ListItemIcon>
                <ListItemText primary="Budget Management" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/login"
                selected={isSelected("/login")}
              >
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/register"
                selected={isSelected("/register")}
              >
                <ListItemIcon>
                  <RegisterIcon />
                </ListItemIcon>
                <ListItemText primary="Register" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { md: drawerWidth },
        flexShrink: { md: 0 },
        position: { md: "fixed" },
        zIndex: { md: theme.zIndex.appBar - 1 },
        height: "100%",
      }}
    >
      {/* Mobile drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              zIndex: theme.zIndex.appBar - 1,
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            height: "100vh",
            position: "fixed",
            borderRight: `1px solid ${theme.palette.divider}`,
            zIndex: theme.zIndex.appBar - 1,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;

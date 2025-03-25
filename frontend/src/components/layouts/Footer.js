import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Container, Grid, Typography, Link, Divider } from "@mui/material";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        bgcolor: "background.paper",
        borderTop: 1,
        borderColor: "divider",
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography
              variant="h6"
              color="text.primary"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              EventZen
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Managing events made simple. Create, organize, and discover events
              with ease.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Link
              component={RouterLink}
              to="/"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              Home
            </Link>
            <Link
              component={RouterLink}
              to="/events"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              Events
            </Link>
            <Link
              component={RouterLink}
              to="/vendors"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              Vendors
            </Link>
            <Link
              component={RouterLink}
              to="/dashboard"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              Dashboard
            </Link>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Support
            </Typography>
            <Link
              component={RouterLink}
              to="/faq"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              FAQ
            </Link>
            <Link
              component={RouterLink}
              to="/contact"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              Contact Us
            </Link>
            <Link
              component={RouterLink}
              to="/privacy"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              Privacy Policy
            </Link>
            <Link
              component={RouterLink}
              to="/terms"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              Terms of Service
            </Link>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} EventZen. All rights reserved.
          </Typography>
          <Box>
            <Link
              href="https://twitter.com"
              color="text.secondary"
              sx={{ mx: 1 }}
            >
              Twitter
            </Link>
            <Link
              href="https://facebook.com"
              color="text.secondary"
              sx={{ mx: 1 }}
            >
              Facebook
            </Link>
            <Link
              href="https://instagram.com"
              color="text.secondary"
              sx={{ mx: 1 }}
            >
              Instagram
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

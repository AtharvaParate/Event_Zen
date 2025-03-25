import React from "react";
import { Box, Typography, Button, Breadcrumbs, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  action,
  actionText,
  actionIcon,
  actionLink,
  onActionClick,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      {breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 2 }}
        >
          <Link component={RouterLink} to="/" color="inherit" underline="hover">
            Home
          </Link>
          {breadcrumbs.map((breadcrumb, index) => (
            <React.Fragment key={index}>
              {index === breadcrumbs.length - 1 ? (
                <Typography color="text.primary">{breadcrumb.label}</Typography>
              ) : (
                <Link
                  component={RouterLink}
                  to={breadcrumb.link}
                  color="inherit"
                  underline="hover"
                >
                  {breadcrumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </Breadcrumbs>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="subtitle1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>

        {(actionText || action) &&
          (actionLink ? (
            <Button
              component={RouterLink}
              to={actionLink}
              variant="contained"
              color="primary"
              startIcon={actionIcon}
            >
              {actionText}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              startIcon={actionIcon}
              onClick={onActionClick}
            >
              {actionText}
            </Button>
          ))}
      </Box>
    </Box>
  );
};

export default PageHeader;

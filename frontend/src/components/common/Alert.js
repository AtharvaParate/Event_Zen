import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Snackbar, Alert as MuiAlert, Slide } from "@mui/material";
import { clearAlert } from "../../store/uiSlice";

// Custom transition to avoid the scrollTop error
const SlideTransition = (props) => {
  return <Slide {...props} direction="up" />;
};

const AlertComponent = (props) => {
  const dispatch = useDispatch();
  const { alert } = useSelector((state) => state.ui);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    if (props.onClose) {
      props.onClose(event, reason);
    } else {
      dispatch(clearAlert());
    }
  };

  // If used as a wrapper component, render children with props
  if (props.children) {
    return (
      <MuiAlert elevation={6} variant="filled" {...props} onClose={handleClose}>
        {props.children}
      </MuiAlert>
    );
  }

  // Otherwise, it's used as a standalone component
  if (!alert) return null;

  return (
    <Snackbar
      open={Boolean(alert)}
      autoHideDuration={6000}
      onClose={handleClose}
      disableWindowBlurListener={true}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        onClose={handleClose}
        severity={alert?.type || "info"}
      >
        {alert?.message}
      </MuiAlert>
    </Snackbar>
  );
};

export default AlertComponent;

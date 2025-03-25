import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Snackbar, Alert as MuiAlert } from "@mui/material";
import { clearAlert } from "../../store/uiSlice";

const AlertComponent = () => {
  const dispatch = useDispatch();
  const { alert } = useSelector((state) => state.ui);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(clearAlert());
  };

  if (!alert) return null;

  return (
    <Snackbar
      open={Boolean(alert)}
      autoHideDuration={6000}
      onClose={handleClose}
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

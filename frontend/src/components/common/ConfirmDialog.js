import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";

/**
 * A reusable confirmation dialog component
 *
 * @param {Object} props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {function} props.onConfirm - Function to call when user confirms the action
 * @param {function} props.onCancel - Function to call when user cancels the action
 * @param {string} props.title - The dialog title
 * @param {string|React.ReactNode} props.content - The dialog content (can be a string or a React node)
 * @param {string} props.confirmText - Text for the confirm button
 * @param {string} props.cancelText - Text for the cancel button
 * @param {string} props.confirmColor - Color for the confirm button (from MUI palette)
 * @param {boolean} props.isLoading - Whether a loading indicator should be displayed
 * @returns {React.ReactElement}
 */
const ConfirmDialog = ({
  open,
  onConfirm,
  onCancel,
  title = "Confirm",
  content = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "error",
  isLoading = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={!isLoading ? onCancel : undefined}
      aria-labelledby="confirm-dialog-title"
    >
      <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
      <DialogContent>
        {typeof content === "string" ? (
          <DialogContentText>{content}</DialogContentText>
        ) : (
          content
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={isLoading} color="inherit">
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          color={confirmColor}
          variant="contained"
          autoFocus
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isLoading ? "Processing..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  confirmColor: PropTypes.string,
  isLoading: PropTypes.bool,
};

export default ConfirmDialog;

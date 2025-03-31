import React from "react";
import { Alert, Snackbar, SnackbarProps } from "@mui/material";

interface Props extends SnackbarProps {
  severity: "error" | "success" | "info";
  onHandleClose: () => void;
}

export const ToastMessage = ({
  open,
  severity,
  onHandleClose,
  message,
  autoHideDuration = 3000,
}: Props) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onHandleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      data-testid="toast"
    >
      <Alert
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
        onClose={onHandleClose}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

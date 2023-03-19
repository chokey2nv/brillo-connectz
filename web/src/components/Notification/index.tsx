import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { Snackbar, Alert } from "@mui/material";
import { closeNotice, selectNotice } from "redux/notice.core";
import { useAppDispatch } from "redux/hook";

export function Notification() {
  const { open, message, type, onClose } = useSelector(selectNotice);
  const dispatch = useAppDispatch();
  const close = useCallback(() => {
    onClose?.();
    dispatch(closeNotice());
  }, [!!onClose]);
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={close}
      anchorOrigin={{
        horizontal: "right",
        vertical: "bottom",
      }}
    >
      <Alert severity={type} sx={{ width: "100%" }} onClose={close}>
        {message}
      </Alert>
    </Snackbar>
  );
}

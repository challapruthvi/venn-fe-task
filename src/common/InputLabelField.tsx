import React from "react";
import { Box, TextField, Typography } from "@mui/material";
import styled from "styled-components";
import { useField } from "formik";

const StyledTextField = styled(TextField)({
  width: "100%",
  "& .MuiInputBase-root": {
    borderRadius: "10px",
  },
  "& .MuiFormHelperText-root": {
    position: "relative",
    bottom: "0",
    whiteSpace: "normal",
    marginTop: "4px",
    lineHeight: "1.2",
    fontSize: "0.75rem",
  },
});

type FieldNames =
  | "firstName"
  | "lastName"
  | "phoneNumber"
  | "corporationNumber";

interface Props {
  label: string;
  name: FieldNames;
  // placeholder: string --> We can potentially add this but leaving it out since design doesn't have it
}

export const InputLabelField = ({ label, name }: Props) => {
  const [fieldProps, meta] = useField(name);

  return (
    <Box width="100%">
      <Typography
        sx={{ marginBottom: "4px", fontSize: "0.75rem", fontWeight: 400 }}
      >
        {label}
      </Typography>
      <StyledTextField
        variant="outlined"
        name={name}
        value={fieldProps.value}
        onChange={fieldProps.onChange}
        onBlur={fieldProps.onBlur}
        error={meta.touched && Boolean(meta.error)}
        helperText={meta.touched && meta.error}
        fullWidth
        sx={{ marginBottom: "12px" }}
      />
    </Box>
  );
};

import React from "react";
import {
  Button,
  Box,
  Typography,
  styled,
  Grid,
  CircularProgress,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Formik, Form } from "formik";
import { useOnboardingForm, useValidationSchema } from "./hooks";
import { ToastMessage } from "./common/ToastMessage";
import { InputLabelField } from "./common/InputLabelField";

const FormContainer = styled(Box)({
  width: "400px",
  margin: "0 auto",
  padding: "2rem",
  boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
  borderRadius: "8px",
  border: "0.5px solid rgba(0,0,0,0.1)",
  backgroundColor: "white",
});

const FormTitle = styled(Typography)({
  textAlign: "center",
  fontSize: "1.5rem",
  fontWeight: 400,
  marginBottom: "2rem",
});

const NameFieldsContainer = styled(Box)({
  display: "flex",
  gap: "16px",
});

const SubmitButton = styled(Button)({
  marginTop: "1.5rem",
  padding: "0.75rem 2rem",
  width: "100%",
  backgroundColor: "black",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#333",
  },
  "&:disabled": {
    backgroundColor: "#ccc",
  },
});

export const App = () => {
  const validationSchema = useValidationSchema();
  const {
    submitForm,
    isSubmitting,
    submitError,
    setSubmitError,
    submitSuccess,
    setSubmitSuccess,
  } = useOnboardingForm();

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "100vh", backgroundColor: "rgba(0,0,0,0.1)" }}
    >
      <FormContainer>
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            phoneNumber: "",
            corporationNumber: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            const success = await submitForm(values);
            if (success) {
              resetForm();
            }
          }}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <FormTitle variant="h1">Onboarding Form</FormTitle>
              <NameFieldsContainer>
                <InputLabelField label="First Name" name="firstName" />
                <InputLabelField label="Last Name" name="lastName" />
              </NameFieldsContainer>
              <InputLabelField label="Phone Number" name="phoneNumber" />
              <InputLabelField
                label="Corporation Number"
                name="corporationNumber"
              />
              <SubmitButton
                variant="contained"
                type="submit"
                endIcon={
                  isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <ArrowForwardIcon />
                  )
                }
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </SubmitButton>
            </Form>
          )}
        </Formik>
        <ToastMessage
          open={Boolean(submitError)}
          severity="error"
          message={submitError}
          onHandleClose={() => setSubmitError(null)}
        />
        <ToastMessage
          open={submitSuccess}
          severity="success"
          message={`Form submitted successfully`}
          onHandleClose={() => setSubmitSuccess(false)}
        />
      </FormContainer>
    </Grid>
  );
};

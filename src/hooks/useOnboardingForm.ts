import { useState } from "react";

interface FormValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  corporationNumber: string;
}

interface ApiError {
  message: string;
}

export const useOnboardingForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const submitForm = async (values: FormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Transform values to match API expected format
      const payload = {
        firstName: values.firstName?.trim(),
        lastName: values.lastName?.trim(),
        corporationNumber: values.corporationNumber,
        phone: values.phoneNumber,
      };

      const response = await fetch(
        "https://fe-hometask-api.qa.vault.tryvault.com/profile-details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || "Submission failed");
      }

      setSubmitSuccess(true);
      return true;
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Submission failed"
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitForm,
    isSubmitting,
    submitError,
    setSubmitError,
    submitSuccess,
    setSubmitSuccess,
  };
};

import { useState } from "react";

const CORPORATION_VALIDATION_URL =
  "https://fe-hometask-api.qa.vault.tryvault.com/corporation-number";

export const useCorporationNumberValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateCorporationNumber = async (
    number: string
  ): Promise<boolean> => {
    if (number.length !== 9) return false;

    setIsValidating(true);
    setValidationError(null);

    try {
      const response = await fetch(`${CORPORATION_VALIDATION_URL}/${number}`);

      if (!response.ok) {
        throw new Error("Failed to validate corporation number");
      }

      const data = await response.json();
      return data.valid || false;
    } catch (error) {
      setValidationError(
        error instanceof Error ? error.message : "Validation failed"
      );
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  return {
    validateCorporationNumber,
    isValidating,
    validationError,
  };
};

import * as Yup from "yup";
import { useCorporationNumberValidation } from ".";

let lastTestedCorporationValue = "";
let lastValidationResult = false;

export const useValidationSchema = () => {
  const { validateCorporationNumber } = useCorporationNumberValidation();

  return Yup.object({
    firstName: Yup.string()
      .transform((value) => value?.trim()) // Trim whitespace before validation
      .required("First name is required")
      .max(50, "First name must be 50 characters or less")
      .test(
        "no-whitespace",
        "First name cannot be just whitespace",
        (value) => !!value && value.trim().length > 0
      ),
    lastName: Yup.string()
      .transform((value) => value?.trim()) // Trim whitespace before validation
      .required("Last name is required")
      .max(50, "Last name must be 50 characters or less")
      .test(
        "no-whitespace",
        "Last name cannot be just whitespace",
        (value) => !!value && value.trim().length > 0
      ),
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .matches(
        /^\+1\d{10}$/,
        "Must be a valid Canadian phone number starting with +1 followed by 10 digits"
      ),
    corporationNumber: Yup.string()
      .required("Corporation number is required")
      .length(9, "Corporation number must be exactly 9 digits")
      .matches(/^\d+$/, "Corporation number must contain only digits")
      .test(
        "is-valid-corporation-number",
        "Invalid corporation number",
        function (value) {
          // Skip async validation if the same value was tested before
          if (value === lastTestedCorporationValue) {
            return lastValidationResult;
          }

          // Only proceed with async validation if basic validations pass
          if (value && value.length === 9 && /^\d+$/.test(value)) {
            return validateCorporationNumber(value)
              .then((isValid) => {
                lastTestedCorporationValue = value;
                lastValidationResult = isValid;
                return isValid;
              })
              .catch(() => {
                lastTestedCorporationValue = value;
                lastValidationResult = false;
                return false;
              });
          }
          return true; // Skip async validation if basic checks fail
        }
      ),
  });
};

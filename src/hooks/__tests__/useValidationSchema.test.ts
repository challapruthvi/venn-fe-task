import * as Yup from "yup";
import { useValidationSchema } from "../useValidationSchema";

const mockValidateFn = jest.fn();
// Mock the useCorporationNumberValidation hook
jest.mock("../useCorporationNumberValidation", () => ({
  useCorporationNumberValidation: () => ({
    validateCorporationNumber: mockValidateFn,
  }),
}));

describe("useValidationSchema", () => {
  let validationSchema: Yup.ObjectSchema;

  beforeAll(() => {
    // Get the validation schema once before all tests
    validationSchema = useValidationSchema();
  });

  describe("firstName validation", () => {
    it("should reject empty first name", async () => {
      await expect(
        validationSchema.validateAt("firstName", { firstName: "" })
      ).rejects.toThrow("First name is required");
    });

    it("should reject whitespace-only first name", async () => {
      await expect(
        validationSchema.validateAt("firstName", { firstName: "   " })
      ).rejects.toThrow("First name is required");
    });

    it("should trim whitespace from first name", async () => {
      await expect(
        validationSchema.validateAt("firstName", { firstName: "  John  " })
      ).resolves.toBe("John");
    });

    it("should reject first names longer than 50 chars", async () => {
      const longName = "a".repeat(51);
      await expect(
        validationSchema.validateAt("firstName", { firstName: longName })
      ).rejects.toThrow("First name must be 50 characters or less");
    });

    it("should accept valid first name", async () => {
      await expect(
        validationSchema.validateAt("firstName", { firstName: "John" })
      ).resolves.toBe("John");
    });
  });

  describe("lastName validation", () => {
    it("should reject empty last name", async () => {
      await expect(
        validationSchema.validateAt("lastName", { lastName: "" })
      ).rejects.toThrow("Last name is required");
    });

    it("should reject whitespace-only last name", async () => {
      await expect(
        validationSchema.validateAt("lastName", { lastName: "   " })
      ).rejects.toThrow("Last name is required");
    });

    it("should trim whitespace from last name", async () => {
      await expect(
        validationSchema.validateAt("lastName", { lastName: "  Doe  " })
      ).resolves.toBe("Doe");
    });

    it("should reject last names longer than 50 chars", async () => {
      const longName = "a".repeat(51);
      await expect(
        validationSchema.validateAt("lastName", { lastName: longName })
      ).rejects.toThrow("Last name must be 50 characters or less");
    });

    it("should accept valid last name", async () => {
      await expect(
        validationSchema.validateAt("lastName", { lastName: "Doe" })
      ).resolves.toBe("Doe");
    });
  });

  describe("phoneNumber validation", () => {
    it("should reject empty phone number", async () => {
      await expect(
        validationSchema.validateAt("phoneNumber", { phoneNumber: "" })
      ).rejects.toThrow("Phone number is required");
    });

    it("should reject invalid phone number formats", async () => {
      const invalidNumbers = [
        "1234567890", // missing +1
        "+1234567890", // wrong country code
        "+1abcdefghij", // contains letters
        "+1 123 456 7890", // contains spaces
        "+1123456789", // too short
        "+112345678901", // too long
      ];

      for (const number of invalidNumbers) {
        await expect(
          validationSchema.validateAt("phoneNumber", { phoneNumber: number })
        ).rejects.toThrow(
          "Must be a valid Canadian phone number starting with +1 followed by 10 digits"
        );
      }
    });

    it("should accept valid Canadian phone number", async () => {
      await expect(
        validationSchema.validateAt("phoneNumber", {
          phoneNumber: "+14165551234",
        })
      ).resolves.toBe("+14165551234");
    });
  });

  describe("corporationNumber validation", () => {
    it("should reject empty corporation number", async () => {
      await expect(
        validationSchema.validateAt("corporationNumber", {
          corporationNumber: "",
        })
      ).rejects.toThrow("Corporation number is required");
    });

    it("should reject non-numeric corporation numbers", async () => {
      await expect(
        validationSchema.validateAt("corporationNumber", {
          corporationNumber: "123abc789",
        })
      ).rejects.toThrow("Corporation number must contain only digits");
    });

    it("should reject corporation numbers not exactly 9 digits", async () => {
      const invalidLengths = ["12345678", "1234567890"];
      for (const number of invalidLengths) {
        await expect(
          validationSchema.validateAt("corporationNumber", {
            corporationNumber: number,
          })
        ).rejects.toThrow("Corporation number must be exactly 9 digits");
      }
    });

    it("should validate corporation number via API when length is 9", async () => {
      // Test with valid corporation number
      (mockValidateFn as jest.Mock).mockResolvedValueOnce(true);
      await expect(
        validationSchema.validateAt("corporationNumber", {
          corporationNumber: "123456789",
        })
      ).resolves.toBe("123456789");
      expect(mockValidateFn).toHaveBeenCalledWith("123456789");

      // Test with invalid corporation number
      mockValidateFn.mockResolvedValueOnce(false);
      await expect(
        validationSchema.validateAt("corporationNumber", {
          corporationNumber: "987654321",
        })
      ).rejects.toThrow("Invalid corporation number");
    });
  });

  describe("full schema validation", () => {
    it("should validate complete form data", async () => {
      (mockValidateFn as jest.Mock).mockResolvedValueOnce(true);

      const validData = {
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "+14165551234",
        corporationNumber: "123456789",
      };

      await expect(validationSchema.validate(validData)).resolves.toEqual(
        validData
      );
    });

    it("should reject invalid complete form data", async () => {
      const invalidData = {
        firstName: "   ", // whitespace only
        lastName: "", // empty
        phoneNumber: "1234567890", // invalid format
        corporationNumber: "abc", // invalid format
      };

      await expect(validationSchema.validate(invalidData)).rejects.toThrow();
    });
  });
});

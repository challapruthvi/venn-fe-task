import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { App } from "../App";
import * as hooks from "../hooks";

// Mock the hooks
jest.mock("../hooks", () => ({
  useValidationSchema: jest.fn(),
  useOnboardingForm: jest.fn(),
}));

// Mock child components
jest.mock("../common/ToastMessage", () => ({
  ToastMessage: ({ open, message }: { open: boolean; message: string }) =>
    open ? <div data-testid="toast">{message}</div> : null,
}));

jest.mock("../common/InputLabelField", () => ({
  InputLabelField: ({ label, name }: { label: string; name: string }) => (
    <div>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} data-testid={name} />
    </div>
  ),
}));

describe("Renders App", () => {
  const mockSubmitForm = jest.fn();
  const mockSetSubmitError = jest.fn();
  const mockSetSubmitSuccess = jest.fn();

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup mock implementations
    (hooks.useValidationSchema as jest.Mock).mockReturnValue({
      validate: jest.fn().mockResolvedValue(true),
    });

    (hooks.useOnboardingForm as jest.Mock).mockReturnValue({
      submitForm: mockSubmitForm,
      isSubmitting: false,
      submitError: null,
      setSubmitError: mockSetSubmitError,
      submitSuccess: false,
      setSubmitSuccess: mockSetSubmitSuccess,
    });
  });

  it("With initial empty fields and title", () => {
    const result = render(<App />);
    expect(result.getByText("Onboarding Form")).toBeInTheDocument();
    expect(result.getByLabelText("First Name")).toBeInTheDocument();
    expect(result.getByText("Last Name")).toBeInTheDocument();
    expect(result.getByText("Phone Number")).toBeInTheDocument();
    expect(result.getByText("Corporation Number")).toBeInTheDocument();
    expect(result.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("submits the form with valid data and displays success toast", async () => {
    (hooks.useOnboardingForm as jest.Mock).mockReturnValue({
      submitForm: mockSubmitForm.mockResolvedValue(true),
      isSubmitting: false,
      submitError: null,
      setSubmitError: mockSetSubmitError,
      submitSuccess: true,
      setSubmitSuccess: mockSetSubmitSuccess,
    });

    const result = render(<App />);

    // Fill out the form
    fireEvent.change(result.getByTestId("firstName"), {
      target: { value: "John" },
    });
    fireEvent.change(result.getByTestId("lastName"), {
      target: { value: "Doe" },
    });
    fireEvent.change(result.getByTestId("phoneNumber"), {
      target: { value: "+14165551234" },
    });
    fireEvent.change(result.getByTestId("corporationNumber"), {
      target: { value: "123456789" },
    });

    // Submit the form
    fireEvent.click(result.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(mockSubmitForm).toHaveBeenCalled();
      expect(result.getByTestId("toast")).toHaveTextContent(
        "Form submitted successfully"
      );
    });
  });

  it("submits the form with invalid data and displays error toast", async () => {
    mockSubmitForm.mockResolvedValue(false);
    (hooks.useOnboardingForm as jest.Mock).mockReturnValue({
      submitForm: mockSubmitForm.mockResolvedValue(false),
      isSubmitting: false,
      submitError: "Error submitting form",
      setSubmitError: mockSetSubmitError,
      submitSuccess: false,
      setSubmitSuccess: mockSetSubmitSuccess,
    });

    const result = render(<App />);

    // Fill out the form
    fireEvent.change(result.getByTestId("firstName"), {
      target: { value: "John" },
    });
    fireEvent.change(result.getByTestId("lastName"), {
      target: { value: "Doe" },
    });
    fireEvent.change(result.getByTestId("phoneNumber"), {
      target: { value: "+14165551234" },
    });
    fireEvent.change(result.getByTestId("corporationNumber"), {
      target: { value: "123456789" },
    });

    // Submit the form
    fireEvent.click(result.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(mockSubmitForm).toHaveBeenCalled();
      expect(result.getByTestId("toast")).toHaveTextContent(
        "Error submitting form"
      );
    });
  });

  it("disables the submit button when submitting", () => {
    (hooks.useOnboardingForm as jest.Mock).mockReturnValue({
      submitForm: mockSubmitForm,
      isSubmitting: true,
      submitError: null,
      setSubmitError: mockSetSubmitError,
      submitSuccess: false,
      setSubmitSuccess: mockSetSubmitSuccess,
    });

    const result = render(<App />);

    expect(
      result.getByRole("button", { name: "Submitting..." })
    ).toBeDisabled();
  });
});

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { InputLabelField } from "../InputLabelField";
import { Formik, Form, useField } from "formik";

jest.mock("formik", () => ({
  ...jest.requireActual("formik"),
  useField: jest.fn(),
}));

describe("InputLabelField Component", () => {
  const mockField = {
    value: "",
    onChange: jest.fn(),
    onBlur: jest.fn(),
    name: "testField",
  };

  const mockMeta = {
    touched: false,
    error: "",
  };

  beforeEach(() => {
    (useField as jest.Mock).mockReturnValue([mockField, mockMeta]);
    jest.clearAllMocks();
  });

  it("renders correctly with label", () => {
    render(
      <Formik initialValues={{ firstName: "" }} onSubmit={jest.fn()}>
        <Form>
          <InputLabelField label="Test Label" name="firstName" />
        </Form>
      </Formik>
    );

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("displays error message when field is touched and has error", () => {
    (useField as jest.Mock).mockReturnValue([
      mockField,
      { ...mockMeta, touched: true, error: "Test error message" },
    ]);

    render(
      <Formik initialValues={{ firstName: "" }} onSubmit={jest.fn()}>
        <Form>
          <InputLabelField label="Test Label" name="firstName" />
        </Form>
      </Formik>
    );

    expect(screen.getByText("Test error message")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("does not display error message when field is untouched", () => {
    (useField as jest.Mock).mockReturnValue([
      mockField,
      { ...mockMeta, touched: false, error: "Test error message" },
    ]);

    render(
      <Formik initialValues={{ firstName: "" }} onSubmit={jest.fn()}>
        <Form>
          <InputLabelField label="Test Label" name="firstName" />
        </Form>
      </Formik>
    );

    expect(screen.queryByText("Test error message")).not.toBeInTheDocument();
  });

  it("calls Formik handlers on change and blur", () => {
    render(
      <Formik initialValues={{ firstName: "" }} onSubmit={jest.fn()}>
        <Form>
          <InputLabelField label="Test Label" name="firstName" />
        </Form>
      </Formik>
    );

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "new value" } });
    fireEvent.blur(input);

    expect(mockField.onChange).toHaveBeenCalled();
    expect(mockField.onBlur).toHaveBeenCalled();
  });

  it("passes the correct value to TextField", () => {
    (useField as jest.Mock).mockReturnValue([
      { ...mockField, value: "test value" },
      mockMeta,
    ]);

    render(
      <Formik initialValues={{ firstName: "" }} onSubmit={jest.fn()}>
        <Form>
          <InputLabelField label="Test Label" name="firstName" />
        </Form>
      </Formik>
    );

    expect(screen.getByRole("textbox")).toHaveValue("test value");
  });

  it("applies correct styling", () => {
    render(
      <Formik initialValues={{ firstName: "" }} onSubmit={jest.fn()}>
        <Form>
          <InputLabelField label="Test Label" name="firstName" />
        </Form>
      </Formik>
    );

    const label = screen.getByText("Test Label");
    expect(label).toHaveStyle("font-size: 0.75rem");
    expect(label).toHaveStyle("font-weight: 400");
    expect(label).toHaveStyle("margin-bottom: 4px");
  });
});

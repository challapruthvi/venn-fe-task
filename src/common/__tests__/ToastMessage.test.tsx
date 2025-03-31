import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ToastMessage } from "../ToastMessage";

describe("ToastMessage Component", () => {
  const mockHandleClose = jest.fn();
  const defaultProps = {
    open: true,
    severity: "success" as const,
    message: "Test message",
    onHandleClose: mockHandleClose,
    autoHideDuration: 3000,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly when open", () => {
    render(<ToastMessage {...defaultProps} />);

    const toast = screen.getByTestId("toast");
    const alert = screen.getByRole("alert");

    expect(toast).toBeInTheDocument();
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent("Test message");
    expect(alert).toHaveClass("MuiAlert-filledSuccess");
  });

  it("does not render when closed", () => {
    render(<ToastMessage {...defaultProps} open={false} />);

    expect(screen.queryByTestId("toast")).not.toBeInTheDocument();
  });

  it("displays error variant correctly", () => {
    render(<ToastMessage {...defaultProps} severity="error" />);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("MuiAlert-filledError");
  });

  it("displays info variant correctly", () => {
    render(<ToastMessage {...defaultProps} severity="info" />);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("MuiAlert-filledInfo");
  });

  it("calls onHandleClose when clicking the close button", () => {
    render(<ToastMessage {...defaultProps} />);

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onHandleClose when autoHideDuration completes", () => {
    jest.useFakeTimers();
    render(<ToastMessage {...defaultProps} />);

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(mockHandleClose).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it("uses custom autoHideDuration when provided", () => {
    jest.useFakeTimers();
    render(<ToastMessage {...defaultProps} autoHideDuration={5000} />);

    // Shouldn't have been called yet at 3000ms
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(mockHandleClose).not.toHaveBeenCalled();

    // Should be called at 5000ms
    jest.advanceTimersByTime(2000);
    expect(mockHandleClose).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it("matches snapshot when open", () => {
    const { asFragment } = render(<ToastMessage {...defaultProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot when closed", () => {
    const { asFragment } = render(
      <ToastMessage {...defaultProps} open={false} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

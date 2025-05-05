import { render, screen, fireEvent } from "@testing-library/react";
import { ConfirmationModal } from "../ConfirmationModal";

describe("ConfirmationModal", () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();
  const testMessage = "Are you sure you want to delete this item?";

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onConfirm: mockOnConfirm,
    message: testMessage,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing when isOpen is false", () => {
    render(<ConfirmationModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText(testMessage)).not.toBeInTheDocument();
  });

  it("renders the modal when isOpen is true", () => {
    render(<ConfirmationModal {...defaultProps} />);
    expect(screen.getByText(testMessage)).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("calls onClose when Cancel button is clicked", () => {
    render(<ConfirmationModal {...defaultProps} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm when Delete button is clicked", () => {
    render(<ConfirmationModal {...defaultProps} />);
    fireEvent.click(screen.getByText("Delete"));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it("displays the correct message passed as prop", () => {
    const customMessage = "Custom test message";
    render(<ConfirmationModal {...defaultProps} message={customMessage} />);
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });
});

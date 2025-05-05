import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AddTaskButton } from "../AddTaskButton";

describe("AddTaskButton", () => {
  it("renders button with correct text", () => {
    const mockOnClick = jest.fn();
    render(<AddTaskButton onClick={mockOnClick} />);
  
    expect(screen.getByText(/add task/i)).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      "add new task",
    );
  });
  
  it("calls onClick handler when clicked", () => {
    const mockOnClick = jest.fn();
    render(<AddTaskButton onClick={mockOnClick} />);
  
    fireEvent.click(screen.getByRole("button"));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});

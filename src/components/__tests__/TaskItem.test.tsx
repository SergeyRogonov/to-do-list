import { render, screen, fireEvent, act } from "@testing-library/react";
import TaskItem, { TaskItemProps } from "../TaskItem";

describe("TaskItem Component", () => {
  const mockTask = {
    id: "1",
    taskTitle: "Test Task",
    taskNotes: "Test Notes",
    finished: false,
    createdAt: new Date(),
  };

  const mockProps: TaskItemProps = {
    task: mockTask,
    toggleTask: jest.fn(),
    editTask: jest.fn(),
    deleteTask: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders task title correctly", () => {
    render(<TaskItem {...mockProps} />);
    expect(screen.getByText("Test Notes")).toBeInTheDocument();
  });

  it("renders task notes correctly", () => {
    render(<TaskItem {...mockProps} />);
    expect(screen.getByText("Test Notes")).toBeInTheDocument();
  });

  it("calls toggleTask when checkbox is clicked", () => {
    render(<TaskItem {...mockProps} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(mockProps.toggleTask).toHaveBeenCalledWith("1");
  });

  it("calls editTask when edit button is clicked", () => {
    render(<TaskItem {...mockProps} />);
    fireEvent.click(screen.getByLabelText("edit task"));
    expect(mockProps.editTask).toHaveBeenCalledWith(mockTask);
  })

  it("toggles show more/less button for long notes", async () => {
    // Mock getComputedStyle to return specific line height
    window.getComputedStyle = jest.fn().mockImplementation(() => ({
      lineHeight: "20px"
    }));
    
    // Mock element scrollHeight to simulate content that exceeds two lines
    Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
      configurable: true,
      value: 100 // Greater than 2 lines (2 * 20px)
    });

    const longNotesTask = {
      ...mockTask,
      taskNotes: "A".repeat(200),
    };

    await act(async () => {
      render(<TaskItem {...mockProps} task={longNotesTask} />);
    });

    const showMoreButton = screen.getByText("Show more");
    expect(showMoreButton).toBeInTheDocument();

    fireEvent.click(showMoreButton);
    expect(screen.getByText("Show less")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Show less"));
    expect(screen.getByText("Show more")).toBeInTheDocument();
  });

  it("does not show more/less button for short notes", async () => {
    // Mock getComputedStyle to return specific line height
    window.getComputedStyle = jest.fn().mockImplementation(() => ({
      lineHeight: "20px"
    }));

    // Mock element scrollHeight to simulate content that doesn"t exceed two lines
    Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
      configurable: true,
      value: 30 // Less than 2 lines (2 * 20px)
    });

    const shortNotesTask = {
      ...mockTask,
      taskNotes: "Short note",
    };

    await act(async () => {
      render(<TaskItem {...mockProps} task={shortNotesTask} />);
    });

    expect(screen.queryByText("Show more")).not.toBeInTheDocument();
  });

  it("applies correct styles when task is finished", () => {
    const finishedTask = {
      ...mockTask,
      finished: true
    };
    render(<TaskItem {...mockProps} task={finishedTask} />);
    expect(screen.getByText("Test Task")).toHaveClass("text-gray-500", "line-through");
  });

  it("handles keyboard interaction for checkbox", () => {
    render(<TaskItem {...mockProps} />);
    const checkbox = screen.getByRole("checkbox");

    fireEvent.keyDown(checkbox, { key: "Enter" });
    expect(mockProps.toggleTask).toHaveBeenCalledWith("1");

    fireEvent.keyDown(checkbox, { key: " " });
    expect(mockProps.toggleTask).toHaveBeenCalledWith("1");
  });
});

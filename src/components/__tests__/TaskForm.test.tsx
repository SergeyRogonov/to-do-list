import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskForm from "../TaskForm";
import { useTaskManager } from "@/hooks/useTaskManager";

jest.mock("@/hooks/useTaskManager", () => ({
  useTaskManager: jest.fn(),
}));

jest.mock("uuid", () => ({
  v4: () => "test-uuid",
}));

describe("TaskForm", () => {
  const mockHandleFormClose = jest.fn();
  const mockOnTaskSubmit = jest.fn();
  const mockOnTaskDelete = jest.fn();
  const mockDeleteTask = jest.fn();

  beforeEach(() => {
    (useTaskManager as jest.Mock).mockReturnValue({
      deleteTask: mockDeleteTask,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    handleFormClose: mockHandleFormClose,
    onTaskSubmit: mockOnTaskSubmit,
    onTaskDelete: mockOnTaskDelete,
    initialTask: null,
    isEditing: false,
  };

  it("renders the form with empty fields in create mode", () => {
    render(<TaskForm {...defaultProps} />);

    expect(screen.getByLabelText("task title")).toBeInTheDocument();
    expect(screen.getByText("+ Add note")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("shows textarea when Add note button is clicked", () => {
    render(<TaskForm {...defaultProps} />);

    fireEvent.click(screen.getByText("+ Add note"));
    expect(screen.getByPlaceholderText("Some notes...")).toBeInTheDocument();
  });

  it("submits form with correct data", () => {
    render(<TaskForm {...defaultProps} />);

    const titleInput = screen.getByLabelText("task title");
    fireEvent.change(titleInput, { target: { value: "Test Task" } });

    fireEvent.click(screen.getByText("Save"));
    
    expect(mockOnTaskSubmit).toHaveBeenCalledWith({
      id: "test-uuid",
      taskTitle: "Test Task",
      taskNotes: "",
      finished: false,
    });
    expect(mockHandleFormClose).toHaveBeenCalled();
  });

  it("loads initial task data in edit mode", () => {
    const initialTask = {
      id: "123",
      taskTitle: "Existing Task",
      taskNotes: "Existing Notes",
      finished: false,
    };

    render(<TaskForm {...defaultProps} initialTask={initialTask} isEditing={true} />);

    expect(screen.getByDisplayValue("Existing Task")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Existing Notes")).toBeInTheDocument();
    expect(screen.getByText("Update")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("updates task correctly", () => {
    const initialTask = {
      id: "123",
      taskTitle: "Original Title",
      taskNotes: "Original Notes",
      finished: false,
    };
  
    render(<TaskForm {...defaultProps} initialTask={initialTask} isEditing={true} />);

    const titleInput = screen.getByDisplayValue("Original Title");
    fireEvent.change(titleInput, { target: { value: "Updated Title" } });

    fireEvent.click(screen.getByText("Update"));

    expect(mockOnTaskSubmit).toHaveBeenCalledWith({
      id: "123",
      taskTitle: "Updated Title",
      taskNotes: "Original Notes",
      finished: false,
    });
  });

  it("handles task deletion", () => {
    const initialTask = {
      id: "123",
      taskTitle: "Task to delete",
      taskNotes: "",
      finished: false,
    };

    render(<TaskForm {...defaultProps} initialTask={initialTask} isEditing={true} />);

    fireEvent.click(screen.getByText("Delete"));
    expect(screen.getByText("Are you sure you want to delete this task?")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Confirm delete task"));

    expect(mockDeleteTask).toHaveBeenCalledWith("123");
    expect(mockOnTaskDelete).toHaveBeenCalledWith("123");
    expect(mockHandleFormClose).toHaveBeenCalled();
  });

  it("sanitizes input before submission", () => {
    render(<TaskForm {...defaultProps} />);

    const titleInput = screen.getByLabelText("task title");
    fireEvent.change(titleInput, { target: { value: "<script>alert('xss')</script>Test Task" } });

    fireEvent.click(screen.getByText("Save"));

    expect(mockOnTaskSubmit).toHaveBeenCalledWith({
      id: "test-uuid",
      taskTitle: "Test Task",
      taskNotes: "",
      finished: false,
    });
  });

  it("closes form when cancel is clicked", () => {
    render(<TaskForm {...defaultProps} />);

    fireEvent.click(screen.getByText("Cancel"));
    expect(mockHandleFormClose).toHaveBeenCalled();
  });
});

import { render, screen } from "@testing-library/react";
import { TaskList } from "../TaskList";
import { Task } from "@/types/types";

describe("TaskList", () => {
  const mockTasks: Task[] = [
    { id: "1", taskTitle: "Task 1", taskNotes: "Task 1 note", finished: false},
    { id: "2", taskTitle: "Task 2", taskNotes: "Task 2 note", finished: true},
  ];

  const mockProps = {
    tasks: mockTasks,
    toggleTask: jest.fn(),
    editTask: jest.fn(),
    deleteTask: jest.fn(),
    updateTask: jest.fn(),
    reorderTasks: jest.fn(),
    taskToEdit: null,
    handleFormClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all tasks", () => {
    render(<TaskList {...mockProps} />);

    mockTasks.forEach(task => {
      expect(screen.getByText(task.taskTitle)).toBeInTheDocument();
    });
  });

  // Note: Drag and drop functionality should be tested manually
  // Manual test cases for drag and drop:
  // 1. Drag a task to a different position in the list
  // 2. Verify the visual feedback during dragging
  // 3. Test keyboard accessibility for drag and drop
});

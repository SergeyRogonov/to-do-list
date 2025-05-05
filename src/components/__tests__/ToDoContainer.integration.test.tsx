import { render, screen, fireEvent, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event"
import ToDoContainer  from "../ToDoContainer";

describe("ToDoContainer Integration Tests", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const addNewTask = async (title: string, notes: string = "") => {
    fireEvent.click(screen.getByLabelText(/add new task/i));
    fireEvent.click(screen.getByText(/\+ add note/i))

    const titleInput = screen.getByLabelText("task title");
    const notesInput = screen.getByLabelText("task notes");
    
    fireEvent.change(titleInput, { target: { value: title } });
    fireEvent.change(notesInput, { target: { value: notes } });
    
    const submitButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(submitButton);
  };

  it("should allow adding and displaying a new task", async () => {
    render(<ToDoContainer />);

    await addNewTask("New Test Task", "Test Notes");

    expect(screen.getByText("New Test Task")).toBeInTheDocument();
    expect(screen.getByText("Test Notes")).toBeInTheDocument();
  });

  it("should maintain task state after multiple operations", async () => {
    render(<ToDoContainer />);
    
    await addNewTask("Task 1", "Notes 1");
    await addNewTask("Task 2", "Notes 2");

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();

    const firstTaskCheckbox = screen.getAllByRole("checkbox")[0];
    fireEvent.click(firstTaskCheckbox);

    expect(screen.getByText("Task 1")).toHaveClass("line-through");
    expect(screen.getByText("Task 2")).not.toHaveClass("line-through");
  });

  it("should handle active tasks first sorting correctly", async () => {
    const user = userEvent.setup();
    render(<ToDoContainer />);
    
    // Add tasks with different states
    await addNewTask("Active Task");
    const firstCheckbox = screen.getByRole("checkbox");
    
    await addNewTask("Another Active Task");
    fireEvent.click(firstCheckbox);

    const menuButton = screen.getByLabelText("tasks menu");
    await user.click(menuButton);

    const sortActiveButton = screen.getByText(/active tasks first/i);
    fireEvent.click(sortActiveButton);

    // Verify order 
    const tasks = screen.getAllByRole("listitem", { hidden: true });
    expect(within(tasks[0]).getByText("Another Active Task")).toBeInTheDocument();
  });

  it("should handle completed tasks first sorting correctly", async () => {
    const user = userEvent.setup();
    render(<ToDoContainer />);
    
    // Add tasks with different states
    await addNewTask("Active Task");    
    await addNewTask("Another Active Task");
    const secondCheckbox = screen.getAllByRole("checkbox")[1];
    fireEvent.click(secondCheckbox);

    const menuButton = screen.getByLabelText("tasks menu");
    await user.click(menuButton);

    const sortActiveButton = screen.getByText(/completed tasks first/i);
    fireEvent.click(sortActiveButton);

    // Verify order 
    const tasks = screen.getAllByRole("listitem", { hidden: true });
    expect(within(tasks[0]).getByText("Another Active Task")).toBeInTheDocument();
  });

  it("should handle delete completed tasks correctly", async () => {
    const user = userEvent.setup();
    render(<ToDoContainer />);
    
    // Add multiple tasks
    await addNewTask("Task 1");
    await addNewTask("Task 2");
    await addNewTask("Task 3");
    
    // Mark second task as complete
    const firstCheckbox = screen.getAllByRole("checkbox")[1];
    fireEvent.click(firstCheckbox);
    expect(screen.getByText("Task 2")).toHaveClass("line-through");

    const menuButton = screen.getByLabelText("tasks menu");
    await user.click(menuButton);

    // Delete finished tasks
    const clearCompletedTasksButton = screen.getByText(/clear completed tasks/i);
    fireEvent.click(clearCompletedTasksButton);
    const confirmDeleteButton = screen.getByLabelText(/confirm delete task/i);
    fireEvent.click(confirmDeleteButton);

    // Verify only unfinished task remains
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.queryByText("Task 2")).not.toBeInTheDocument();
    expect(screen.getByText("Task 3")).toBeInTheDocument();
  });

  it("should handle delete all tasks correctly", async () => {
    const user = userEvent.setup();
    render(<ToDoContainer />);
    
    // Add multiple tasks
    await addNewTask("Task 1");
    await addNewTask("Task 2");
    await addNewTask("Task 3");
    
    // Mark second task as complete
    const firstCheckbox = screen.getAllByRole("checkbox")[1];
    fireEvent.click(firstCheckbox);
    expect(screen.getByText("Task 2")).toHaveClass("line-through");

    const menuButton = screen.getByLabelText("tasks menu");
    await user.click(menuButton);

    // Delete all tasks
    const clearAllTasksButton = screen.getByText(/clear all tasks/i);
    fireEvent.click(clearAllTasksButton);
    const confirmDeleteButton = screen.getByLabelText(/confirm delete task/i);
    fireEvent.click(confirmDeleteButton);

    // Verify no tasks remain
    expect(screen.queryAllByRole("listitem", { hidden: true })).toHaveLength(0);
  });

  it("should handle task editing flow", async () => {
    render(<ToDoContainer />);
    
    await addNewTask("Original Task");

    fireEvent.click(screen.getByLabelText("edit task"));

    const titleInput = screen.getByLabelText(/task title/i);
    fireEvent.change(titleInput, { target: { value: "Updated Task" } });

    fireEvent.click(screen.getByText("Update"));

    expect(screen.getByText("Updated Task")).toBeInTheDocument();
    expect(screen.queryByText("Original Task")).not.toBeInTheDocument();
  });

  it("should persist tasks between renders", async () => {
    const { unmount } = render(<ToDoContainer />);
    
    await addNewTask("Persistent Task");

    unmount();
    render(<ToDoContainer />);

    // Verify task persists (assuming local storage implementation)
    expect(screen.getByText("Persistent Task")).toBeInTheDocument();
  });
});

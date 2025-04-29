import { useState } from "react";
import TaskForm from "./TaskForm";
import ToDoHeader from "./ToDoHeader";
import { Task } from "../types/types";
import { useTaskManager } from "../hooks/useTaskManager";
import { AddTaskButton } from "./AddTaskButton";
import { TaskList } from "./TaskList";

export default function ToDoContainer() {
  const {
    tasks,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    reorderTasks,
    sortActiveTasksFirst,
    sortFinishedTasksFirst,
    deleteFinishedTasks,
    deleteAllTasks,
  } = useTaskManager();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const handleFormClose = () => {
    setShowTaskForm(false);
    setTaskToEdit(null);
  };

  return (
    <div
      className="flex w-full max-w-md flex-col gap-6 p-4"
      id="toDoListContainer"
    >
      <ToDoHeader
        sortActiveTasksFirst={sortActiveTasksFirst}
        sortFinishedTasksFirst={sortFinishedTasksFirst}
        deleteFinishedTasks={deleteFinishedTasks}
        deleteAllTasks={deleteAllTasks}
      />

      {showTaskForm && !taskToEdit && (
        <TaskForm
          handleFormClose={handleFormClose}
          onTaskSubmit={addTask}
          initialTask={null}
          isEditing={false}
        />
      )}

      {!showTaskForm && (
        <AddTaskButton
          onClick={() => {
            if (taskToEdit) {
              setTaskToEdit(null);
            }
            setShowTaskForm(true);
          }}
        />
      )}

      <TaskList
        handleFormClose={handleFormClose}
        taskToEdit={taskToEdit}
        updateTask={updateTask}
        reorderTasks={reorderTasks}
        deleteTask={deleteTask}
        tasks={tasks}
        toggleTask={toggleTask}
        editTask={(task) => {
          setShowTaskForm(false);
          setTaskToEdit(task);
        }}
      />
    </div>
  );
}

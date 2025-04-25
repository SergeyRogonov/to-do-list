import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import ThreeDots from "../assets/icons/three-vertical-dots.svg?react";
import plusCircle from "../assets/icons/plus-circle.svg";
import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";
import { Task, TaskListProps } from "../types/types";
import { useTaskManager } from "../hooks/useTaskManager";

export default function ToDoList() {
  const { tasks, addTask, updateTask, toggleTask, deleteTask, reorderTasks } =
    useTaskManager();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const handleFormClose = () => {
    setShowTaskForm(false);
    setTaskToEdit(null);
  };

  const ToDoHeader = () => (
    <div className="flex flex-row justify-between border-b-3 border-gray-200 pb-2">
      <div className="text-3xl font-bold text-white">Tasks</div>

      <button
        className="cursor-pointer rounded bg-[#89eacbb3] px-0.5 text-3xl font-bold hover:bg-[#89EACB]"
        id="toDoListDropdown"
        aria-label="menu options"
      >
        <ThreeDots fill="white" />
      </button>
    </div>
  );

  const TaskList = ({ tasks, onToggle, onEdit, onDelete }: TaskListProps) => {
    const onDragEnd = (result: DropResult) => {
      if (!result.destination) return;
      reorderTasks(result.source.index, result.destination.index);
    };

    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div
              className="flex w-full max-w-md flex-col"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      className="mb-2"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {taskToEdit?.id === task.id ? (
                        <TaskForm
                          key={task.id}
                          onClose={handleFormClose}
                          onTaskSubmit={updateTask}
                          onTaskDelete={deleteTask}
                          initialTask={taskToEdit}
                          isEditing={true}
                        />
                      ) : (
                        <div
                          role="listitem"
                          key={task.id}
                          draggable={true}
                          className="cursor-grab [&.is-dragging]:cursor-grabbing"
                        >
                          <TaskItem
                            key={task.id}
                            task={task}
                            onToggle={onToggle}
                            onEdit={onEdit}
                            onDelete={onDelete}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {/* This placeholder maintains the space for the dragged item */}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  };
  interface AddTaskButtonProps {
    onClick: () => void;
  }

  const AddTaskButton = ({ onClick }: AddTaskButtonProps) => (
    <button
      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-3 border-dashed border-gray-100 bg-[#23cc97c6] px-2 py-4 text-gray-100 shadow-xl hover:border-white hover:bg-[#23cc97] hover:text-white"
      id="addTask"
      aria-label="add new task"
      onClick={onClick}
    >
      <span>
        <img src={plusCircle} className="w-6" alt="add" />
      </span>
      <span className="text-2xl font-bold">Add Task</span>
    </button>
  );

  return (
    <div
      className="flex w-full max-w-md flex-col gap-6 p-4"
      id="toDoListContainer"
    >
      <ToDoHeader />

      {showTaskForm && !taskToEdit && (
        <TaskForm
          onClose={handleFormClose}
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
        onDelete={deleteTask}
        tasks={tasks}
        onToggle={toggleTask}
        onEdit={(task) => {
          setShowTaskForm(false);
          setTaskToEdit(task);
        }}
      />
    </div>
  );
}

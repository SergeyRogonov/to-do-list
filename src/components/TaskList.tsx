import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm";
import { Task } from "../types/types";

interface TaskListProps {
  tasks: Task[];
  toggleTask: (taskId: string) => void;
  editTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  updateTask: (updatedTask: Task) => void;
  reorderTasks: (draggedTaskIndex: number, targetTaskIndex: number) => void;
  taskToEdit: Task | null;
  handleFormClose: () => void;
}

export const TaskList = ({
  tasks,
  toggleTask,
  editTask,
  deleteTask,
  updateTask,
  reorderTasks,
  taskToEdit,
  handleFormClose,
}: TaskListProps) => {
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
                        handleFormClose={handleFormClose}
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
                          toggleTask={toggleTask}
                          editTask={editTask}
                          deleteTask={deleteTask}
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

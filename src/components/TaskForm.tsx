import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Task } from "../types/types.ts";
import { useTaskManager } from "@/hooks/useTaskManager.ts";
import { ConfirmationModal } from "./ConfirmationModal.tsx";

interface TaskFormProps {
  onClose: () => void;
  onTaskSubmit: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
  initialTask: Task | null;
  isEditing: boolean;
}

export default function TaskForm({
  onClose,
  onTaskSubmit,
  onTaskDelete,
  initialTask,
  isEditing = false,
}: TaskFormProps) {
  const [addNotes, setAddNotes] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskNotes, setTaskNotes] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const { deleteTask } = useTaskManager();

  useEffect(() => {
    if (isEditing && initialTask) {
      setTaskTitle(initialTask.taskTitle);
      setTaskNotes(initialTask.taskNotes);
      setAddNotes(initialTask.taskNotes !== "");
    }
  }, [isEditing, initialTask]);

  const handleAddNotesClick = () => {
    setAddNotes(true);
  };

  const sanitizeInput = (input: string): string => {
    return input.replace(/<[^>]*>/g, "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const sanitizedTitle = sanitizeInput(taskTitle).trim();
    const sanitizedNotes = sanitizeInput(taskNotes).trim();

    if (sanitizedTitle) {
      const taskData: Task = {
        id: isEditing && initialTask ? initialTask.id : uuidv4(),
        taskTitle: sanitizedTitle,
        taskNotes: sanitizedNotes,
        finished: isEditing && initialTask ? initialTask.finished : false,
      };

      onTaskSubmit(taskData);
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    if (initialTask) {
      deleteTask(initialTask.id);
      if (onTaskDelete) {
        onTaskDelete(initialTask.id);
      }
      setShowDeleteConfirmation(false);
      onClose();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full" autoComplete="off">
        <div className="rounded-md bg-white">
          <div className="flex flex-col gap-4 p-4">
            <div>
              <input
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="What are you working on?"
                type="text"
                maxLength={200}
                value={taskTitle}
                id="taskTitle"
                className="w-full text-xl font-bold text-gray-600 placeholder:text-lg placeholder:text-gray-300 placeholder:italic focus:outline-0"
              ></input>
            </div>
            <div>
              {addNotes ? (
                <textarea
                  onChange={(e) => setTaskNotes(e.target.value)}
                  id="taskNotes"
                  placeholder="Some notes..."
                  maxLength={1000}
                  value={taskNotes}
                  className="w-full rounded-md bg-gray-100 p-2 text-gray-600 placeholder:text-gray-300 focus:outline-0"
                ></textarea>
              ) : (
                <button
                  type="button"
                  className="cursor-pointer border-b border-b-gray-400 text-sm font-semibold text-gray-400"
                  onClick={handleAddNotesClick}
                >
                  + Add note
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-between rounded-b-md bg-gray-200 p-2 px-4">
            <div>
              {isEditing && initialTask ? (
                <button
                  className="cursor-pointer rounded-md bg-red-700 px-4 py-2 font-semibold text-white hover:bg-red-800"
                  type="button"
                  onClick={handleDeleteClick}
                >
                  Delete
                </button>
              ) : (
                ""
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="cursor-pointer rounded-md p-2 font-semibold text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                className="cursor-pointer rounded-md bg-gray-700 px-4 py-2 font-semibold text-white hover:bg-gray-800"
                type="submit"
              >
                {isEditing ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </form>
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this task?"
      />
    </>
  );
}

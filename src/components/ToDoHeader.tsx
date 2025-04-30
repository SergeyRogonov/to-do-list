import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import ThreeDots from "../assets/icons/three-vertical-dots.svg?react";
import { ConfirmationModal } from "./ConfirmationModal";
import { useState } from "react";

interface ToDoHeaderProps {
  sortActiveTasksFirst: () => void;
  sortFinishedTasksFirst: () => void;
  deleteFinishedTasks: () => void;
  deleteAllTasks: () => void;
}

export default function ToDoHeader({
  sortActiveTasksFirst,
  sortFinishedTasksFirst,
  deleteFinishedTasks,
  deleteAllTasks,
}: ToDoHeaderProps) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deletionType, setDeletionType] = useState<"completed" | "all" | null>(
    null,
  );

  const handleDeleteCompletedTasksClick = () => {
    setDeletionType("completed");
    setShowDeleteConfirmation(true);
  };

  const handleDeleteAllTasksClick = () => {
    setDeletionType("all");
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    if (deletionType === "all") {
      deleteAllTasks();
    } else if (deletionType === "completed") {
      deleteFinishedTasks();
    }
    setShowDeleteConfirmation(false);
    setDeletionType(null);
  };

  return (
    <>
      <div className="flex flex-row justify-between border-b-3 border-gray-200 pb-2">
        <div className="text-3xl font-bold text-white">Tasks</div>
        <Menu>
          <MenuButton className="cursor-pointer rounded-md bg-[#89eacbb3] px-1.5 py-1 data-hover:bg-[#89EACB] data-open:bg-[#89EACB]">
            <ThreeDots
              fill="white"
              aria-hidden="true"
              className="pointer-events-none"
            />
          </MenuButton>

          <MenuItems
            transition
            anchor="bottom end"
            className="w-48 origin-top-right rounded-xl border border-white/5 bg-white p-1 text-sm/6 text-gray-600 transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
          >
            <MenuItem>
              <button
                className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-gray-100"
                onClick={sortActiveTasksFirst}
              >
                Active Tasks First
              </button>
            </MenuItem>
            <MenuItem>
              <button
                className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-gray-100"
                onClick={sortFinishedTasksFirst}
              >
                Completed Tasks First
              </button>
            </MenuItem>
            <MenuItem>
              <button
                className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-gray-100"
                onClick={handleDeleteCompletedTasksClick}
              >
                Clear Completed Tasks
              </button>
            </MenuItem>
            <MenuItem>
              <button
                className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-gray-100"
                onClick={handleDeleteAllTasksClick}
              >
                Clear All Tasks
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete these tasks?"
      />
    </>
  );
}

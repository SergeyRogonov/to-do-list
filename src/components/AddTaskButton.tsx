import plusCircle from "../assets/icons/plus-circle.svg";

interface AddTaskButtonProps {
  onClick: () => void;
}

export const AddTaskButton = ({ onClick }: AddTaskButtonProps) => (
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

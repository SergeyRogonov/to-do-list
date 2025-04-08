import threeDots from "../assets/icons/three-vertical-dots.svg";
import plusCircle from "../assets/icons/plus-circle.svg";

export default function ToDoList() {
  return (
    <div
      className="flex w-full max-w-md flex-col gap-6 p-4"
      id="toDoListContainer"
    >
      <div className="flex flex-row justify-between border-b-3 border-gray-200 pb-2">
        <div className="text-3xl font-bold text-white">Tasks</div>

        <button
          className="cursor-pointer rounded bg-[#89eacbb3] px-0.5 text-3xl font-bold text-white hover:bg-[#89EACB]"
          id="toDoListDropdown"
          aria-label="menu options"
        >
          <img src={threeDots} alt="menu options" />
        </button>
      </div>
      <button
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-3 border-dashed border-gray-100 bg-[#23cc97c6] px-2 py-4 text-gray-100 shadow-xl hover:border-white hover:bg-[#23cc97] hover:text-white"
        id="addTask"
        aria-label="add new task"
      >
        <span>
          <img src={plusCircle} className="w-6" alt="add" />
        </span>
        <span className="text-2xl font-bold">Add Task</span>
      </button>
    </div>
  );
}

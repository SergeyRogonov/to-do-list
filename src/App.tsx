import "./App.css";
import ToDoContainer from "@/components/ToDoContainer";

function App() {
  return (
    <div
      id="appContainer"
      className="flex h-auto min-h-screen w-full flex-col items-center gap-4 bg-[#5DE3B8] pt-8"
    >
      <h1 className="text-center text-4xl font-extrabold text-white text-shadow-2xs text-shadow-gray-300">
        To Do List
      </h1>
      <ToDoContainer />
    </div>
  );
}

export default App;

import { useEffect, useState, useRef } from "react";
import CheckboxCircle from "../assets/icons/checkbox-circle.svg?react";
import ThreeDots from "../assets/icons/three-vertical-dots.svg?react";
import { TaskItemProps } from "../types/types.ts";

export default function TaskItem({ task, onToggle, onEdit }: TaskItemProps) {
  const [showMore, setShowMore] = useState(false);
  const [hasMoreContent, setHasMoreContent] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const handleShowMoreClick = () => {
    setShowMore(!showMore);
  };

  // Checks if the task notes content exceeds two lines of text and needs expansion/truncation. Sets hasMoreContent state based on content height comparison
  useEffect(() => {
    const checkHeight = () => {
      const element = contentRef.current;
      if (element) {
        const lineHeight = parseInt(
          window.getComputedStyle(element).lineHeight || "0",
        );
        const twoLinesHeight = lineHeight * 2;

        setHasMoreContent(element.scrollHeight > twoLinesHeight);
      }
    };

    checkHeight();
    window.addEventListener("resize", checkHeight);
    return () => window.removeEventListener("resize", checkHeight);
  }, [task.taskNotes]);

  const renderNotes = () => {
    if (task.taskNotes.length === 0) {
      return null;
    }

    return (
      <div className="mr-2 ml-6 rounded-md bg-yellow-50 p-2">
        <div
          ref={contentRef}
          className={`${showMore ? "whitespace-pre-wrap" : "line-clamp-2 whitespace-pre-wrap"} wrap-anywhere`}
        >
          {task.taskNotes}
        </div>
        {hasMoreContent && (
          <button
            onClick={handleShowMoreClick}
            className="cursor-pointer text-xs"
          >
            {showMore ? "Show less" : "Show more"}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="flex w-full flex-col gap-4 rounded-md border-l-4 border-gray-700 bg-white p-2">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <button
            role="checkbox"
            aria-checked={task.finished}
            tabIndex={0}
            onClick={() => onToggle(task.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onToggle(task.id);
              }
            }}
            className="cursor-pointer"
          >
            <CheckboxCircle
              width={24}
              height={24}
              fill={task.finished ? "#23cc97" : "#d3d3d3"}
              className="pointer-events-none transition-colors duration-200"
              aria-hidden="true"
            />
          </button>
          <span
            className={`${
              task.finished ? "text-gray-500 line-through" : "text-gray-600"
            } text-xl font-bold wrap-anywhere`}
          >
            {task.taskTitle}
          </span>
        </div>

        <div className="relative flex" ref={optionsRef}>
          <button
            className="h-min cursor-pointer rounded px-0.5 text-3xl font-bold hover:bg-gray-100"
            onClick={() => onEdit(task)}
            aria-label="edit task"
          >
            <ThreeDots
              fill="#4b5563"
              aria-hidden="true"
              className="pointer-events-none"
            />
          </button>
        </div>
      </div>
      {renderNotes()}
    </div>
  );
}

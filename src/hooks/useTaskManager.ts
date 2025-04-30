import { useEffect, useState, useCallback } from "react";
import { Task } from "../types/types";

export const useTaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasksList");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  const deleteTask = (taskId: string) => {
    setTasks((prevTasks) => {
      const remainingTasks = prevTasks.filter((task) => task.id != taskId);
      localStorage.setItem("tasksList", JSON.stringify(remainingTasks));
      return remainingTasks;
    });
  };

  const updateTask = useCallback((updatedTask: Task) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task,
      );
      localStorage.setItem("tasksList", JSON.stringify(updatedTasks));
      return updatedTasks;
    });
  }, []);

  const addTask = useCallback((newTask: Task) => {
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks, newTask];
      localStorage.setItem("tasksList", JSON.stringify(updatedTasks));
      return updatedTasks;
    });
  }, []);

  const toggleTask = useCallback((taskId: string) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === taskId ? { ...task, finished: !task.finished } : task,
      );
      localStorage.setItem("tasksList", JSON.stringify(updatedTasks));
      return updatedTasks;
    });
  }, []);

  const reorderTasks = (draggedTaskIndex: number, targetTaskIndex: number) => {
    setTasks((prevTasks) => {
      const newTasks = [...prevTasks];
      const [draggedTask] = newTasks.splice(draggedTaskIndex, 1);
      newTasks.splice(targetTaskIndex, 0, draggedTask);

      localStorage.setItem("tasksList", JSON.stringify(newTasks));
      return newTasks;
    });
  };

  const sortActiveTasksFirst = useCallback(() => {
    setTasks((prevTasks) => {
      const activeTasks = [...prevTasks].filter((task) => !task.finished);
      const finishedTasks = [...prevTasks].filter((task) => task.finished);
      const newTasks = [...activeTasks, ...finishedTasks];
      localStorage.setItem("tasksList", JSON.stringify(newTasks));
      return newTasks;
    });
  }, []);

  const sortFinishedTasksFirst = useCallback(() => {
    setTasks((prevTasks) => {
      const activeTasks = [...prevTasks].filter((task) => !task.finished);
      const finishedTasks = [...prevTasks].filter((task) => task.finished);
      const newTasks = [...finishedTasks, ...activeTasks];
      localStorage.setItem("tasksList", JSON.stringify(newTasks));
      return newTasks;
    });
  }, []);

  const deleteFinishedTasks = () => {
    setTasks((prevTasks) => {
      const activeTasks = [...prevTasks].filter((task) => !task.finished);
      localStorage.setItem("tasksList", JSON.stringify(activeTasks));
      return activeTasks;
    });
  };

  const deleteAllTasks = () => {
    setTasks(() => {
      localStorage.setItem("tasksList", JSON.stringify([]));
      return [];
    });
  };

  return {
    tasks,
    deleteTask,
    updateTask,
    addTask,
    toggleTask,
    reorderTasks,
    sortActiveTasksFirst,
    sortFinishedTasksFirst,
    deleteFinishedTasks,
    deleteAllTasks,
  };
};

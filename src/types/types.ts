export interface Task {
  id: string;
  taskTitle: string;
  taskNotes: string;
  finished: boolean;
}

export interface TaskActionProps {
  onToggle: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export interface TaskListProps extends TaskActionProps {
  tasks: Task[];
}

export interface TaskItemProps extends TaskActionProps {
  task: Task;
}

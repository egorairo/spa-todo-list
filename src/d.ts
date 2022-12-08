export interface Project {
  id: string;
  name: string;
  tasks: number;
  dateCreated: Date;
}

export interface Subtasks {
  id: string;
  title: string;
  checked: boolean;
}

export interface Comment {
  id: string;
  name: string;
  comment: string;
}

export interface Comments {
  id: string;
  name: string;
  title?: string;
  comment: string;
  cascade: Comment[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dateCreated: Date | null;
  deadline?: string;
  timeInDevelop?: Date | null;
  priority?: 'high' | 'medium' | 'low';
  files?: string;
  status: 'queue' | 'development' | 'done';
  subTasks: Subtasks[];
  comments: Comments[];
}

export interface Tasks {
  queue: Task[];
  development: Task[];
  done: Task[];
}

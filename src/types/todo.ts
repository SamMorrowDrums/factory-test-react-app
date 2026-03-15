export type TodoCategory = 'work' | 'personal' | 'shopping' | 'health';

export type TodoPriority = 'low' | 'medium' | 'high';

export type TodoFilter = 'all' | 'active' | 'completed';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  category: TodoCategory;
  priority: TodoPriority;
  createdAt: number;
  dueDate?: number;
  notes?: string;
  tags?: string[];
}

export function createTodo(
  title: string,
  category: TodoCategory,
  options?: { notes?: string; priority?: TodoPriority; dueDate?: number; tags?: string[] },
): Todo {
  const todo: Todo = {
    id: crypto.randomUUID(),
    title,
    completed: false,
    category,
    priority: options?.priority ?? 'medium',
    createdAt: Date.now(),
  };
  if (options?.notes) {
    todo.notes = options.notes;
  }
  if (options?.dueDate) {
    todo.dueDate = options.dueDate;
  }
  if (options?.tags && options.tags.length > 0) {
    todo.tags = options.tags;
  }
  return todo;
}

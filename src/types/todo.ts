export type TodoCategory = 'work' | 'personal' | 'shopping' | 'health';

export type TodoPriority = 'low' | 'medium' | 'high';

export type TodoFilter = 'all' | 'active' | 'completed';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  category: TodoCategory;
  priority: TodoPriority;
  dueDate?: number;
  createdAt: number;
}

export function createTodo(
  title: string,
  category: TodoCategory,
  priority: TodoPriority = 'medium',
  dueDate?: number,
): Todo {
  return {
    id: crypto.randomUUID(),
    title,
    completed: false,
    category,
    priority,
    ...(dueDate !== undefined ? { dueDate } : {}),
    createdAt: Date.now(),
  };
}

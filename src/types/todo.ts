export type TodoCategory = 'work' | 'personal' | 'shopping' | 'health';

export type TodoPriority = 'low' | 'medium' | 'high';

export type TodoFilter = 'all' | 'active' | 'completed';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  category: TodoCategory;
  priority: TodoPriority;
  dueDate: number | null;
  createdAt: number;
}

export function createTodo(
  title: string,
  category: TodoCategory,
  priority: TodoPriority = 'medium',
  dueDate: number | null = null,
): Todo {
  return {
    id: crypto.randomUUID(),
    title,
    completed: false,
    category,
    priority,
    dueDate,
    createdAt: Date.now(),
  };
}

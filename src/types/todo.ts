export type TodoCategory = 'work' | 'personal' | 'shopping' | 'health';

export type TodoFilter = 'all' | 'active' | 'completed';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  category: TodoCategory;
  createdAt: number;
  notes?: string;
}

export function createTodo(title: string, category: TodoCategory): Todo {
  return {
    id: crypto.randomUUID(),
    title,
    completed: false,
    category,
    createdAt: Date.now(),
  };
}

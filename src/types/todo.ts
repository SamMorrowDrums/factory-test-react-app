export type TodoCategory = 'work' | 'personal' | 'shopping' | 'health';

export type TodoFilter = 'all' | 'active' | 'completed';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  category: TodoCategory;
  createdAt: number;
  parentId?: string;
}

export function createTodo(title: string, category: TodoCategory, parentId?: string): Todo {
  return {
    id: crypto.randomUUID(),
    title,
    completed: false,
    category,
    createdAt: Date.now(),
    ...(parentId != null ? { parentId } : {}),
  };
}

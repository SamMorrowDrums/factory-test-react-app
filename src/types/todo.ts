export type TodoCategory = 'work' | 'personal' | 'shopping' | 'health';

export type TodoFilter = 'all' | 'active' | 'completed';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  category: TodoCategory;
  tags: string[];
  createdAt: number;
}

export function createTodo(title: string, category: TodoCategory, tags: string[] = []): Todo {
  return {
    id: crypto.randomUUID(),
    title,
    completed: false,
    category,
    tags: [...new Set(tags.map((t) => t.trim().toLowerCase()).filter(Boolean))],
    createdAt: Date.now(),
  };
}

export type TodoCategory = 'work' | 'personal' | 'shopping' | 'health';

export type TodoFilter = 'all' | 'active' | 'completed';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  category: TodoCategory;
  createdAt: number;
  notes?: string;
  tags?: string[];
}

export function createTodo(title: string, category: TodoCategory, notes?: string, tags?: string[]): Todo {
  const todo: Todo = {
    id: crypto.randomUUID(),
    title,
    completed: false,
    category,
    createdAt: Date.now(),
  };
  if (notes) {
    todo.notes = notes;
  }
  if (tags && tags.length > 0) {
    todo.tags = tags;
  }
  return todo;
}

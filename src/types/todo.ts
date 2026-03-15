export type TodoCategory = 'work' | 'personal' | 'shopping' | 'health';

export type TodoFilter = 'all' | 'active' | 'completed';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  category: TodoCategory;
  createdAt: number;
  notes?: string;
  parentId?: string;
}

export function createTodo(title: string, category: TodoCategory, notes?: string, parentId?: string): Todo {
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
  if (parentId) {
    todo.parentId = parentId;
  }
  return todo;
}

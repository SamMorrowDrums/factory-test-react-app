export type TodoCategory = 'work' | 'personal' | 'shopping' | 'health';

export type TodoFilter = 'all' | 'active' | 'completed';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  category: TodoCategory;
}

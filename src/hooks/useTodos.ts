import { Todo, TodoCategory, TodoPriority, createTodo } from '../types/todo';
import { useLocalStorage } from './useLocalStorage';

export function useTodos(initialTodos: Todo[] = []) {
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', initialTodos);

  const addTodo = (
    title: string,
    category: TodoCategory,
    priority: TodoPriority = 'medium',
    dueDate: number | null = null,
  ) => {
    setTodos((prev) => [...prev, createTodo(title, category, priority, dueDate)]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  return { todos, addTodo, toggleTodo, deleteTodo, clearCompleted } as const;
}

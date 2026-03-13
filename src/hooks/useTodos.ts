import { Todo, TodoCategory, createTodo } from '../types/todo';
import { useLocalStorage } from './useLocalStorage';

export function useTodos(initialTodos: Todo[] = []) {
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', initialTodos);

  const addTodo = (title: string, category: TodoCategory) => {
    setTodos((prev) => [...prev, createTodo(title, category)]);
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

  const reorderTodos = (fromId: string, toId: string) => {
    if (fromId === toId) return;
    setTodos((prev) => {
      const fromIndex = prev.findIndex((t) => t.id === fromId);
      const toIndex = prev.findIndex((t) => t.id === toId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  return { todos, addTodo, toggleTodo, deleteTodo, clearCompleted, reorderTodos } as const;
}

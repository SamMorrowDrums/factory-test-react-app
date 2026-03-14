import { Todo, TodoCategory, createTodo } from '../types/todo';
import { useLocalStorage } from './useLocalStorage';

export function useTodos(initialTodos: Todo[] = []) {
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', initialTodos);

  const addTodo = (title: string, category: TodoCategory, parentId?: string) => {
    setTodos((prev) => [...prev, createTodo(title, category, parentId)]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) => {
      const target = prev.find((t) => t.id === id);
      if (!target) return prev;
      const newCompleted = !target.completed;
      return prev.map((todo) => {
        if (todo.id === id) return { ...todo, completed: newCompleted };
        // Cascade to children when toggling a parent
        if (todo.parentId === id) return { ...todo, completed: newCompleted };
        return todo;
      });
    });
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id && todo.parentId !== id));
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  return { todos, addTodo, toggleTodo, deleteTodo, clearCompleted } as const;
}

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

  const addTag = (id: string, tag: string) => {
    const normalized = tag.trim().toLowerCase();
    if (!normalized) return;
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id && !todo.tags.includes(normalized)
          ? { ...todo, tags: [...todo.tags, normalized] }
          : todo,
      ),
    );
  };

  const removeTag = (id: string, tag: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, tags: todo.tags.filter((t) => t !== tag) }
          : todo,
      ),
    );
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  return { todos, addTodo, toggleTodo, deleteTodo, addTag, removeTag, clearCompleted } as const;
}

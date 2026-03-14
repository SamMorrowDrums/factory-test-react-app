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

  const reorderTodos = (draggedId: string, targetId: string) => {
    if (draggedId === targetId) return;
    setTodos((prev) => {
      const draggedIndex = prev.findIndex((t) => t.id === draggedId);
      const targetIndex = prev.findIndex((t) => t.id === targetId);
      if (draggedIndex === -1 || targetIndex === -1) return prev;

      const next = [...prev];
      const [dragged] = next.splice(draggedIndex, 1);
      const newTargetIndex = next.findIndex((t) => t.id === targetId);
      next.splice(newTargetIndex, 0, dragged);
      return next;
    });
  };

  return { todos, addTodo, toggleTodo, deleteTodo, clearCompleted, reorderTodos } as const;
}

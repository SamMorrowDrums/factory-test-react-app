import { useState, useCallback } from 'react';
import { createTodo } from '../types/todo';
import type { Todo, TodoCategory } from '../types/todo';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = useCallback((title: string, category: TodoCategory) => {
    setTodos((prev) => [...prev, createTodo(title, category)]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  }, []);

  return { todos, addTodo, toggleTodo, deleteTodo, clearCompleted };
}

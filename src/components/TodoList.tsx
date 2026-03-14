import { useState, useRef, useCallback, useMemo } from 'react';
import { type Todo, type TodoCategory, type TodoFilter as TodoFilterType } from '../types/todo';
import { useTodos } from '../hooks/useTodos';
import { TodoFilter } from './TodoFilter';
import { TodoItem } from './TodoItem';
import { CyberButton } from './CyberButton';
import './TodoList.css';

interface TodoListProps {
  todos?: Todo[];
  toggleTodo?: (id: string) => void;
  deleteTodo?: (id: string) => void;
  clearCompleted?: () => void;
  reorderTodos?: (draggedId: string, targetId: string) => void;
}

export function TodoList(props: TodoListProps) {
  const internal = useTodos();
  const todos = props.todos ?? internal.todos;
  const toggleTodo = props.toggleTodo ?? internal.toggleTodo;
  const deleteTodo = props.deleteTodo ?? internal.deleteTodo;
  const clearCompleted = props.clearCompleted ?? internal.clearCompleted;
  const reorderTodos = props.reorderTodos ?? internal.reorderTodos;
  const [filter, setFilter] = useState<TodoFilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState<TodoCategory | 'all'>('all');
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const draggedIdRef = useRef<string | null>(null);

  const filteredTodos = useMemo(() => todos.filter((todo) => {
    if (filter === 'active' && todo.completed) return false;
    if (filter === 'completed' && !todo.completed) return false;
    if (categoryFilter !== 'all' && todo.category !== categoryFilter) return false;
    return true;
  }), [todos, filter, categoryFilter]);

  const activeCount = useMemo(() => todos.filter((todo) => !todo.completed).length, [todos]);
  const hasCompleted = useMemo(() => todos.some((todo) => todo.completed), [todos]);

  const handleDragStart = useCallback((todoId: string) => (e: React.DragEvent<HTMLLIElement>) => {
    draggedIdRef.current = todoId;
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((todoId: string) => (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedIdRef.current && draggedIdRef.current !== todoId) {
      setDragOverId(todoId);
    }
  }, []);

  const handleDrop = useCallback((todoId: string) => (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
    if (draggedIdRef.current && draggedIdRef.current !== todoId) {
      reorderTodos(draggedIdRef.current, todoId);
    }
    draggedIdRef.current = null;
    setDragOverId(null);
  }, [reorderTodos]);

  const handleDragEnd = useCallback(() => {
    draggedIdRef.current = null;
    setDragOverId(null);
  }, []);

  return (
    <div className="todo-list">
      <TodoFilter
        currentFilter={filter}
        currentCategory={categoryFilter}
        onFilterChange={setFilter}
        onCategoryChange={setCategoryFilter}
      />

      <ul className="todo-list__items">
        {filteredTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            isDragging={draggedIdRef.current === todo.id}
            isDragOver={dragOverId === todo.id}
            onDragStart={handleDragStart(todo.id)}
            onDragOver={handleDragOver(todo.id)}
            onDrop={handleDrop(todo.id)}
            onDragEnd={handleDragEnd}
          />
        ))}
      </ul>

      <div className="todo-list__footer">
        <span className="todo-list__count">
          {activeCount} {activeCount === 1 ? 'item' : 'items'} left
        </span>

        {hasCompleted && (
          <CyberButton
            variant="ghost"
            size="sm"
            onClick={clearCompleted}
          >
            Clear completed
          </CyberButton>
        )}
      </div>
    </div>
  );
}

import { useState, useRef } from 'react';
import { type Todo, type TodoCategory, type TodoFilter as TodoFilterType } from '../types/todo';
import { useTodos } from '../hooks/useTodos';
import { TodoFilter } from './TodoFilter';
import { TodoItem } from './TodoItem';
import './TodoList.css';

interface TodoListProps {
  todos?: Todo[];
  toggleTodo?: (id: string) => void;
  deleteTodo?: (id: string) => void;
  clearCompleted?: () => void;
  reorderTodos?: (fromId: string, toId: string) => void;
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
  const draggedId = useRef<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active' && todo.completed) return false;
    if (filter === 'completed' && !todo.completed) return false;
    if (categoryFilter !== 'all' && todo.category !== categoryFilter) return false;
    return true;
  });

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const hasCompleted = todos.some((todo) => todo.completed);

  const handleDragStart = (id: string) => {
    draggedId.current = id;
  };

  const handleDragOver = (id: string) => {
    if (draggedId.current && draggedId.current !== id) {
      setDragOverId(id);
    }
  };

  const handleDrop = (targetId: string) => {
    if (draggedId.current && draggedId.current !== targetId) {
      reorderTodos(draggedId.current, targetId);
    }
    draggedId.current = null;
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    draggedId.current = null;
    setDragOverId(null);
  };

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
            isDragOver={dragOverId === todo.id}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
          />
        ))}
      </ul>

      <div className="todo-list__footer">
        <span className="todo-list__count">
          {activeCount} {activeCount === 1 ? 'item' : 'items'} left
        </span>

        {hasCompleted && (
          <button
            className="todo-list__clear-completed"
            onClick={clearCompleted}
          >
            Clear completed
          </button>
        )}
      </div>
    </div>
  );
}

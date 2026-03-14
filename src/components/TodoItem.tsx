import { memo, useState, useCallback, useRef } from 'react';
import type { Todo } from '../types/todo';
import './TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
  isDragOver?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLLIElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLLIElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLLIElement>) => void;
  onDragEnd?: (e: React.DragEvent<HTMLLIElement>) => void;
}

export const TodoItem = memo(function TodoItem({
  todo,
  onToggle,
  onDelete,
  isDragging = false,
  isDragOver = false,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: TodoItemProps) {
  const [isExiting, setIsExiting] = useState(false);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const classNames = [
    'todo-item',
    todo.completed ? 'todo-item--completed' : '',
    isDragging ? 'todo-item--dragging' : '',
    isDragOver ? 'todo-item--drag-over' : '',
    isExiting ? 'todo-item--exiting' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const handleToggle = useCallback(() => onToggle(todo.id), [onToggle, todo.id]);
  const handleDelete = useCallback(() => {
    setIsExiting(true);
    exitTimerRef.current = setTimeout(() => onDelete(todo.id), 200);
  }, [onDelete, todo.id]);

  return (
    <li
      className={classNames}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      <span className="todo-item__drag-handle" aria-label="Drag to reorder">
        ⠿
      </span>

      <label className="todo-item__label">
        <input
          type="checkbox"
          className="todo-item__checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        />
        <span className="todo-item__title">{todo.title}</span>
      </label>

      <span className={`todo-item__category todo-item__category--${todo.category}`}>
        {todo.category}
      </span>

      <button
        className="todo-item__delete"
        onClick={handleDelete}
        aria-label={`Delete "${todo.title}"`}
      >
        Delete
      </button>
    </li>
  );
});

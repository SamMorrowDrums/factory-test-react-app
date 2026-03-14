import { useState } from 'react';
import type { Todo } from '../types/todo';
import './TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateNotes?: (id: string, notes: string) => void;
  isDragging?: boolean;
  isDragOver?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLLIElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLLIElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLLIElement>) => void;
  onDragEnd?: (e: React.DragEvent<HTMLLIElement>) => void;
}

export function TodoItem({
  todo,
  onToggle,
  onDelete,
  onUpdateNotes,
  isDragging = false,
  isDragOver = false,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: TodoItemProps) {
  const [expanded, setExpanded] = useState(false);

  const classNames = [
    'todo-item',
    todo.completed ? 'todo-item--completed' : '',
    isDragging ? 'todo-item--dragging' : '',
    isDragOver ? 'todo-item--drag-over' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const hasNotes = Boolean(todo.notes?.trim());

  return (
    <li
      className={classNames}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      <div className="todo-item__row">
        <span className="todo-item__drag-handle" aria-label="Drag to reorder">
          ⠿
        </span>

        <label className="todo-item__label">
          <input
            type="checkbox"
            className="todo-item__checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
          />
          <span className="todo-item__title">{todo.title}</span>
        </label>

        <button
          className={`todo-item__expand ${expanded ? 'todo-item__expand--open' : ''} ${hasNotes ? 'todo-item__expand--has-notes' : ''}`}
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label={`${expanded ? 'Collapse' : 'Expand'} notes for "${todo.title}"`}
        >
          {expanded ? '▾' : '▸'}
        </button>

        <span className={`todo-item__category todo-item__category--${todo.category}`}>
          {todo.category}
        </span>

        <button
          className="todo-item__delete"
          onClick={() => onDelete(todo.id)}
          aria-label={`Delete "${todo.title}"`}
        >
          Delete
        </button>
      </div>

      {expanded && (
        <div className="todo-item__notes">
          <textarea
            className="todo-item__notes-input"
            placeholder="Add notes…"
            value={todo.notes ?? ''}
            onChange={(e) => onUpdateNotes?.(todo.id, e.target.value)}
            rows={3}
            aria-label={`Notes for "${todo.title}"`}
          />
        </div>
      )}
    </li>
  );
}

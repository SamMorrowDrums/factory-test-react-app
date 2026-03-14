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

export function TodoItem({
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
  const classNames = [
    'todo-item',
    todo.completed ? 'todo-item--completed' : '',
    isDragging ? 'todo-item--dragging' : '',
    isDragOver ? 'todo-item--drag-over' : '',
  ]
    .filter(Boolean)
    .join(' ');

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
          onChange={() => onToggle(todo.id)}
          aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        />
        <span className="todo-item__title">{todo.title}</span>
      </label>

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
    </li>
  );
}

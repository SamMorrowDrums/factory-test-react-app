import type { Todo } from '../types/todo';
import './TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatDueDate(dueDate: string): string {
  const [year, month, day] = dueDate.split('-');
  return `${month}/${day}/${year}`;
}

function isDueOverdue(dueDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + 'T00:00:00');
  return due < today;
}

function isDueSoon(dueDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + 'T00:00:00');
  const diffMs = due.getTime() - today.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 2;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const dueDateClass = todo.dueDate && !todo.completed
    ? isDueOverdue(todo.dueDate)
      ? ' todo-item__due-date--overdue'
      : isDueSoon(todo.dueDate)
        ? ' todo-item__due-date--soon'
        : ''
    : '';

  return (
    <li className={`todo-item${todo.completed ? ' todo-item--completed' : ''}`}>
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

      <span className={`todo-item__priority todo-item__priority--${todo.priority}`}>
        {todo.priority}
      </span>

      <span className={`todo-item__category todo-item__category--${todo.category}`}>
        {todo.category}
      </span>

      {todo.dueDate && (
        <span className={`todo-item__due-date${dueDateClass}`}>
          {formatDueDate(todo.dueDate)}
        </span>
      )}

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

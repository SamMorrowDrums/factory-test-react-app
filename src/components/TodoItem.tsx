import type { Todo } from '../types/todo';
import './TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatDueDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function isOverdue(dueDate: number): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dueDate < today.getTime();
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const overdue = todo.dueDate !== null && !todo.completed && isOverdue(todo.dueDate);

  return (
    <li className={`todo-item${todo.completed ? ' todo-item--completed' : ''}${overdue ? ' todo-item--overdue' : ''}`}>
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

      {todo.dueDate !== null && (
        <span className={`todo-item__due-date${overdue ? ' todo-item__due-date--overdue' : ''}`}>
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

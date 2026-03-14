import type { Todo } from '../types/todo';
import { TagInput } from './TagInput';
import './TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAddTag?: (id: string, tag: string) => void;
  onRemoveTag?: (id: string, tag: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onAddTag, onRemoveTag }: TodoItemProps) {
  return (
    <li className={`todo-item${todo.completed ? ' todo-item--completed' : ''}`}>
      <div className="todo-item__row">
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
      </div>

      {(onAddTag || (todo.tags && todo.tags.length > 0)) && (
        <div className="todo-item__tags">
          <TagInput
            tags={todo.tags ?? []}
            onAddTag={(tag) => onAddTag?.(todo.id, tag)}
            onRemoveTag={(tag) => onRemoveTag?.(todo.id, tag)}
          />
        </div>
      )}
    </li>
  );
}

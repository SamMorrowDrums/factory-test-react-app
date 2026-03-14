import { useState } from 'react';
import type { Todo } from '../types/todo';
import './TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  subTasks?: Todo[];
  onAddSubTask?: (title: string, parentId: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, subTasks = [], onAddSubTask }: TodoItemProps) {
  const [showSubInput, setShowSubInput] = useState(false);
  const [subTitle, setSubTitle] = useState('');
  const isSubTask = todo.parentId != null;

  function handleSubSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = subTitle.trim();
    if (!trimmed || !onAddSubTask) return;
    onAddSubTask(trimmed, todo.id);
    setSubTitle('');
    setShowSubInput(false);
  }

  return (
    <li className={`todo-item${todo.completed ? ' todo-item--completed' : ''}${isSubTask ? ' todo-item--subtask' : ''}`}>
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

        {!isSubTask && onAddSubTask && (
          <button
            className="todo-item__add-subtask"
            onClick={() => setShowSubInput(!showSubInput)}
            aria-label={`Add sub-task to "${todo.title}"`}
          >
            +
          </button>
        )}

        <button
          className="todo-item__delete"
          onClick={() => onDelete(todo.id)}
          aria-label={`Delete "${todo.title}"`}
        >
          Delete
        </button>
      </div>

      {!isSubTask && showSubInput && (
        <form className="todo-item__sub-input" onSubmit={handleSubSubmit}>
          <input
            type="text"
            className="todo-item__sub-input-text"
            value={subTitle}
            onChange={(e) => setSubTitle(e.target.value)}
            placeholder="Add a sub-task…"
            aria-label="Sub-task title"
            autoFocus
          />
          <button type="submit" className="todo-item__sub-input-add">
            Add
          </button>
        </form>
      )}

      {subTasks.length > 0 && (
        <ul className="todo-item__subtasks" role="list" aria-label={`Sub-tasks of "${todo.title}"`}>
          {subTasks.map((sub) => (
            <TodoItem
              key={sub.id}
              todo={sub}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

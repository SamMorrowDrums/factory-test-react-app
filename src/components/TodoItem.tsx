import { memo, useState, useCallback, useRef, useEffect } from 'react';
import type { Todo, TodoCategory } from '../types/todo';
import './TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateNotes?: (id: string, notes: string) => void;
  onAddSubTodo?: (parentId: string, title: string, category: TodoCategory) => void;
  subTasks?: Todo[];
  depth?: number;
  searchQuery?: string;
  isFocused?: boolean;
  isDragging?: boolean;
  isDragOver?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLLIElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLLIElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLLIElement>) => void;
  onDragEnd?: (e: React.DragEvent<HTMLLIElement>) => void;
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  const trimmed = query.trim();
  if (!trimmed) return <>{text}</>;

  const regex = new RegExp(`(${trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="todo-item__highlight">{part}</mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

export const TodoItem = memo(function TodoItem({
  todo,
  onToggle,
  onDelete,
  onUpdateNotes,
  onAddSubTodo,
  subTasks = [],
  depth = 0,
  searchQuery = '',
  isFocused = false,
  isDragging = false,
  isDragOver = false,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: TodoItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState(todo.notes ?? '');
  const [showSubTaskInput, setShowSubTaskInput] = useState(false);
  const [subTaskTitle, setSubTaskTitle] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const subTaskInputRef = useRef<HTMLInputElement>(null);
  const itemRef = useRef<HTMLLIElement>(null);

  const hasNotes = Boolean(todo.notes);
  const hasSubTasks = subTasks.length > 0;
  const completedSubTasks = subTasks.filter((t) => t.completed).length;

  useEffect(() => {
    setNotesValue(todo.notes ?? '');
  }, [todo.notes]);

  useEffect(() => {
    if (editingNotes && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [editingNotes]);

  useEffect(() => {
    if (isFocused && itemRef.current) {
      itemRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [isFocused]);

  useEffect(() => {
    if (showSubTaskInput && subTaskInputRef.current) {
      subTaskInputRef.current.focus();
    }
  }, [showSubTaskInput]);

  const classNames = [
    'todo-item',
    todo.completed ? 'todo-item--completed' : '',
    isDragging ? 'todo-item--dragging' : '',
    isDragOver ? 'todo-item--drag-over' : '',
    isFocused ? 'todo-item--focused' : '',
    depth > 0 ? 'todo-item--nested' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const handleToggle = useCallback(() => onToggle(todo.id), [onToggle, todo.id]);
  const handleDelete = useCallback(() => onDelete(todo.id), [onDelete, todo.id]);

  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev);
    setEditingNotes(false);
  }, []);

  const startEditing = useCallback(() => {
    setEditingNotes(true);
    setExpanded(true);
  }, []);

  const saveNotes = useCallback(() => {
    onUpdateNotes?.(todo.id, notesValue.trim());
    setEditingNotes(false);
  }, [onUpdateNotes, todo.id, notesValue]);

  const cancelEditing = useCallback(() => {
    setNotesValue(todo.notes ?? '');
    setEditingNotes(false);
  }, [todo.notes]);

  const handleNotesChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotesValue(e.target.value);
  }, []);

  const handleNotesKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      cancelEditing();
    }
  }, [cancelEditing]);

  const toggleSubTaskInput = useCallback(() => {
    setShowSubTaskInput((prev) => !prev);
    setSubTaskTitle('');
  }, []);

  const handleSubTaskSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = subTaskTitle.trim();
    if (!trimmed || !onAddSubTodo) return;
    onAddSubTodo(todo.id, trimmed, todo.category);
    setSubTaskTitle('');
    setShowSubTaskInput(false);
  }, [subTaskTitle, onAddSubTodo, todo.id, todo.category]);

  const handleSubTaskTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSubTaskTitle(e.target.value);
  }, []);

  const handleSubTaskKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setShowSubTaskInput(false);
      setSubTaskTitle('');
    }
  }, []);

  const indentStyle = depth > 0 ? { marginLeft: `${depth * 1.5}rem` } : undefined;

  return (
    <li
      ref={itemRef}
      className={classNames}
      style={indentStyle}
      draggable={depth === 0}
      onDragStart={depth === 0 ? onDragStart : undefined}
      onDragOver={depth === 0 ? onDragOver : undefined}
      onDrop={depth === 0 ? onDrop : undefined}
      onDragEnd={depth === 0 ? onDragEnd : undefined}
    >
      <div className="todo-item__main">
        {depth === 0 && (
          <span className="todo-item__drag-handle" aria-label="Drag to reorder">
            ⠿
          </span>
        )}
        {depth > 0 && (
          <span className="todo-item__nest-indicator" aria-hidden="true">└</span>
        )}

        <label className="todo-item__label">
          <input
            type="checkbox"
            className="todo-item__checkbox"
            checked={todo.completed}
            onChange={handleToggle}
            aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
          />
          <span className="todo-item__title">
            <HighlightedText text={todo.title} query={searchQuery} />
          </span>
        </label>

        <span className={`todo-item__category todo-item__category--${todo.category}`}>
          {todo.category}
        </span>

        {hasSubTasks && (
          <span className="todo-item__subtask-count" aria-label={`${completedSubTasks} of ${subTasks.length} sub-tasks done`}>
            {completedSubTasks}/{subTasks.length}
          </span>
        )}

        <button
          className={`todo-item__expand ${hasNotes ? 'todo-item__expand--has-notes' : ''} ${expanded ? 'todo-item__expand--open' : ''}`}
          onClick={hasNotes ? toggleExpanded : startEditing}
          aria-label={hasNotes ? (expanded ? 'Collapse notes' : 'Expand notes') : 'Add notes'}
          aria-expanded={expanded}
        >
          {hasNotes ? (expanded ? '▾' : '▸') : '+'}
        </button>

        {depth === 0 && onAddSubTodo && (
          <button
            className={`todo-item__add-subtask ${showSubTaskInput ? 'todo-item__add-subtask--active' : ''}`}
            onClick={toggleSubTaskInput}
            aria-label="Add sub-task"
            title="Add sub-task"
          >
            ⊕
          </button>
        )}

        <button
          className="todo-item__delete"
          onClick={handleDelete}
          aria-label={`Delete "${todo.title}"`}
        >
          Delete
        </button>
      </div>

      {expanded && (
        <div className="todo-item__notes">
          {editingNotes ? (
            <div className="todo-item__notes-editor">
              <textarea
                ref={textareaRef}
                className="todo-item__notes-textarea"
                value={notesValue}
                onChange={handleNotesChange}
                onKeyDown={handleNotesKeyDown}
                placeholder="Add notes or description…"
                aria-label="Edit notes"
                rows={3}
              />
              <div className="todo-item__notes-actions">
                <button
                  className="todo-item__notes-save"
                  onClick={saveNotes}
                  aria-label="Save notes"
                >
                  Save
                </button>
                <button
                  className="todo-item__notes-cancel"
                  onClick={cancelEditing}
                  aria-label="Cancel editing"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              className="todo-item__notes-content"
              onClick={startEditing}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') startEditing(); }}
              aria-label="Click to edit notes"
            >
              {todo.notes || 'Click to add notes…'}
            </div>
          )}
        </div>
      )}

      {showSubTaskInput && (
        <form className="todo-item__subtask-form" onSubmit={handleSubTaskSubmit}>
          <input
            ref={subTaskInputRef}
            className="todo-item__subtask-input"
            type="text"
            value={subTaskTitle}
            onChange={handleSubTaskTitleChange}
            onKeyDown={handleSubTaskKeyDown}
            placeholder="Add a sub-task…"
            aria-label="Sub-task title"
          />
          <button className="todo-item__subtask-submit" type="submit">
            Add
          </button>
        </form>
      )}

      {hasSubTasks && (
        <ul className="todo-item__subtasks">
          {subTasks.map((sub) => (
            <TodoItem
              key={sub.id}
              todo={sub}
              onToggle={onToggle}
              onDelete={onDelete}
              onUpdateNotes={onUpdateNotes}
              searchQuery={searchQuery}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
});

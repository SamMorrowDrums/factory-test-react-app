import { memo, useState, useCallback, useRef, useEffect } from 'react';
import type { Todo } from '../types/todo';
import './TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateNotes?: (id: string, notes: string) => void;
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const itemRef = useRef<HTMLLIElement>(null);

  const hasNotes = Boolean(todo.notes);

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

  const classNames = [
    'todo-item',
    todo.completed ? 'todo-item--completed' : '',
    isDragging ? 'todo-item--dragging' : '',
    isDragOver ? 'todo-item--drag-over' : '',
    isFocused ? 'todo-item--focused' : '',
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

  return (
    <li
      ref={itemRef}
      className={classNames}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      <div className="todo-item__main">
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
          <span className="todo-item__title">
            <HighlightedText text={todo.title} query={searchQuery} />
          </span>
        </label>

        <span className={`todo-item__category todo-item__category--${todo.category}`}>
          {todo.category}
        </span>

        <button
          className={`todo-item__expand ${hasNotes ? 'todo-item__expand--has-notes' : ''} ${expanded ? 'todo-item__expand--open' : ''}`}
          onClick={hasNotes ? toggleExpanded : startEditing}
          aria-label={hasNotes ? (expanded ? 'Collapse notes' : 'Expand notes') : 'Add notes'}
          aria-expanded={expanded}
        >
          {hasNotes ? (expanded ? '▾' : '▸') : '+'}
        </button>

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
    </li>
  );
});

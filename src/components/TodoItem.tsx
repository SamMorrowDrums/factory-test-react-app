import { memo, useState, useCallback, useRef, useEffect } from 'react';
import type { Todo } from '../types/todo';
import { CyberToggle } from './CyberToggle';
import { CyberButton } from './CyberButton';
import './TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateNotes?: (id: string, notes: string) => void;
  onAddSubtask?: (parentId: string, title: string) => void;
  subtasks?: Todo[];
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
  onAddSubtask,
  subtasks = [],
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
  const [subtasksExpanded, setSubtasksExpanded] = useState(true);
  const [addingSubtask, setAddingSubtask] = useState(false);
  const [subtaskTitle, setSubtaskTitle] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const subtaskInputRef = useRef<HTMLInputElement>(null);
  const itemRef = useRef<HTMLLIElement>(null);

  const hasNotes = Boolean(todo.notes);
  const hasSubtasks = subtasks.length > 0;
  const completedSubtasks = subtasks.filter((s) => s.completed).length;
  const isSubtask = Boolean(todo.parentId);

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

  const [exiting, setExiting] = useState(false);

  const classNames = [
    'todo-item',
    todo.completed ? 'todo-item--completed' : '',
    exiting ? 'todo-item--exiting' : '',
    isDragging ? 'todo-item--dragging' : '',
    isDragOver ? 'todo-item--drag-over' : '',
    isFocused ? 'todo-item--focused' : '',
    isSubtask ? 'todo-item--subtask' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const handleToggle = useCallback(() => onToggle(todo.id), [onToggle, todo.id]);
  const handleDelete = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => onDelete(todo.id), 200);
  }, [exiting, onDelete, todo.id]);

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

  const toggleSubtasks = useCallback(() => {
    setSubtasksExpanded((prev) => !prev);
  }, []);

  const startAddingSubtask = useCallback(() => {
    setAddingSubtask(true);
    setSubtasksExpanded(true);
  }, []);

  const handleSubtaskSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = subtaskTitle.trim();
    if (!trimmed || !onAddSubtask) return;
    onAddSubtask(todo.id, trimmed);
    setSubtaskTitle('');
  }, [subtaskTitle, onAddSubtask, todo.id]);

  const handleSubtaskKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setAddingSubtask(false);
      setSubtaskTitle('');
    }
  }, []);

  useEffect(() => {
    if (addingSubtask && subtaskInputRef.current) {
      subtaskInputRef.current.focus();
    }
  }, [addingSubtask]);

  return (
    <li
      ref={itemRef}
      className={classNames}
      draggable={!isSubtask}
      onDragStart={isSubtask ? undefined : onDragStart}
      onDragOver={isSubtask ? undefined : onDragOver}
      onDrop={isSubtask ? undefined : onDrop}
      onDragEnd={isSubtask ? undefined : onDragEnd}
    >
      <div className="todo-item__main">
        {!isSubtask && (
          <span className="todo-item__drag-handle" aria-label="Drag to reorder">
            ⠿
          </span>
        )}

        <span className="todo-item__label">
          <CyberToggle
            checked={todo.completed}
            onChange={handleToggle}
            aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
          />
          <span className="todo-item__title" onClick={handleToggle} role="button" tabIndex={-1}>
            <HighlightedText text={todo.title} query={searchQuery} />
          </span>
        </span>

        {hasSubtasks && (
          <span className="todo-item__subtask-count" aria-label="Subtask progress">
            {completedSubtasks}/{subtasks.length}
          </span>
        )}

        <span className={`todo-item__category todo-item__category--${todo.category}`}>
          {todo.category}
        </span>

        <span className={`todo-item__priority todo-item__priority--${todo.priority}`}>
          {todo.priority === 'high' ? '⚡' : todo.priority === 'medium' ? '●' : '○'} {todo.priority}
        </span>

        {todo.dueDate && (
          <span className={`todo-item__due-date${todo.dueDate < Date.now() && !todo.completed ? ' todo-item__due-date--overdue' : ''}`}>
            📅 {new Date(todo.dueDate).toLocaleDateString()}
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

        {!isSubtask && onAddSubtask && (
          <CyberButton
            variant="secondary"
            size="sm"
            onClick={hasSubtasks ? toggleSubtasks : startAddingSubtask}
            aria-label={hasSubtasks ? (subtasksExpanded ? 'Collapse subtasks' : 'Expand subtasks') : 'Add subtask'}
            aria-expanded={hasSubtasks ? subtasksExpanded : undefined}
          >
            {hasSubtasks ? `◆ ${subtasksExpanded ? '▾' : '▸'}` : '◆+'}
          </CyberButton>
        )}

        <CyberButton
          variant="danger"
          size="sm"
          onClick={handleDelete}
          aria-label={`Delete "${todo.title}"`}
        >
          Delete
        </CyberButton>
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
                <CyberButton
                  variant="primary"
                  size="sm"
                  onClick={saveNotes}
                  aria-label="Save notes"
                >
                  Save
                </CyberButton>
                <CyberButton
                  variant="secondary"
                  size="sm"
                  onClick={cancelEditing}
                  aria-label="Cancel editing"
                >
                  Cancel
                </CyberButton>
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

      {!isSubtask && subtasksExpanded && (hasSubtasks || addingSubtask) && (
        <div className="todo-item__subtasks">
          <ul className="todo-item__subtask-list">
            {subtasks.map((subtask) => (
              <TodoItem
                key={subtask.id}
                todo={subtask}
                onToggle={onToggle}
                onDelete={onDelete}
                onUpdateNotes={onUpdateNotes}
                searchQuery={searchQuery}
              />
            ))}
          </ul>

          {addingSubtask ? (
            <form className="todo-item__subtask-form" onSubmit={handleSubtaskSubmit}>
              <input
                ref={subtaskInputRef}
                className="todo-item__subtask-input"
                type="text"
                value={subtaskTitle}
                onChange={(e) => setSubtaskTitle(e.target.value)}
                onKeyDown={handleSubtaskKeyDown}
                placeholder="Add a subtask…"
                aria-label="Subtask title"
              />
              <CyberButton variant="primary" size="sm" type="submit">
                Add
              </CyberButton>
              <CyberButton
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => { setAddingSubtask(false); setSubtaskTitle(''); }}
              >
                Cancel
              </CyberButton>
            </form>
          ) : (
            <button
              className="todo-item__add-subtask"
              onClick={startAddingSubtask}
              aria-label="Add subtask"
            >
              + Add subtask
            </button>
          )}
        </div>
      )}
    </li>
  );
});

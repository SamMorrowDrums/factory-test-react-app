import { useState, useRef, useCallback, useMemo } from 'react';
import { type Todo, type TodoCategory, type TodoFilter as TodoFilterType } from '../types/todo';
import { useTodos } from '../hooks/useTodos';
import { TodoFilter } from './TodoFilter';
import { SearchBar } from './SearchBar';
import { TodoItem } from './TodoItem';
import './TodoList.css';

interface TodoListProps {
  todos?: Todo[];
  toggleTodo?: (id: string) => void;
  deleteTodo?: (id: string) => void;
  updateNotes?: (id: string, notes: string) => void;
  updateTags?: (id: string, tags: string[]) => void;
  clearCompleted?: () => void;
  reorderTodos?: (draggedId: string, targetId: string) => void;
  focusedTodoId?: string | null;
  filter?: TodoFilterType;
  categoryFilter?: TodoCategory | 'all';
  tagFilter?: string | null;
  onFilterChange?: (filter: TodoFilterType) => void;
  onCategoryChange?: (category: TodoCategory | 'all') => void;
  onTagFilterChange?: (tag: string | null) => void;
}

export function TodoList(props: TodoListProps) {
  const internal = useTodos();
  const todos = props.todos ?? internal.todos;
  const toggleTodo = props.toggleTodo ?? internal.toggleTodo;
  const deleteTodo = props.deleteTodo ?? internal.deleteTodo;
  const updateNotes = props.updateNotes ?? internal.updateNotes;
  const updateTags = props.updateTags ?? internal.updateTags;
  const clearCompleted = props.clearCompleted ?? internal.clearCompleted;
  const reorderTodos = props.reorderTodos ?? internal.reorderTodos;

  const [internalFilter, setInternalFilter] = useState<TodoFilterType>('all');
  const [internalCategoryFilter, setInternalCategoryFilter] = useState<TodoCategory | 'all'>('all');
  const [internalTagFilter, setInternalTagFilter] = useState<string | null>(null);

  const filter = props.filter ?? internalFilter;
  const categoryFilter = props.categoryFilter ?? internalCategoryFilter;
  const tagFilter = props.tagFilter ?? internalTagFilter;
  const onFilterChange = props.onFilterChange ?? setInternalFilter;
  const onCategoryChange = props.onCategoryChange ?? setInternalCategoryFilter;
  const onTagFilterChange = props.onTagFilterChange ?? setInternalTagFilter;

  const [searchQuery, setSearchQuery] = useState('');
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const draggedIdRef = useRef<string | null>(null);

  const filteredTodos = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return todos.filter((todo) => {
      if (filter === 'active' && todo.completed) return false;
      if (filter === 'completed' && !todo.completed) return false;
      if (categoryFilter !== 'all' && todo.category !== categoryFilter) return false;
      if (tagFilter && !(todo.tags ?? []).includes(tagFilter)) return false;
      if (query) {
        const titleMatch = todo.title.toLowerCase().includes(query);
        const notesMatch = todo.notes?.toLowerCase().includes(query);
        const tagsMatch = (todo.tags ?? []).some((tag) => tag.toLowerCase().includes(query));
        if (!titleMatch && !notesMatch && !tagsMatch) return false;
      }
      return true;
    });
  }, [todos, filter, categoryFilter, tagFilter, searchQuery]);

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    todos.forEach((todo) => {
      (todo.tags ?? []).forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [todos]);

  const activeCount = useMemo(() => todos.filter((todo) => !todo.completed).length, [todos]);
  const hasCompleted = useMemo(() => todos.some((todo) => todo.completed), [todos]);

  const handleDragStart = useCallback((todoId: string) => (e: React.DragEvent<HTMLLIElement>) => {
    draggedIdRef.current = todoId;
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((todoId: string) => (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedIdRef.current && draggedIdRef.current !== todoId) {
      setDragOverId(todoId);
    }
  }, []);

  const handleDrop = useCallback((todoId: string) => (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
    if (draggedIdRef.current && draggedIdRef.current !== todoId) {
      reorderTodos(draggedIdRef.current, todoId);
    }
    draggedIdRef.current = null;
    setDragOverId(null);
  }, [reorderTodos]);

  const handleDragEnd = useCallback(() => {
    draggedIdRef.current = null;
    setDragOverId(null);
  }, []);

  return (
    <div className="todo-list">
      <TodoFilter
        currentFilter={filter}
        currentCategory={categoryFilter}
        onFilterChange={onFilterChange}
        onCategoryChange={onCategoryChange}
        availableTags={availableTags}
        selectedTag={tagFilter}
        onTagFilterChange={onTagFilterChange}
      />

      <SearchBar query={searchQuery} onChange={setSearchQuery} />

      <ul className="todo-list__items">
        {filteredTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onUpdateNotes={updateNotes}
            onUpdateTags={updateTags}
            searchQuery={searchQuery}
            isFocused={props.focusedTodoId === todo.id}
            isDragging={draggedIdRef.current === todo.id}
            isDragOver={dragOverId === todo.id}
            onDragStart={handleDragStart(todo.id)}
            onDragOver={handleDragOver(todo.id)}
            onDrop={handleDrop(todo.id)}
            onDragEnd={handleDragEnd}
          />
        ))}
      </ul>

      <div className="todo-list__footer">
        <span className="todo-list__count">
          {activeCount} {activeCount === 1 ? 'item' : 'items'} left
        </span>

        {hasCompleted && (
          <button
            className="todo-list__clear-completed"
            onClick={clearCompleted}
          >
            Clear completed
          </button>
        )}
      </div>
    </div>
  );
}

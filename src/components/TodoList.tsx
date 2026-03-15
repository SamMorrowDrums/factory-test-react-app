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
  addSubTodo?: (parentId: string, title: string, category: TodoCategory) => void;
  clearCompleted?: () => void;
  reorderTodos?: (draggedId: string, targetId: string) => void;
  focusedTodoId?: string | null;
  filter?: TodoFilterType;
  categoryFilter?: TodoCategory | 'all';
  onFilterChange?: (filter: TodoFilterType) => void;
  onCategoryChange?: (category: TodoCategory | 'all') => void;
}

export function TodoList(props: TodoListProps) {
  const internal = useTodos();
  const todos = props.todos ?? internal.todos;
  const toggleTodo = props.toggleTodo ?? internal.toggleTodo;
  const deleteTodo = props.deleteTodo ?? internal.deleteTodo;
  const updateNotes = props.updateNotes ?? internal.updateNotes;
  const addSubTodo = props.addSubTodo ?? internal.addSubTodo;
  const clearCompleted = props.clearCompleted ?? internal.clearCompleted;
  const reorderTodos = props.reorderTodos ?? internal.reorderTodos;

  const [internalFilter, setInternalFilter] = useState<TodoFilterType>('all');
  const [internalCategoryFilter, setInternalCategoryFilter] = useState<TodoCategory | 'all'>('all');

  const filter = props.filter ?? internalFilter;
  const categoryFilter = props.categoryFilter ?? internalCategoryFilter;
  const onFilterChange = props.onFilterChange ?? setInternalFilter;
  const onCategoryChange = props.onCategoryChange ?? setInternalCategoryFilter;

  const [searchQuery, setSearchQuery] = useState('');
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const draggedIdRef = useRef<string | null>(null);

  const filteredTodos = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    // First pass: determine which todos match filters
    const matchesFilter = (todo: Todo) => {
      if (filter === 'active' && todo.completed) return false;
      if (filter === 'completed' && !todo.completed) return false;
      if (categoryFilter !== 'all' && todo.category !== categoryFilter) return false;
      if (query && !todo.title.toLowerCase().includes(query) && !(todo.notes?.toLowerCase().includes(query))) return false;
      return true;
    };

    // Only filter top-level todos; children are handled by TodoItem
    const topLevel = todos.filter((t) => !t.parentId);
    const childrenMap = new Map<string, Todo[]>();
    for (const t of todos) {
      if (t.parentId) {
        const siblings = childrenMap.get(t.parentId) ?? [];
        siblings.push(t);
        childrenMap.set(t.parentId, siblings);
      }
    }

    // A parent is visible if it matches OR any of its children match
    return topLevel.filter((parent) => {
      const children = childrenMap.get(parent.id) ?? [];
      const parentMatches = matchesFilter(parent);
      const anyChildMatches = children.some(matchesFilter);
      return parentMatches || anyChildMatches;
    });
  }, [todos, filter, categoryFilter, searchQuery]);

  // Build a map of children for each parent (for rendering)
  const childrenMap = useMemo(() => {
    const map = new Map<string, Todo[]>();
    for (const t of todos) {
      if (t.parentId) {
        const siblings = map.get(t.parentId) ?? [];
        siblings.push(t);
        map.set(t.parentId, siblings);
      }
    }
    return map;
  }, [todos]);

  const activeCount = useMemo(() => todos.filter((todo) => !todo.completed && !todo.parentId).length, [todos]);
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
            onAddSubTodo={addSubTodo}
            subTasks={childrenMap.get(todo.id) ?? []}
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

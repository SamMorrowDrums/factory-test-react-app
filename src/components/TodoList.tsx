import { useState, useRef, useCallback, useMemo } from 'react';
import { type Todo, type TodoCategory, type TodoPriority, type TodoFilter as TodoFilterType } from '../types/todo';
import { useTodos } from '../hooks/useTodos';
import { TodoFilter } from './TodoFilter';
import { SearchBar } from './SearchBar';
import { TodoItem } from './TodoItem';
import { CyberProgress } from './CyberProgress';
import { CyberButton } from './CyberButton';
import './TodoList.css';

interface TodoListProps {
  todos?: Todo[];
  toggleTodo?: (id: string) => void;
  deleteTodo?: (id: string) => void;
  updateNotes?: (id: string, notes: string) => void;
  clearCompleted?: () => void;
  reorderTodos?: (draggedId: string, targetId: string) => void;
  focusedTodoId?: string | null;
  filter?: TodoFilterType;
  categoryFilter?: TodoCategory | 'all';
  priorityFilter?: TodoPriority | 'all';
  onFilterChange?: (filter: TodoFilterType) => void;
  onCategoryChange?: (category: TodoCategory | 'all') => void;
  onPriorityChange?: (priority: TodoPriority | 'all') => void;
}

export function TodoList(props: TodoListProps) {
  const internal = useTodos();
  const todos = props.todos ?? internal.todos;
  const toggleTodo = props.toggleTodo ?? internal.toggleTodo;
  const deleteTodo = props.deleteTodo ?? internal.deleteTodo;
  const updateNotes = props.updateNotes ?? internal.updateNotes;
  const clearCompleted = props.clearCompleted ?? internal.clearCompleted;
  const reorderTodos = props.reorderTodos ?? internal.reorderTodos;

  const [internalFilter, setInternalFilter] = useState<TodoFilterType>('all');
  const [internalCategoryFilter, setInternalCategoryFilter] = useState<TodoCategory | 'all'>('all');
  const [internalPriorityFilter, setInternalPriorityFilter] = useState<TodoPriority | 'all'>('all');

  const filter = props.filter ?? internalFilter;
  const categoryFilter = props.categoryFilter ?? internalCategoryFilter;
  const priorityFilter = props.priorityFilter ?? internalPriorityFilter;
  const onFilterChange = props.onFilterChange ?? setInternalFilter;
  const onCategoryChange = props.onCategoryChange ?? setInternalCategoryFilter;
  const onPriorityChange = props.onPriorityChange ?? setInternalPriorityFilter;

  const [searchQuery, setSearchQuery] = useState('');
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const draggedIdRef = useRef<string | null>(null);

  const filteredTodos = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return todos.filter((todo) => {
      if (filter === 'active' && todo.completed) return false;
      if (filter === 'completed' && !todo.completed) return false;
      if (categoryFilter !== 'all' && todo.category !== categoryFilter) return false;
      if (priorityFilter !== 'all' && todo.priority !== priorityFilter) return false;
      if (query && !todo.title.toLowerCase().includes(query) && !(todo.notes?.toLowerCase().includes(query))) return false;
      return true;
    });
  }, [todos, filter, categoryFilter, priorityFilter, searchQuery]);

  const activeCount = useMemo(() => todos.filter((todo) => !todo.completed).length, [todos]);
  const completedCount = useMemo(() => todos.filter((todo) => todo.completed).length, [todos]);
  const hasCompleted = completedCount > 0;

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
        currentPriority={priorityFilter}
        onFilterChange={onFilterChange}
        onCategoryChange={onCategoryChange}
        onPriorityChange={onPriorityChange}
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

        {todos.length > 0 && (
          <CyberProgress
            value={completedCount}
            max={todos.length}
            label="Completion progress"
          />
        )}

        {hasCompleted && (
          <CyberButton
            variant="secondary"
            size="sm"
            onClick={clearCompleted}
          >
            Clear completed
          </CyberButton>
        )}
      </div>
    </div>
  );
}

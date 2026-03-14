import { useState } from 'react';
import { type Todo, type TodoCategory, type TodoFilter as TodoFilterType } from '../types/todo';
import { useTodos } from '../hooks/useTodos';
import { TodoFilter } from './TodoFilter';
import { TodoItem } from './TodoItem';
import { SearchInput } from './SearchInput';
import './TodoList.css';

interface TodoListProps {
  todos?: Todo[];
  toggleTodo?: (id: string) => void;
  deleteTodo?: (id: string) => void;
  clearCompleted?: () => void;
}

export function TodoList(props: TodoListProps) {
  const internal = useTodos();
  const todos = props.todos ?? internal.todos;
  const toggleTodo = props.toggleTodo ?? internal.toggleTodo;
  const deleteTodo = props.deleteTodo ?? internal.deleteTodo;
  const clearCompleted = props.clearCompleted ?? internal.clearCompleted;
  const [filter, setFilter] = useState<TodoFilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState<TodoCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active' && todo.completed) return false;
    if (filter === 'completed' && !todo.completed) return false;
    if (categoryFilter !== 'all' && todo.category !== categoryFilter) return false;
    if (searchQuery.trim() && !todo.title.toLowerCase().includes(searchQuery.trim().toLowerCase())) return false;
    return true;
  });

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const hasCompleted = todos.some((todo) => todo.completed);

  return (
    <div className="todo-list">
      <SearchInput query={searchQuery} onChange={setSearchQuery} />

      <TodoFilter
        currentFilter={filter}
        currentCategory={categoryFilter}
        onFilterChange={setFilter}
        onCategoryChange={setCategoryFilter}
      />

      <ul className="todo-list__items">
        {filteredTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            searchQuery={searchQuery}
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

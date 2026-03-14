import { useState } from 'react';
import { type Todo, type TodoCategory, type TodoFilter as TodoFilterType } from '../types/todo';
import { useTodos } from '../hooks/useTodos';
import { TodoFilter } from './TodoFilter';
import { TodoItem } from './TodoItem';
import './TodoList.css';

interface TodoListProps {
  todos?: Todo[];
  toggleTodo?: (id: string) => void;
  deleteTodo?: (id: string) => void;
  clearCompleted?: () => void;
  addTodo?: (title: string, category: TodoCategory, parentId?: string) => void;
}

export function TodoList(props: TodoListProps) {
  const internal = useTodos();
  const todos = props.todos ?? internal.todos;
  const toggleTodo = props.toggleTodo ?? internal.toggleTodo;
  const deleteTodo = props.deleteTodo ?? internal.deleteTodo;
  const clearCompleted = props.clearCompleted ?? internal.clearCompleted;
  const addTodo = props.addTodo ?? internal.addTodo;
  const [filter, setFilter] = useState<TodoFilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState<TodoCategory | 'all'>('all');

  const topLevelTodos = todos.filter((todo) => todo.parentId == null);

  const filteredTodos = topLevelTodos.filter((todo) => {
    if (filter === 'active' && todo.completed) return false;
    if (filter === 'completed' && !todo.completed) return false;
    if (categoryFilter !== 'all' && todo.category !== categoryFilter) return false;
    return true;
  });

  const getSubTasks = (parentId: string) =>
    todos.filter((todo) => todo.parentId === parentId);

  const handleAddSubTask = (title: string, parentId: string) => {
    const parent = todos.find((t) => t.id === parentId);
    if (!parent) return;
    addTodo(title, parent.category, parentId);
  };

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const hasCompleted = todos.some((todo) => todo.completed);

  return (
    <div className="todo-list">
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
            subTasks={getSubTasks(todo.id)}
            onAddSubTask={handleAddSubTask}
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

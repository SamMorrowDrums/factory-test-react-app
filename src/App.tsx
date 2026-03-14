import { useTodos } from './hooks/useTodos';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { GlitchText } from './components/GlitchText';
import type { TodoCategory, TodoPriority } from './types/todo';
import './App.css';

function App() {
  const { todos, addTodo, toggleTodo, deleteTodo, clearCompleted } = useTodos();

  const handleAdd = (title: string, category: TodoCategory, priority: TodoPriority, dueDate: number | null) => {
    addTodo(title, category, priority, dueDate);
  };

  return (
    <div className="app">
      <header className="app__header">
        <GlitchText as="h1" className="app__title">GLITCH_DO</GlitchText>
      </header>

      <main className="app__main">
        <TodoInput onAdd={handleAdd} />
        <TodoList
          todos={todos}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          clearCompleted={clearCompleted}
        />
      </main>
    </div>
  );
}

export default App;

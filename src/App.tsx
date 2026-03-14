import { useTodos } from './hooks/useTodos';
import { useTheme } from './hooks/useTheme';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { GlitchText } from './components/GlitchText';
import { ThemeToggle } from './components/ThemeToggle';
import './App.css';

function App() {
  const { todos, addTodo, toggleTodo, deleteTodo, clearCompleted, reorderTodos } = useTodos();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app">
      <header className="app__header">
        <GlitchText as="h1" className="app__title">GLITCH_DO</GlitchText>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>

      <main className="app__main">
        <TodoInput onAdd={addTodo} />
        <TodoList
          todos={todos}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          clearCompleted={clearCompleted}
          reorderTodos={reorderTodos}
        />
      </main>
    </div>
  );
}

export default App;

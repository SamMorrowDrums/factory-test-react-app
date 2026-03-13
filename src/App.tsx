import { useTodos } from './hooks/useTodos';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { ThemeToggle } from './components/ThemeToggle';
import './App.css';

function App() {
  const { todos, addTodo, toggleTodo, deleteTodo, clearCompleted } = useTodos();

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Todo App</h1>
        <ThemeToggle />
      </header>

      <main className="app__main">
        <TodoInput onAdd={addTodo} />
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

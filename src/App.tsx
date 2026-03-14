import { useTodos } from './hooks/useTodos';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { GlitchText } from './components/GlitchText';
import './App.css';

function App() {
  const { todos, addTodo, toggleTodo, deleteTodo, clearCompleted, reorderTodos } = useTodos();

  return (
    <div className="app">
      <header className="app__header">
        <GlitchText as="h1" className="app__title">GLITCH_DO</GlitchText>
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

import { useEffect, useCallback } from 'react';
import { useTodos } from './hooks/useTodos';
import { useToast } from './hooks/useToast';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { GlitchText } from './components/GlitchText';
import { ToastContainer } from './components/Toast';
import './App.css';

function App() {
  const {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    reorderTodos,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useTodos();
  const { toasts, showToast, dismissToast } = useToast();

  const handleUndo = useCallback(() => {
    const desc = undo();
    if (desc) showToast(desc);
  }, [undo, showToast]);

  const handleRedo = useCallback(() => {
    const desc = redo();
    if (desc) showToast(desc);
  }, [redo, showToast]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  return (
    <div className="app">
      <header className="app__header">
        <GlitchText as="h1" className="app__title">GLITCH_DO</GlitchText>
      </header>

      <main className="app__main">
        <div className="app__toolbar">
          <button
            className="app__undo-btn"
            onClick={handleUndo}
            disabled={!canUndo()}
            aria-label="Undo"
          >
            ↩ Undo
          </button>
          <button
            className="app__redo-btn"
            onClick={handleRedo}
            disabled={!canRedo()}
            aria-label="Redo"
          >
            Redo ↪
          </button>
        </div>
        <TodoInput onAdd={addTodo} />
        <TodoList
          todos={todos}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          clearCompleted={clearCompleted}
          reorderTodos={reorderTodos}
        />
      </main>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;

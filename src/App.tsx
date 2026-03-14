import { useEffect, useCallback } from 'react';
import { useTodos } from './hooks/useTodos';
import { useToast } from './hooks/useToast';
import { useTheme } from './hooks/useTheme';
import { useInstallPrompt } from './hooks/useInstallPrompt';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { GlitchText } from './components/GlitchText';
import { ThemeToggle } from './components/ThemeToggle';
import { ToastContainer } from './components/Toast';
import { DataTransfer } from './components/DataTransfer';
import { InstallBanner } from './components/InstallBanner';
import './App.css';

function App() {
  const {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    reorderTodos,
    importTodos,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useTodos();
  const { toasts, showToast, dismissToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const { showPrompt, install, dismiss } = useInstallPrompt();

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
        <div className="app__header-row">
          <GlitchText as="h1" className="app__title">GLITCH_DO</GlitchText>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </header>

      <main className="app__main">
        <div className="app__toolbar">
          <div className="app__toolbar-left">
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
          <DataTransfer
            todos={todos}
            onImport={importTodos}
            onError={showToast}
            onSuccess={showToast}
          />
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
      {showPrompt && <InstallBanner onInstall={install} onDismiss={dismiss} />}
    </div>
  );
}

export default App;

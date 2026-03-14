import { useEffect, useCallback } from 'react';
import { useTodos } from './hooks/useTodos';
import { useToast } from './hooks/useToast';
import { useSoundEffects } from './hooks/useSoundEffects';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { GlitchText } from './components/GlitchText';
import { ToastContainer } from './components/Toast';
import { DataTransfer } from './components/DataTransfer';
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
  const { playSound, muted, toggleMute } = useSoundEffects();

  const handleAddTodo = useCallback((title: string, category: Parameters<typeof addTodo>[1]) => {
    addTodo(title, category);
    playSound('addTodo');
  }, [addTodo, playSound]);

  const handleToggleTodo = useCallback((id: string) => {
    toggleTodo(id);
    playSound('completeTodo');
  }, [toggleTodo, playSound]);

  const handleDeleteTodo = useCallback((id: string) => {
    deleteTodo(id);
    playSound('deleteTodo');
  }, [deleteTodo, playSound]);

  const handleClearCompleted = useCallback(() => {
    clearCompleted();
    playSound('deleteTodo');
  }, [clearCompleted, playSound]);

  const handleUndo = useCallback(() => {
    const desc = undo();
    if (desc) {
      showToast(desc);
      playSound('undo');
    }
  }, [undo, showToast, playSound]);

  const handleRedo = useCallback(() => {
    const desc = redo();
    if (desc) {
      showToast(desc);
      playSound('redo');
    }
  }, [redo, showToast, playSound]);

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
            <button
              className="app__mute-btn"
              onClick={toggleMute}
              aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
              title={muted ? 'Unmute' : 'Mute'}
            >
              {muted ? '🔇' : '🔊'}
            </button>
          </div>
          <DataTransfer
            todos={todos}
            onImport={importTodos}
            onError={showToast}
            onSuccess={showToast}
          />
        </div>
        <TodoInput onAdd={handleAddTodo} />
        <TodoList
          todos={todos}
          toggleTodo={handleToggleTodo}
          deleteTodo={handleDeleteTodo}
          clearCompleted={handleClearCompleted}
          reorderTodos={reorderTodos}
        />
      </main>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;

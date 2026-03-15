import { useEffect, useCallback, useState, useMemo, useRef } from 'react';
import { useTodos } from './hooks/useTodos';
import { useToast } from './hooks/useToast';
import { useInstallPrompt } from './hooks/useInstallPrompt';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { GlitchText } from './components/GlitchText';
import { ToastContainer } from './components/Toast';
import { DataTransfer } from './components/DataTransfer';
import { InstallBanner } from './components/InstallBanner';
import { KeyboardShortcutsHelp } from './components/KeyboardShortcutsHelp';
import { CyberButton } from './components/CyberButton';
import type { TodoFilter, TodoCategory, TodoPriority } from './types/todo';
import './App.css';

function App() {
  const {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateNotes,
    clearCompleted,
    reorderTodos,
    importTodos,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useTodos();
  const { toasts, showToast, dismissToast } = useToast();
  const { showPrompt, install, dismiss } = useInstallPrompt();
  const { showHelp, toggleHelp, closeHelp, shortcuts } = useKeyboardShortcuts();

  const [filter, setFilter] = useState<TodoFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<TodoCategory | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TodoPriority | 'all'>('all');
  const [focusedTodoId, setFocusedTodoId] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const filteredTodos = useMemo(() => todos.filter((todo) => {
    if (filter === 'active' && todo.completed) return false;
    if (filter === 'completed' && !todo.completed) return false;
    if (categoryFilter !== 'all' && todo.category !== categoryFilter) return false;
    if (priorityFilter !== 'all' && todo.priority !== priorityFilter) return false;
    return true;
  }), [todos, filter, categoryFilter, priorityFilter]);

  const handleUndo = useCallback(() => {
    const desc = undo();
    if (desc) showToast(desc);
  }, [undo, showToast]);

  const handleRedo = useCallback(() => {
    const desc = redo();
    if (desc) showToast(desc);
  }, [redo, showToast]);

  // Clear focus when focused todo is removed or filtered out
  useEffect(() => {
    if (focusedTodoId && !filteredTodos.some((t) => t.id === focusedTodoId)) {
      setFocusedTodoId(null);
    }
  }, [focusedTodoId, filteredTodos]);

  useEffect(() => {
    function isTyping() {
      const el = document.activeElement;
      return (
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        el instanceof HTMLSelectElement
      );
    }

    function handleKeyDown(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;

      // When help modal is open, only Escape and ? close it
      if (showHelp) {
        if (e.key === 'Escape' || e.key === '?') {
          e.preventDefault();
          closeHelp();
        }
        return;
      }

      // Mod shortcuts work even when typing
      if (mod) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          handleUndo();
        } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
          e.preventDefault();
          handleRedo();
        }
        return;
      }

      // Escape: blur input or clear focus
      if (e.key === 'Escape') {
        e.preventDefault();
        if (isTyping()) {
          (document.activeElement as HTMLElement).blur();
        } else {
          setFocusedTodoId(null);
        }
        return;
      }

      // Don't handle single-key shortcuts while typing in form fields
      if (isTyping()) return;

      switch (e.key) {
        case '?':
          e.preventDefault();
          toggleHelp();
          break;

        case 'n':
        case '/':
          e.preventDefault();
          inputRef.current?.focus();
          break;

        case 'j':
        case 'ArrowDown': {
          e.preventDefault();
          if (filteredTodos.length === 0) break;
          const currentIdx = focusedTodoId
            ? filteredTodos.findIndex((t) => t.id === focusedTodoId)
            : -1;
          const nextIdx = currentIdx < filteredTodos.length - 1
            ? currentIdx + 1
            : 0;
          setFocusedTodoId(filteredTodos[nextIdx].id);
          break;
        }

        case 'k':
        case 'ArrowUp': {
          e.preventDefault();
          if (filteredTodos.length === 0) break;
          const currentIdx = focusedTodoId
            ? filteredTodos.findIndex((t) => t.id === focusedTodoId)
            : 0;
          const prevIdx = currentIdx > 0
            ? currentIdx - 1
            : filteredTodos.length - 1;
          setFocusedTodoId(filteredTodos[prevIdx].id);
          break;
        }

        case 'x': {
          if (focusedTodoId) {
            e.preventDefault();
            toggleTodo(focusedTodoId);
          }
          break;
        }

        case 'Delete':
        case 'Backspace': {
          if (focusedTodoId) {
            e.preventDefault();
            const currentIdx = filteredTodos.findIndex((t) => t.id === focusedTodoId);
            deleteTodo(focusedTodoId);
            // Move focus to next item or previous
            const remaining = filteredTodos.filter((t) => t.id !== focusedTodoId);
            if (remaining.length > 0) {
              const newIdx = Math.min(currentIdx, remaining.length - 1);
              setFocusedTodoId(remaining[newIdx].id);
            } else {
              setFocusedTodoId(null);
            }
          }
          break;
        }

        case '1':
          e.preventDefault();
          setFilter('all');
          break;

        case '2':
          e.preventDefault();
          setFilter('active');
          break;

        case '3':
          e.preventDefault();
          setFilter('completed');
          break;

        default:
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    showHelp,
    closeHelp,
    toggleHelp,
    handleUndo,
    handleRedo,
    focusedTodoId,
    filteredTodos,
    toggleTodo,
    deleteTodo,
  ]);

  return (
    <div className="app">
      <a href="#main-content" className="app__skip-link">Skip to main content</a>
      <header className="app__header">
        <GlitchText as="h1" className="app__title">GLITCH_DO</GlitchText>
      </header>

      <main id="main-content" className="app__main">
        <div className="app__toolbar">
          <div className="app__toolbar-left">
            <CyberButton
              variant="secondary"
              size="sm"
              onClick={handleUndo}
              disabled={!canUndo()}
              aria-label="Undo"
            >
              ↩ Undo
            </CyberButton>
            <CyberButton
              variant="secondary"
              size="sm"
              onClick={handleRedo}
              disabled={!canRedo()}
              aria-label="Redo"
            >
              Redo ↪
            </CyberButton>
          </div>
          <div className="app__toolbar-right">
            <DataTransfer
              todos={todos}
              onImport={importTodos}
              onError={showToast}
              onSuccess={showToast}
            />
            <CyberButton
              variant="secondary"
              size="sm"
              onClick={toggleHelp}
              aria-label="Keyboard shortcuts"
              title="Keyboard shortcuts (?)"
            >
              ⌨
            </CyberButton>
          </div>
        </div>
        <TodoInput ref={inputRef} onAdd={addTodo} />
        <TodoList
          todos={todos}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          updateNotes={updateNotes}
          clearCompleted={clearCompleted}
          reorderTodos={reorderTodos}
          focusedTodoId={focusedTodoId}
          filter={filter}
          categoryFilter={categoryFilter}
          priorityFilter={priorityFilter}
          onFilterChange={setFilter}
          onCategoryChange={setCategoryFilter}
          onPriorityChange={setPriorityFilter}
        />
      </main>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      {showPrompt && <InstallBanner onInstall={install} onDismiss={dismiss} />}
      {showHelp && (
        <KeyboardShortcutsHelp shortcuts={shortcuts} onClose={closeHelp} />
      )}
    </div>
  );
}

export default App;

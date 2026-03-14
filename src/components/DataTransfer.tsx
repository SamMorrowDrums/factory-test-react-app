import { memo, useRef, useCallback } from 'react';
import type { Todo } from '../types/todo';
import {
  exportToJSON,
  exportToCSV,
  importFromJSON,
  importFromCSV,
  downloadFile,
  readFile,
} from '../utils/dataTransfer';
import './DataTransfer.css';

interface DataTransferProps {
  todos: Todo[];
  onImport: (todos: Todo[]) => void;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
}

export const DataTransfer = memo(function DataTransfer({ todos, onImport, onError, onSuccess }: DataTransferProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = useCallback(() => {
    const content = exportToJSON(todos);
    downloadFile(content, 'todos.json', 'application/json');
    onSuccess(`Exported ${todos.length} todos as JSON`);
  }, [todos, onSuccess]);

  const handleExportCSV = useCallback(() => {
    const content = exportToCSV(todos);
    downloadFile(content, 'todos.csv', 'text/csv');
    onSuccess(`Exported ${todos.length} todos as CSV`);
  }, [todos, onSuccess]);

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await readFile(file);
      let imported: Todo[];

      if (file.name.endsWith('.csv')) {
        imported = importFromCSV(text);
      } else {
        imported = importFromJSON(text);
      }

      onImport(imported);
      onSuccess(`Imported ${imported.length} todos`);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to import file');
    }

    // Reset so the same file can be re-selected
    e.target.value = '';
  }, [onImport, onError, onSuccess]);

  return (
    <div className="data-transfer">
      <button className="data-transfer__btn" onClick={handleExportJSON} aria-label="Export JSON">
        ↓ JSON
      </button>
      <button className="data-transfer__btn" onClick={handleExportCSV} aria-label="Export CSV">
        ↓ CSV
      </button>
      <button className="data-transfer__btn" onClick={handleImportClick} aria-label="Import">
        ↑ Import
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.csv"
        className="data-transfer__file-input"
        onChange={handleFileChange}
        data-testid="file-input"
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
});

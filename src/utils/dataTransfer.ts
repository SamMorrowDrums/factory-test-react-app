import type { Todo, TodoCategory, TodoPriority } from '../types/todo';

const VALID_CATEGORIES: TodoCategory[] = ['work', 'personal', 'shopping', 'health'];
const VALID_PRIORITIES: TodoPriority[] = ['low', 'medium', 'high'];

function isValidCategory(value: unknown): value is TodoCategory {
  return typeof value === 'string' && VALID_CATEGORIES.includes(value as TodoCategory);
}

function isValidPriority(value: unknown): value is TodoPriority {
  return typeof value === 'string' && VALID_PRIORITIES.includes(value as TodoPriority);
}

function isValidTodo(obj: unknown): obj is Todo {
  if (typeof obj !== 'object' || obj === null) return false;
  const t = obj as Record<string, unknown>;
  return (
    typeof t.id === 'string' &&
    typeof t.title === 'string' &&
    typeof t.completed === 'boolean' &&
    isValidCategory(t.category) &&
    isValidPriority(t.priority) &&
    (t.dueDate === undefined || typeof t.dueDate === 'number') &&
    typeof t.createdAt === 'number'
  );
}

/** Validate and return an array of Todos, or throw with a descriptive message. */
function validateTodos(data: unknown): Todo[] {
  if (!Array.isArray(data)) {
    throw new Error('Import data must be an array of todos');
  }
  for (let i = 0; i < data.length; i++) {
    if (!isValidTodo(data[i])) {
      throw new Error(`Invalid todo at index ${i}`);
    }
  }
  return data as Todo[];
}

// ── JSON ────────────────────────────────────────────────────────────────

export function exportToJSON(todos: Todo[]): string {
  return JSON.stringify(todos, null, 2);
}

export function importFromJSON(text: string): Todo[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('Invalid JSON');
  }
  return validateTodos(parsed);
}

// ── CSV ─────────────────────────────────────────────────────────────────

const CSV_HEADER = 'id,title,completed,category,priority,dueDate,createdAt';

function escapeCSVField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportToCSV(todos: Todo[]): string {
  const rows = todos.map(
    (t) =>
      `${escapeCSVField(t.id)},${escapeCSVField(t.title)},${t.completed},${t.category},${t.priority},${t.dueDate ?? ''},${t.createdAt}`,
  );
  return [CSV_HEADER, ...rows].join('\n');
}

function parseCSVRow(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        fields.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
  }
  fields.push(current);
  return fields;
}

export function importFromCSV(text: string): Todo[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length === 0 || (lines.length === 1 && lines[0] === '')) {
    throw new Error('CSV file is empty');
  }

  // Skip header row if present
  const headerLine = lines[0].toLowerCase();
  const startIndex = headerLine.startsWith('id,') ? 1 : 0;

  const todos: Todo[] = [];
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const fields = parseCSVRow(line);
    if (fields.length < 7) {
      throw new Error(`Invalid CSV row at line ${i + 1}: expected 7 fields, got ${fields.length}`);
    }

    const [id, title, completedStr, category, priority, dueDateStr, createdAtStr] = fields;
    const completed = completedStr === 'true';
    if (completedStr !== 'true' && completedStr !== 'false') {
      throw new Error(`Invalid completed value at line ${i + 1}: "${completedStr}"`);
    }
    if (!isValidCategory(category)) {
      throw new Error(`Invalid category at line ${i + 1}: "${category}"`);
    }
    if (!isValidPriority(priority)) {
      throw new Error(`Invalid priority at line ${i + 1}: "${priority}"`);
    }
    const dueDate = dueDateStr === '' ? undefined : Number(dueDateStr);
    if (dueDateStr !== '' && isNaN(dueDate!)) {
      throw new Error(`Invalid dueDate at line ${i + 1}: "${dueDateStr}"`);
    }
    const createdAt = Number(createdAtStr);
    if (isNaN(createdAt)) {
      throw new Error(`Invalid createdAt at line ${i + 1}: "${createdAtStr}"`);
    }

    const todo: Todo = { id, title, completed, category, priority, createdAt };
    if (dueDate !== undefined) {
      todo.dueDate = dueDate;
    }
    todos.push(todo);
  }

  return todos;
}

// ── File helpers ────────────────────────────────────────────────────────

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

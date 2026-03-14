import { describe, it, expect } from 'vitest';
import { exportToJSON, importFromJSON, exportToCSV, importFromCSV } from './dataTransfer';
import type { Todo } from '../types/todo';

const sampleTodos: Todo[] = [
  { id: 'a1', title: 'Buy milk', completed: false, category: 'shopping', priority: 'medium', createdAt: 1700000000000 },
  { id: 'b2', title: 'Finish report', completed: true, category: 'work', priority: 'high', createdAt: 1700000001000 },
];

// ── JSON ────────────────────────────────────────────────────────────────

describe('exportToJSON', () => {
  it('produces valid JSON containing all todos', () => {
    const json = exportToJSON(sampleTodos);
    const parsed = JSON.parse(json);
    expect(parsed).toEqual(sampleTodos);
  });

  it('handles empty array', () => {
    expect(JSON.parse(exportToJSON([]))).toEqual([]);
  });
});

describe('importFromJSON', () => {
  it('parses valid JSON back to todos', () => {
    const json = exportToJSON(sampleTodos);
    expect(importFromJSON(json)).toEqual(sampleTodos);
  });

  it('throws on invalid JSON syntax', () => {
    expect(() => importFromJSON('{')).toThrow('Invalid JSON');
  });

  it('throws when data is not an array', () => {
    expect(() => importFromJSON('{"a":1}')).toThrow('must be an array');
  });

  it('throws on invalid todo structure', () => {
    expect(() => importFromJSON('[{"id":"x"}]')).toThrow('Invalid todo at index 0');
  });

  it('throws on invalid category', () => {
    const bad = JSON.stringify([{ id: '1', title: 'x', completed: false, category: 'invalid', priority: 'medium', createdAt: 1 }]);
    expect(() => importFromJSON(bad)).toThrow('Invalid todo at index 0');
  });
});

// ── CSV ─────────────────────────────────────────────────────────────────

describe('exportToCSV', () => {
  it('produces a header row and data rows', () => {
    const csv = exportToCSV(sampleTodos);
    const lines = csv.split('\n');
    expect(lines[0]).toBe('id,title,completed,category,priority,dueDate,createdAt');
    expect(lines.length).toBe(3);
  });

  it('handles empty array', () => {
    const csv = exportToCSV([]);
    expect(csv).toBe('id,title,completed,category,priority,dueDate,createdAt');
  });

  it('escapes titles with commas', () => {
    const todos: Todo[] = [
      { id: '1', title: 'Buy eggs, milk', completed: false, category: 'shopping', priority: 'medium', createdAt: 1 },
    ];
    const csv = exportToCSV(todos);
    expect(csv).toContain('"Buy eggs, milk"');
  });

  it('escapes titles with double quotes', () => {
    const todos: Todo[] = [
      { id: '1', title: 'Read "War and Peace"', completed: false, category: 'personal', priority: 'low', createdAt: 1 },
    ];
    const csv = exportToCSV(todos);
    expect(csv).toContain('"Read ""War and Peace"""');
  });
});

describe('importFromCSV', () => {
  it('round-trips through export and import', () => {
    const csv = exportToCSV(sampleTodos);
    const result = importFromCSV(csv);
    expect(result).toEqual(sampleTodos);
  });

  it('handles CSV without header row', () => {
    const csv = 'a1,Buy milk,false,shopping,medium,,1700000000000';
    const result = importFromCSV(csv);
    expect(result).toEqual([
      { id: 'a1', title: 'Buy milk', completed: false, category: 'shopping', priority: 'medium', createdAt: 1700000000000 },
    ]);
  });

  it('handles titles with commas', () => {
    const todos: Todo[] = [
      { id: '1', title: 'Buy eggs, milk', completed: false, category: 'shopping', priority: 'medium', createdAt: 1 },
    ];
    const csv = exportToCSV(todos);
    expect(importFromCSV(csv)).toEqual(todos);
  });

  it('throws on empty input', () => {
    expect(() => importFromCSV('')).toThrow('CSV file is empty');
  });

  it('throws on row with too few fields', () => {
    expect(() => importFromCSV('id,title,completed,category,priority,dueDate,createdAt\na1,Buy milk')).toThrow(
      'expected 7 fields',
    );
  });

  it('throws on invalid completed value', () => {
    expect(() =>
      importFromCSV('id,title,completed,category,priority,dueDate,createdAt\na1,Buy milk,yes,shopping,medium,,1'),
    ).toThrow('Invalid completed value');
  });

  it('throws on invalid category', () => {
    expect(() =>
      importFromCSV('id,title,completed,category,priority,dueDate,createdAt\na1,Buy milk,false,badcat,medium,,1'),
    ).toThrow('Invalid category');
  });

  it('throws on invalid createdAt', () => {
    expect(() =>
      importFromCSV('id,title,completed,category,priority,dueDate,createdAt\na1,Buy milk,false,shopping,medium,,abc'),
    ).toThrow('Invalid createdAt');
  });

  it('skips blank lines', () => {
    const csv = 'id,title,completed,category,priority,dueDate,createdAt\na1,Buy milk,false,shopping,medium,,1\n\nb2,Work,true,work,high,,2';
    const result = importFromCSV(csv);
    expect(result).toHaveLength(2);
  });

  it('throws on invalid priority', () => {
    expect(() =>
      importFromCSV('id,title,completed,category,priority,dueDate,createdAt\na1,Buy milk,false,shopping,urgent,,1'),
    ).toThrow('Invalid priority');
  });
});

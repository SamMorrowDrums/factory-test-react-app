import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTransfer } from './DataTransfer';
import type { Todo } from '../types/todo';

const sampleTodos: Todo[] = [
  { id: '1', title: 'Buy milk', completed: false, category: 'shopping', createdAt: 1700000000000 },
  { id: '2', title: 'Work out', completed: true, category: 'health', createdAt: 1700000001000 },
];

vi.mock('../utils/dataTransfer', async () => {
  const actual = await vi.importActual<typeof import('../utils/dataTransfer')>('../utils/dataTransfer');
  return {
    ...actual,
    downloadFile: vi.fn(),
  };
});

describe('DataTransfer', () => {
  let onImport: Mock;
  let onError: Mock;
  let onSuccess: Mock;

  beforeEach(() => {
    onImport = vi.fn();
    onError = vi.fn();
    onSuccess = vi.fn();
  });

  const renderComponent = (todos: Todo[] = sampleTodos) =>
    render(
      <DataTransfer todos={todos} onImport={onImport} onError={onError} onSuccess={onSuccess} />,
    );

  it('renders export and import buttons', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: 'Export todos as JSON' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Export todos as CSV' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Import todos from file' })).toBeInTheDocument();
  });

  it('calls onSuccess when exporting JSON', async () => {
    renderComponent();
    await userEvent.click(screen.getByRole('button', { name: 'Export todos as JSON' }));
    expect(onSuccess).toHaveBeenCalledWith('Exported 2 todos as JSON');
  });

  it('calls onSuccess when exporting CSV', async () => {
    renderComponent();
    await userEvent.click(screen.getByRole('button', { name: 'Export todos as CSV' }));
    expect(onSuccess).toHaveBeenCalledWith('Exported 2 todos as CSV');
  });

  it('imports a valid JSON file', async () => {
    renderComponent();
    const jsonContent = JSON.stringify(sampleTodos);
    const file = new File([jsonContent], 'todos.json', { type: 'application/json' });
    const input = screen.getByTestId('file-input') as HTMLInputElement;
    await userEvent.upload(input, file);
    await waitFor(() => {
      expect(onImport).toHaveBeenCalledWith(sampleTodos);
    });
    expect(onSuccess).toHaveBeenCalledWith('Imported 2 todos');
  });

  it('imports a valid CSV file', async () => {
    renderComponent();
    const csv = 'id,title,completed,category,createdAt\n1,Buy milk,false,shopping,1700000000000';
    const file = new File([csv], 'todos.csv', { type: 'text/csv' });
    const input = screen.getByTestId('file-input') as HTMLInputElement;
    await userEvent.upload(input, file);
    await waitFor(() => {
      expect(onImport).toHaveBeenCalledWith([
        { id: '1', title: 'Buy milk', completed: false, category: 'shopping', createdAt: 1700000000000 },
      ]);
    });
  });

  it('calls onError for invalid JSON file', async () => {
    renderComponent();
    const file = new File(['{bad'], 'todos.json', { type: 'application/json' });
    const input = screen.getByTestId('file-input') as HTMLInputElement;
    await userEvent.upload(input, file);
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('Invalid JSON');
    });
    expect(onImport).not.toHaveBeenCalled();
  });
});

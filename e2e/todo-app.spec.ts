import { test, expect, type Page } from '@playwright/test';

/** Helper to add a todo via the input form. */
async function addTodo(page: Page, title: string) {
  await page.getByPlaceholder('Add a new todo…').fill(title);
  await page.getByRole('button', { name: 'Add', exact: true }).click();
}

test.beforeEach(async ({ page }) => {
  // Clear localStorage to start fresh each test
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test.describe('Todo CRUD operations', () => {
  test('should add a new todo', async ({ page }) => {
    await page.goto('/');

    const input = page.getByPlaceholder('Add a new todo…');
    await input.fill('Buy milk');
    await page.getByRole('button', { name: 'Add', exact: true }).click();

    await expect(page.getByText('Buy milk')).toBeVisible();
    await expect(input).toHaveValue('');
  });

  test('should toggle a todo as completed', async ({ page }) => {
    await page.goto('/');
    await addTodo(page, 'Walk the dog');

    const toggle = page.getByLabel(/Mark "Walk the dog" as complete/);
    await toggle.click();

    const todoItem = page.locator('.todo-item').filter({ hasText: 'Walk the dog' });
    await expect(todoItem).toHaveClass(/todo-item--completed/);
  });

  test('should delete a todo', async ({ page }) => {
    await page.goto('/');
    await addTodo(page, 'Temporary task');
    await expect(page.getByText('Temporary task')).toBeVisible();

    await page.getByLabel('Delete "Temporary task"').click();

    await expect(page.getByText('Temporary task')).not.toBeVisible();
  });

  test('should add multiple todos', async ({ page }) => {
    await page.goto('/');
    await addTodo(page, 'First task');
    await addTodo(page, 'Second task');
    await addTodo(page, 'Third task');

    await expect(page.getByText('First task')).toBeVisible();
    await expect(page.getByText('Second task')).toBeVisible();
    await expect(page.getByText('Third task')).toBeVisible();
    await expect(page.getByText('3 items left')).toBeVisible();
  });

  test('should not add empty todos', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Add', exact: true }).click();

    await expect(page.getByText('0 items left')).toBeVisible();
  });
});

test.describe('Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await addTodo(page, 'Active task');
    await addTodo(page, 'Completed task');

    // Complete the second todo
    await page.getByLabel(/Mark "Completed task" as complete/).click();
  });

  test('should filter to show only active todos', async ({ page }) => {
    await page.getByRole('button', { name: 'Active', exact: true }).click();

    await expect(page.getByText('Active task')).toBeVisible();
    await expect(page.getByText('Completed task')).not.toBeVisible();
  });

  test('should filter to show only completed todos', async ({ page }) => {
    await page.getByRole('button', { name: 'Completed', exact: true }).click();

    await expect(page.getByText('Completed task')).toBeVisible();
    await expect(page.getByText('Active task')).not.toBeVisible();
  });

  test('should show all todos by default', async ({ page }) => {
    await expect(page.getByText('Active task')).toBeVisible();
    await expect(page.getByText('Completed task')).toBeVisible();
  });
});

test.describe('Search', () => {
  test('should filter todos by search query', async ({ page }) => {
    await page.goto('/');
    await addTodo(page, 'Buy groceries');
    await addTodo(page, 'Read a book');

    const searchInput = page.getByPlaceholder('Search todos…');
    await searchInput.fill('groceries');

    await expect(page.getByText('Buy groceries')).toBeVisible();
    await expect(page.getByText('Read a book')).not.toBeVisible();
  });
});

test.describe('Clear completed', () => {
  test('should clear all completed todos', async ({ page }) => {
    await page.goto('/');
    await addTodo(page, 'Keep this');
    await addTodo(page, 'Remove this');

    await page.getByLabel(/Mark "Remove this" as complete/).click();
    await page.getByRole('button', { name: 'Clear completed' }).click();

    await expect(page.getByText('Keep this')).toBeVisible();
    await expect(page.getByText('Remove this')).not.toBeVisible();
    await expect(page.getByText('1 item left')).toBeVisible();
  });
});

test.describe('Persistence', () => {
  test('should persist todos across page reloads', async ({ page }) => {
    await page.goto('/');
    await addTodo(page, 'Persistent todo');
    await expect(page.getByText('Persistent todo')).toBeVisible();

    await page.reload();

    await expect(page.getByText('Persistent todo')).toBeVisible();
  });
});

test.describe('Theme toggle', () => {
  test('should toggle between themes', async ({ page }) => {
    await page.goto('/');

    const themeToggle = page.getByLabel(/theme/i);
    await themeToggle.click();

    const theme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(theme).toBeTruthy();
  });
});

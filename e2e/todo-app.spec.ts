import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test.describe('App Shell', () => {
  test('renders the header and main UI elements', async ({ page }) => {
    await expect(page.getByPlaceholder(/add/i)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Undo', exact: true })).toBeDisabled()
    await expect(page.getByRole('button', { name: 'Redo', exact: true })).toBeDisabled()
  })
})

test.describe('Adding Todos', () => {
  test('adds a todo with default category', async ({ page }) => {
    const input = page.getByPlaceholder(/add/i)
    await input.fill('Buy groceries')
    await input.press('Enter')

    await expect(page.getByText('Buy groceries')).toBeVisible()
    await expect(input).toHaveValue('')
  })

  test('adds a todo with a specific category', async ({ page }) => {
    const input = page.getByPlaceholder(/add/i)
    await input.fill('Morning run')

    const categorySelect = page.getByLabel('Todo category')
    await categorySelect.selectOption('health')

    await page.getByRole('button', { name: /add/i }).click()

    await expect(page.getByText('Morning run')).toBeVisible()
    await expect(page.locator('.todo-item__category--health')).toBeVisible()
  })

  test('does not add an empty todo', async ({ page }) => {
    const input = page.getByPlaceholder(/add/i)
    await input.fill('   ')
    await input.press('Enter')

    await expect(page.locator('.todo-item')).toHaveCount(0)
  })

  test('adds multiple todos', async ({ page }) => {
    const input = page.getByPlaceholder(/add/i)

    for (const title of ['Task A', 'Task B', 'Task C']) {
      await input.fill(title)
      await input.press('Enter')
    }

    await expect(page.getByText('Task A')).toBeVisible()
    await expect(page.getByText('Task B')).toBeVisible()
    await expect(page.getByText('Task C')).toBeVisible()
  })
})

test.describe('Toggling Todos', () => {
  test('marks a todo as completed', async ({ page }) => {
    const input = page.getByPlaceholder(/add/i)
    await input.fill('Complete me')
    await input.press('Enter')

    const checkbox = page.getByRole('checkbox')
    await checkbox.click()

    await expect(checkbox).toBeChecked()
  })

  test('marks a completed todo back to active', async ({ page }) => {
    const input = page.getByPlaceholder(/add/i)
    await input.fill('Toggle me')
    await input.press('Enter')

    const checkbox = page.getByRole('checkbox')
    await checkbox.click()
    await expect(checkbox).toBeChecked()

    await checkbox.click()
    await expect(checkbox).not.toBeChecked()
  })
})

test.describe('Deleting Todos', () => {
  test('removes a todo when delete is clicked', async ({ page }) => {
    const input = page.getByPlaceholder(/add/i)
    await input.fill('Delete me')
    await input.press('Enter')

    await expect(page.getByText('Delete me')).toBeVisible()

    await page.getByRole('button', { name: 'Delete "Delete me"' }).click()

    await expect(page.getByText('Delete me')).not.toBeVisible()
  })
})

test.describe('Filtering', () => {
  test.beforeEach(async ({ page }) => {
    const input = page.getByPlaceholder(/add/i)

    await input.fill('Active task')
    await input.press('Enter')

    await input.fill('Completed task')
    await input.press('Enter')
    const checkboxes = page.getByRole('checkbox')
    await checkboxes.last().click()
  })

  test('shows all todos by default', async ({ page }) => {
    await expect(page.getByText('Active task')).toBeVisible()
    await expect(page.getByText('Completed task')).toBeVisible()
  })

  test('filters to active todos only', async ({ page }) => {
    await page.getByRole('button', { name: 'Active', exact: true }).click()

    await expect(page.getByText('Active task')).toBeVisible()
    await expect(page.getByText('Completed task')).not.toBeVisible()
  })

  test('filters to completed todos only', async ({ page }) => {
    await page.getByRole('button', { name: 'Completed', exact: true }).click()

    await expect(page.getByText('Completed task')).toBeVisible()
    await expect(page.getByText('Active task')).not.toBeVisible()
  })

  test('filters by category', async ({ page }) => {
    // Start fresh for this test
    await page.evaluate(() => localStorage.clear())
    await page.reload()

    const input = page.getByPlaceholder(/add/i)
    const categorySelect = page.getByLabel('Todo category')

    await input.fill('Work task')
    await categorySelect.selectOption('work')
    await input.press('Enter')

    await input.fill('Personal task')
    await categorySelect.selectOption('personal')
    await input.press('Enter')

    const filterCategorySelect = page.getByLabel('Filter by category')
    await filterCategorySelect.selectOption('work')

    await expect(page.getByText('Work task')).toBeVisible()
    await expect(page.getByText('Personal task')).not.toBeVisible()
  })
})

test.describe('Clear Completed', () => {
  test('removes all completed todos', async ({ page }) => {
    const input = page.getByPlaceholder(/add/i)

    await input.fill('Keep me')
    await input.press('Enter')

    await input.fill('Clear me')
    await input.press('Enter')

    const checkboxes = page.getByRole('checkbox')
    await checkboxes.last().click()

    await page.getByRole('button', { name: /clear completed/i }).click()

    await expect(page.getByText('Keep me')).toBeVisible()
    await expect(page.getByText('Clear me')).not.toBeVisible()
  })
})

test.describe('Undo / Redo', () => {
  test('undoes a todo addition via button', async ({ page }) => {
    const input = page.getByPlaceholder(/add/i)
    await input.fill('My new task')
    await input.press('Enter')

    await expect(page.getByText('My new task')).toBeVisible()

    await page.getByRole('button', { name: 'Undo', exact: true }).click()

    await expect(page.getByText('My new task')).not.toBeVisible()
  })

  test('redoes an undone action via button', async ({ page }) => {
    const input = page.getByPlaceholder(/add/i)
    await input.fill('My new task')
    await input.press('Enter')
    await expect(page.getByText('My new task')).toBeVisible()

    await page.getByRole('button', { name: 'Undo', exact: true }).click()
    await expect(page.getByText('My new task')).not.toBeVisible()

    await page.getByRole('button', { name: 'Redo', exact: true }).click()
    await expect(page.getByText('My new task')).toBeVisible()
  })

  test('undo via keyboard shortcut (Ctrl+Z)', async ({ page }) => {
    const input = page.getByPlaceholder(/add/i)
    await input.fill('Keyboard test')
    await input.press('Enter')

    await expect(page.getByText('Keyboard test')).toBeVisible()

    await page.locator('body').click()
    await page.keyboard.press('Control+z')

    await expect(page.getByText('Keyboard test')).not.toBeVisible()
  })

  test('redo via keyboard shortcut (Ctrl+Shift+Z)', async ({ page }) => {
    const input = page.getByPlaceholder(/add/i)
    await input.fill('Keyboard test')
    await input.press('Enter')

    await expect(page.getByText('Keyboard test')).toBeVisible()

    await page.locator('body').click()
    await page.keyboard.press('Control+z')
    await expect(page.getByText('Keyboard test')).not.toBeVisible()

    await page.keyboard.press('Control+Shift+z')
    await expect(page.getByText('Keyboard test')).toBeVisible()
  })

  test('undo and redo buttons are disabled appropriately', async ({ page }) => {
    const undoBtn = page.getByRole('button', { name: 'Undo', exact: true })
    const redoBtn = page.getByRole('button', { name: 'Redo', exact: true })

    await expect(undoBtn).toBeDisabled()
    await expect(redoBtn).toBeDisabled()

    const input = page.getByPlaceholder(/add/i)
    await input.fill('Test task')
    await input.press('Enter')

    await expect(undoBtn).toBeEnabled()
    await expect(redoBtn).toBeDisabled()

    await undoBtn.click()

    await expect(undoBtn).toBeDisabled()
    await expect(redoBtn).toBeEnabled()
  })
})

test.describe('LocalStorage Persistence', () => {
  test('todos persist across page reloads', async ({ page }) => {
    const input = page.getByPlaceholder(/add/i)
    await input.fill('Persistent todo')
    await input.press('Enter')

    await expect(page.getByText('Persistent todo')).toBeVisible()

    await page.reload()

    await expect(page.getByText('Persistent todo')).toBeVisible()
  })

  test('completed state persists across page reloads', async ({ page }) => {
    const input = page.getByPlaceholder(/add/i)
    await input.fill('Stay completed')
    await input.press('Enter')

    await page.getByRole('checkbox').click()
    await expect(page.getByRole('checkbox')).toBeChecked()

    await page.reload()

    await expect(page.getByRole('checkbox')).toBeChecked()
  })
})

test.describe('Items Left Counter', () => {
  test('displays correct count of active items', async ({ page }) => {
    const input = page.getByPlaceholder(/add/i)

    await input.fill('Item 1')
    await input.press('Enter')
    await input.fill('Item 2')
    await input.press('Enter')
    await input.fill('Item 3')
    await input.press('Enter')

    await expect(page.getByText(/3 items? left/i)).toBeVisible()

    const checkboxes = page.getByRole('checkbox')
    await checkboxes.first().click()

    await expect(page.getByText(/2 items? left/i)).toBeVisible()
  })
})

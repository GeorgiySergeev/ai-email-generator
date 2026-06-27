import { test, expect } from '@playwright/test'

test.describe('Login Page', () => {
  test('shows validation errors on empty submit', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /INITIALIZE_ACCESS/i }).click()
    await expect(page.getByText(/valid email/i)).toBeVisible()
  })

  test('shows error for wrong credentials', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/EMAIL_ADDRESS/i).fill('wrong@example.com')
    await page.getByLabel(/PASSWORD/i).fill('WrongPass1')
    await page.getByRole('button', { name: /INITIALIZE_ACCESS/i }).click()
    await expect(page.getByText(/invalid email or password/i)).toBeVisible()
  })

  test('redirects to dashboard on valid login', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/EMAIL_ADDRESS/i).fill(process.env.TEST_USER_EMAIL!)
    await page.getByLabel(/PASSWORD/i).fill(process.env.TEST_USER_PASSWORD!)
    await page.getByRole('button', { name: /INITIALIZE_ACCESS/i }).click()
    await expect(page).toHaveURL('/dashboard')
  })
})

test.describe('Register Page', () => {
  test('shows validation errors on empty submit', async ({ page }) => {
    await page.goto('/register')
    await page.getByRole('button', { name: /CREATE_ACCOUNT/i }).click()
    await expect(page.getByText(/valid email/i)).toBeVisible()
  })

  test('shows error for duplicate email', async ({ page }) => {
    await page.goto('/register')
    await page.getByLabel(/EMAIL_ADDRESS/i).fill(process.env.TEST_USER_EMAIL!)
    await page.getByLabel(/^PASSWORD/i).fill('Password1')
    await page.getByLabel(/CONFIRM_PASSWORD/i).fill('Password1')
    await page.getByRole('button', { name: /CREATE_ACCOUNT/i }).click()
    await expect(page.getByText(/already registered/i)).toBeVisible()
  })
})

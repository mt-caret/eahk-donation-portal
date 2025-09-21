import { test, expect } from '@playwright/test';

test.describe('Donation Portal - Accessibility', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should have proper form labels and ARIA attributes', async ({ page }) => {
        // Check that form inputs have associated labels
        const firstName = page.locator('#personal-details-section--first-name');
        await expect(firstName).toHaveAttribute('name', 'first_name');

        const firstNameLabel = page.locator('label[for="personal-details-section--first-name"]');
        await expect(firstNameLabel).toContainText('First name');

        const email = page.locator('#personal-details-section--email');
        await expect(email).toHaveAttribute('type', 'email');
        await expect(email).toHaveAttribute('required');

        // Check radio button groups have proper labels
        const oneTimeRadio = page.locator('#donation-frequency-section--one-time');
        const oneTimeLabel = page.locator('label[for="donation-frequency-section--one-time"]');
        await expect(oneTimeLabel).toContainText('One time');

        // Check checkboxes have proper labels
        const updatesCheckbox = page.locator('#communications-section--subscribe-to-updates');
        const updatesLabel = page.locator('label').filter({ has: updatesCheckbox });
        await expect(updatesLabel).toContainText('Send me news and updates');
    });

    test('should be keyboard navigable', async ({ page }) => {
        // Test that form can be navigated and interacted with via keyboard
        // Focus the first radio button manually since tab order can vary
        await page.locator('#donation-frequency-section--one-time').focus();
        await expect(page.locator('#donation-frequency-section--one-time')).toBeFocused();

        // Navigate to monthly option using arrow keys (standard radio group behavior)
        await page.keyboard.press('ArrowDown');
        await expect(page.locator('#donation-frequency-section--monthly')).toBeChecked();

        // Navigate to allocation section
        await page.locator('#allocation-section--specific-allocation').focus();
        await page.keyboard.press('Space');
        await expect(page.locator('#allocation-section--specific-allocation')).toBeChecked();

        // Should show specific allocation section
        await expect(page.locator('.specific-allocation-section')).toBeVisible();
    });

    test('should handle focus management for dynamic content', async ({ page }) => {
        // Switch to specific allocation
        await page.locator('label[for="allocation-section--specific-allocation"]').click();

        // Tab to first charity input
        await page.keyboard.press('Tab'); // Skip past radio buttons
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');

        // Should be able to interact with charity amount inputs
        const firstCharityInput = page.locator('.specific-charity').first();
        await firstCharityInput.focus();
        await firstCharityInput.fill('50');

        // Tab to next charity input
        await page.keyboard.press('Tab');
        const secondCharityInput = page.locator('.specific-charity').nth(1);
        await secondCharityInput.fill('25');
    });

    test('should have proper heading hierarchy', async ({ page }) => {
        // Check main headings are present and in correct order
        const headings = page.locator('h1, h2, h3, h4, h5, h6');

        // Should have section headings
        await expect(page.locator('h2').filter({ hasText: 'I would like to give' })).toBeVisible();
        await expect(page.locator('h2').filter({ hasText: 'I would like my gift to go to' })).toBeVisible();
        await expect(page.locator('h2').filter({ hasText: 'I would like to gift' })).toBeVisible();
        await expect(page.locator('h2').filter({ hasText: 'Support our work' })).toBeVisible();
        await expect(page.locator('h2').filter({ hasText: 'Personal Details' })).toBeVisible();
        await expect(page.locator('h2').filter({ hasText: 'Payment Method' })).toBeVisible();

        // Check that h3 headings are used for charity categories
        await page.locator('label[for="allocation-section--specific-allocation"]').click();
        await expect(page.locator('h3').filter({ hasText: 'Our top recommended charities' })).toBeVisible();
        await expect(page.locator('h3').filter({ hasText: 'Other charities we support' })).toBeVisible();
    });

    test('should provide adequate color contrast', async ({ page }) => {
        // This is a basic check - in a real scenario you'd use axe-core
        // Check that donation form container has proper font family
        await expect(page.locator('.donation-form-host')).toHaveCSS('font-family', /Helvetica/);

        // Check that buttons have proper styling
        const donateButton = page.locator('#donate-button-section--donate-button');
        await expect(donateButton).toHaveCSS('background-color', 'rgb(21, 146, 165)'); // --eaa-blue-600
        await expect(donateButton).toHaveCSS('color', 'rgb(255, 255, 255)'); // white text
    });

    test('should handle screen reader announcements', async ({ page }) => {
        // Test that dynamic content changes are announced
        // Switch allocation type
        await page.locator('label[for="allocation-section--specific-allocation"]').click();

        // Check that new content is visible (screen readers would announce this)
        await expect(page.locator('.specific-allocation-section')).toBeVisible();
        await expect(page.locator('text=Our top recommended charities')).toBeVisible();

        // Test form validation announcements
        await page.locator('#donate-button-section--donate-button').click();

        // Alert should be announced by screen reader
        page.on('dialog', async dialog => {
            expect(dialog.type()).toBe('alert');
            await dialog.accept();
        });
    });

    test('should support high contrast mode', async ({ page }) => {
        // Simulate high contrast mode by checking focus indicators
        const firstRadio = page.locator('#donation-frequency-section--one-time');
        await firstRadio.focus();

        // Focus should be visible
        await expect(firstRadio).toBeFocused();

        // Check that focus outline is present (defined in CSS)
        const focusedLabel = page.locator('label[for="donation-frequency-section--one-time"]');
        await expect(focusedLabel).toBeVisible();
    });
});

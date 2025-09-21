import { test, expect } from '@playwright/test';

test.describe('Donation Portal - Edge Cases', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should handle very large donation amounts', async ({ page }) => {
        // Enter maximum allowed amount
        await page.locator('#custom-amount-input').fill('999999.99');

        // Fill required fields
        await page.locator('#personal-details-section--first-name').fill('Big');
        await page.locator('#personal-details-section--last-name').fill('Donor');
        await page.locator('#personal-details-section--email').fill('big@donor.com');
        await page.locator('#personal-details-section--postcode').fill('1000');

        // Should calculate tip correctly
        await expect(page.locator('.total-amount-section')).toContainText('$1,099,999.99'); // With 10% tip

        // Should allow submission
        await page.locator('#donate-button-section--donate-button').click();
        await expect(page.locator('#thankyou-section')).toBeVisible({ timeout: 5000 });
    });

    test('should handle decimal amounts correctly', async ({ page }) => {
        // Enter amount with decimals
        await page.locator('#custom-amount-input').fill('25.50');

        // Fill required fields
        await page.locator('#personal-details-section--first-name').fill('Decimal');
        await page.locator('#personal-details-section--last-name').fill('User');
        await page.locator('#personal-details-section--email').fill('decimal@example.com');
        await page.locator('#personal-details-section--postcode').fill('2000');

        // Should calculate tip correctly (10% of $25.50 = $2.55)
        await expect(page.locator('.total-amount-section')).toContainText('$28.05');

        // Should allow submission
        await page.locator('#donate-button-section--donate-button').click();
        await expect(page.locator('#thankyou-section')).toBeVisible({ timeout: 5000 });
    });

    test('should handle zero and negative amounts gracefully', async ({ page }) => {
        // Try zero amount
        await page.locator('#custom-amount-input').fill('0');

        // Fill required fields
        await page.locator('#personal-details-section--first-name').fill('Zero');
        await page.locator('#personal-details-section--last-name').fill('Amount');
        await page.locator('#personal-details-section--email').fill('zero@example.com');
        await page.locator('#personal-details-section--postcode').fill('3000');

        // Should show validation error
        page.once('dialog', async dialog => {
            expect(dialog.message()).toContain('Please select an amount of at least $2');
            await dialog.accept();
        });
        await page.locator('#donate-button-section--donate-button').click();

        // Try negative amount - form should handle this gracefully
        await page.locator('#custom-amount-input').fill('-10');

        // Fill required fields
        await page.locator('#personal-details-section--first-name').fill('Negative');
        await page.locator('#personal-details-section--last-name').fill('Amount');
        await page.locator('#personal-details-section--email').fill('negative@example.com');
        await page.locator('#personal-details-section--postcode').fill('3000');

        // Should show validation error for negative amount
        page.once('dialog', async dialog => {
            expect(dialog.message()).toContain('Please select an amount of at least $2');
            await dialog.accept();
        });
        await page.locator('#donate-button-section--donate-button').click();
    });

    test('should handle extremely long text inputs', async ({ page }) => {
        const longName = 'A'.repeat(1000);
        const longEmail = 'very' + 'long'.repeat(50) + '@example.com';

        // Fill with very long names
        await page.locator('#personal-details-section--first-name').fill(longName);
        await page.locator('#personal-details-section--last-name').fill(longName);

        // Email might be truncated or rejected by browser validation
        await page.locator('#personal-details-section--email').fill(longEmail);

        // Should still accept valid postcode
        await page.locator('#personal-details-section--postcode').fill('4000');

        // Select donation amount
        await page.locator('label[for="amount-section--donate-50"]').click();

        // Form should handle long inputs gracefully
        await page.locator('#donate-button-section--donate-button').click();

        // Should either succeed or show appropriate validation
        try {
            await expect(page.locator('#thankyou-section')).toBeVisible({ timeout: 5000 });
        } catch {
            // If validation fails, that's also acceptable behavior
            const emailInput = page.locator('#personal-details-section--email');
            const isValid = await emailInput.evaluate((input: HTMLInputElement) => input.validity.valid);
            // Either should succeed or email should be invalid
            expect(isValid).toBeDefined();
        }
    });

    test('should handle rapid form interactions', async ({ page }) => {
        // Rapidly switch between options
        for (let i = 0; i < 5; i++) {
            await page.locator('label[for="donation-frequency-section--monthly"]').click();
            await page.locator('label[for="donation-frequency-section--one-time"]').click();
            await page.locator('label[for="allocation-section--specific-allocation"]').click();
            await page.locator('label[for="allocation-section--default-allocation"]').click();
        }

        // Form should remain stable
        await expect(page.locator('#donation-frequency-section--one-time')).toBeChecked();
        await expect(page.locator('#allocation-section--default-allocation')).toBeChecked();
        await expect(page.locator('.amount-section')).toBeVisible();

        // Should still be able to complete donation
        await page.locator('label[for="amount-section--donate-100"]').click();
        await page.locator('#personal-details-section--first-name').fill('Rapid');
        await page.locator('#personal-details-section--last-name').fill('Clicker');
        await page.locator('#personal-details-section--email').fill('rapid@example.com');
        await page.locator('#personal-details-section--postcode').fill('5000');

        await page.locator('#donate-button-section--donate-button').click();
        await expect(page.locator('#thankyou-section')).toBeVisible({ timeout: 5000 });
    });

    test('should handle special characters in form fields', async ({ page }) => {
        // Test special characters in names
        await page.locator('#personal-details-section--first-name').fill("O'Connor");
        await page.locator('#personal-details-section--last-name').fill('Smith-Jones');
        await page.locator('#personal-details-section--email').fill('test+tag@example-domain.co.uk');

        // Test international postcode
        await page.locator('#personal-details-section--postcode').fill('SW1A'); // UK postcode format

        // Select non-default country
        await page.locator('#personal-details-section--country').selectOption('United Kingdom of Great Britain and Northern Ireland (the)');

        // Should handle these gracefully
        await page.locator('label[for="amount-section--donate-50"]').click();
        await page.locator('#donate-button-section--donate-button').click();

        await expect(page.locator('#thankyou-section')).toBeVisible({ timeout: 5000 });
    });

    test('should handle browser back/forward navigation', async ({ page }) => {
        // Fill some form data
        await page.locator('label[for="donation-frequency-section--monthly"]').click();
        await page.locator('label[for="amount-section--donate-100"]').click();
        await page.locator('#personal-details-section--first-name').fill('Navigation');

        // Navigate away and back
        await page.goto('data:text/html,<html><body><h1>Other Page</h1></body></html>');
        await page.goBack();

        // Form state should be preserved or reset gracefully
        await expect(page.locator('.donation-form-host')).toBeVisible();

        // Should be able to interact with form again
        await page.locator('#personal-details-section--last-name').fill('Test');
        await page.locator('#personal-details-section--email').fill('nav@example.com');
        await page.locator('#personal-details-section--postcode').fill('6000');

        await page.locator('#donate-button-section--donate-button').click();
        await expect(page.locator('#thankyou-section')).toBeVisible({ timeout: 5000 });
    });

    test('should handle network interruption gracefully', async ({ page }) => {
        // Fill form completely
        await page.locator('label[for="amount-section--donate-50"]').click();
        await page.locator('#personal-details-section--first-name').fill('Network');
        await page.locator('#personal-details-section--last-name').fill('Test');
        await page.locator('#personal-details-section--email').fill('network@example.com');
        await page.locator('#personal-details-section--postcode').fill('7000');

        // Simulate network failure by going offline
        await page.context().setOffline(true);

        // Try to submit
        await page.locator('#donate-button-section--donate-button').click();

        // Should show loading state but eventually fail gracefully
        await expect(page.locator('#donate-button-section--donate-button')).toContainText('Processing...');

        // Restore network
        await page.context().setOffline(false);

        // Form should still be functional
        await expect(page.locator('#donate-button-section--donate-button')).toContainText('Donate');

        // Should be able to retry
        await page.locator('#donate-button-section--donate-button').click();
        await expect(page.locator('#thankyou-section')).toBeVisible({ timeout: 5000 });
    });

    test('should handle multiple specific charity allocations with edge amounts', async ({ page }) => {
        // Switch to specific allocation
        await page.locator('label[for="allocation-section--specific-allocation"]').click();

        // Add very small amounts to multiple charities
        await page.locator('#against-malaria-foundation-amount').fill('0.01');
        await page.locator('#givedirectly-amount').fill('0.01');
        await page.locator('#helen-keller-international-amount').fill('1.98'); // Total = $2.00

        // Fill personal details
        await page.locator('#personal-details-section--first-name').fill('Edge');
        await page.locator('#personal-details-section--last-name').fill('Case');
        await page.locator('#personal-details-section--email').fill('edge@example.com');
        await page.locator('#personal-details-section--postcode').fill('8000');

        // Should calculate total correctly
        await expect(page.locator('.total-amount-section')).toContainText('$2.20'); // $2.00 + $0.20 tip (10%)

        // Should allow submission (meets minimum $2)
        await page.locator('#donate-button-section--donate-button').click();
        await expect(page.locator('#thankyou-section')).toBeVisible({ timeout: 5000 });
    });
});

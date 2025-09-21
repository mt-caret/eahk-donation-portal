import { test, expect } from '@playwright/test';

test.describe('Donation Portal - Basic Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should display all main sections on page load', async ({ page }) => {
        // Check that all main sections are present
        await expect(page.locator('#donation-frequency-section')).toBeVisible();
        await expect(page.locator('#allocation-section')).toBeVisible();
        await expect(page.locator('#amount-section')).toBeVisible();
        await expect(page.locator('#amplify-impact-section')).toBeVisible();
        await expect(page.locator('#personal-details-section')).toBeVisible();
        await expect(page.locator('#communications-section')).toBeVisible();
        await expect(page.locator('#payment-method-section')).toBeVisible();
        await expect(page.locator('#donate-button-section')).toBeVisible();
    });

    test('should have correct default values', async ({ page }) => {
        // Check default donation frequency
        await expect(page.locator('#donation-frequency-section--one-time')).toBeChecked();

        // Check default allocation type
        await expect(page.locator('#allocation-section--default-allocation')).toBeChecked();

        // Check default amplify impact percentage
        await expect(page.locator('#amplify-impact-section--amount-10')).toBeChecked();

        // Check default payment method
        await expect(page.locator('#payment-method-section--credit-card')).toBeChecked();

        // Check default communication preferences
        await expect(page.locator('#communications-section--subscribe-to-updates')).toBeChecked();
        await expect(page.locator('#communications-section--subscribe-to-newsletter')).not.toBeChecked();

        // Check default country
        await expect(page.locator('#personal-details-section--country')).toHaveValue('Australia');
    });

    test('should complete successful donation with default allocation', async ({ page }) => {
        // Select monthly donation
        await page.locator('label[for="donation-frequency-section--monthly"]').click();

        // Select $100 donation amount
        await page.locator('label[for="amount-section--donate-100"]').click();

        // Fill personal details
        await page.locator('#personal-details-section--first-name').fill('John');
        await page.locator('#personal-details-section--last-name').fill('Doe');
        await page.locator('#personal-details-section--email').fill('john.doe@example.com');
        await page.locator('#personal-details-section--postcode').fill('2000');

        // Select referral source
        await page.locator('#communications-section--referral-sources').selectOption('friend-family');

        // Submit form
        await page.locator('#donate-button-section--donate-button').click();

        // Should show loading state
        await expect(page.locator('#donate-button-section--donate-button')).toContainText('Processing...');

        // Wait for mock API call to complete and check for success
        await expect(page.locator('#thankyou-section')).toBeVisible({ timeout: 5000 });
        await expect(page.locator('h2')).toContainText('Thank you!');
    });
});

test.describe('Donation Portal - Allocation Types', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should switch between default and specific allocation', async ({ page }) => {
        // Initially amount section should be visible, specific allocation hidden
        await expect(page.locator('.amount-section')).toBeVisible();
        await expect(page.locator('.specific-allocation-section')).not.toBeVisible();

        // Switch to specific allocation
        await page.locator('label[for="allocation-section--specific-allocation"]').click();

        // Now specific allocation should be visible, amount section hidden
        await expect(page.locator('.amount-section')).not.toBeVisible();
        await expect(page.locator('.specific-allocation-section')).toBeVisible();

        // Should see charity options
        await expect(page.locator('#specific-allocation-section')).toContainText('Top Charities Fund');
        await expect(page.locator('#specific-allocation-section')).toContainText('Against Malaria Foundation');
        await expect(page.locator('#specific-allocation-section')).toContainText('GiveDirectly');

        // Switch back to default allocation
        await page.locator('label[for="allocation-section--default-allocation"]').click();

        // Amount section should be visible again
        await expect(page.locator('.amount-section')).toBeVisible();
        await expect(page.locator('.specific-allocation-section')).not.toBeVisible();
    });

    test('should complete donation with specific charity allocations', async ({ page }) => {
        // Switch to specific allocation
        await page.locator('label[for="allocation-section--specific-allocation"]').click();

        // Allocate to specific charities
        await page.locator('#against-malaria-foundation-amount').fill('50');
        await page.locator('#givedirectly-amount').fill('25');
        await page.locator('#unallocated-amount').fill('25'); // Top Charities Fund

        // Fill personal details
        await page.locator('#personal-details-section--first-name').fill('Jane');
        await page.locator('#personal-details-section--last-name').fill('Smith');
        await page.locator('#personal-details-section--email').fill('jane.smith@example.com');
        await page.locator('#personal-details-section--postcode').fill('3000');

        // Select referral source
        await page.locator('#communications-section--referral-sources').selectOption('social-media');

        // Check total amount section shows correct breakdown
        await expect(page.locator('.total-amount-section')).toContainText('Against Malaria Foundation');
        await expect(page.locator('.total-amount-section')).toContainText('GiveDirectly');
        await expect(page.locator('.total-amount-section')).toContainText('Top Charities Fund');

        // Submit form
        await page.locator('#donate-button-section--donate-button').click();

        // Should complete successfully
        await expect(page.locator('#thankyou-section')).toBeVisible({ timeout: 5000 });
    });
});

test.describe('Donation Portal - Form Validation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should show validation error for insufficient donation amount', async ({ page }) => {
        // Try to donate $1 (below minimum)
        await page.locator('#custom-amount-input').fill('1');

        // Fill required personal details
        await page.locator('#personal-details-section--first-name').fill('Test');
        await page.locator('#personal-details-section--last-name').fill('User');
        await page.locator('#personal-details-section--email').fill('test@example.com');
        await page.locator('#personal-details-section--postcode').fill('1000');

        // Try to submit
        await page.locator('#donate-button-section--donate-button').click();

        // Should show validation error
        page.on('dialog', async dialog => {
            expect(dialog.message()).toContain('Please select an amount of at least $2');
            await dialog.accept();
        });
    });

    test('should show validation error for missing personal details', async ({ page }) => {
        // Select valid donation amount
        await page.locator('label[for="amount-section--donate-50"]').click();

        // Leave personal details empty and try to submit
        await page.locator('#donate-button-section--donate-button').click();

        // Should show validation error
        page.on('dialog', async dialog => {
            expect(dialog.message()).toContain('Please fill in all required personal details');
            await dialog.accept();
        });
    });

    test('should show validation error for insufficient specific allocation', async ({ page }) => {
        // Switch to specific allocation
        await page.locator('label[for="allocation-section--specific-allocation"]').click();

        // Allocate only $1 total
        await page.locator('#against-malaria-foundation-amount').fill('1');

        // Fill personal details
        await page.locator('#personal-details-section--first-name').fill('Test');
        await page.locator('#personal-details-section--last-name').fill('User');
        await page.locator('#personal-details-section--email').fill('test@example.com');
        await page.locator('#personal-details-section--postcode').fill('1000');

        // Try to submit
        await page.locator('#donate-button-section--donate-button').click();

        // Should show validation error
        page.on('dialog', async dialog => {
            expect(dialog.message()).toContain('Please allocate at least $2 across your preferred charities');
            await dialog.accept();
        });
    });

    test('should validate email format', async ({ page }) => {
        // Fill invalid email
        await page.locator('#personal-details-section--email').fill('invalid-email');

        // Check HTML5 validation
        const emailInput = page.locator('#personal-details-section--email');
        await expect(emailInput).toHaveAttribute('type', 'email');

        // Browser should show validation message on form submit
        await page.locator('label[for="amount-section--donate-50"]').click();
        await page.locator('#personal-details-section--first-name').fill('Test');
        await page.locator('#personal-details-section--last-name').fill('User');
        await page.locator('#personal-details-section--postcode').fill('1000');

        await page.locator('#donate-button-section--donate-button').click();

        // Check if email field is invalid
        const isValid = await emailInput.evaluate((input: HTMLInputElement) => input.validity.valid);
        expect(isValid).toBe(false);
    });
});

test.describe('Donation Portal - Interactive Features', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should update tip calculation when donation amount changes', async ({ page }) => {
        // Select $100 donation
        await page.locator('label[for="amount-section--donate-100"]').click();

        // Check that total includes 10% tip (default)
        await expect(page.locator('.total-amount-section')).toContainText('$110.00'); // $100 + $10 tip

        // Change to $200 custom amount
        await page.locator('#custom-amount-input').fill('200');

        // Total should update to include 10% of new amount
        await expect(page.locator('.total-amount-section')).toContainText('$220.00'); // $200 + $20 tip

        // Change tip to 20%
        await page.locator('label[for="amplify-impact-section--amount-20"]').click();

        // Total should update
        await expect(page.locator('.total-amount-section')).toContainText('$240.00'); // $200 + $40 tip
    });

    test('should handle custom tip amounts', async ({ page }) => {
        // Select $100 donation
        await page.locator('label[for="amount-section--donate-100"]').click();

        // Enter custom tip amount
        await page.locator('#amplify-impact-section--custom-amount-input').fill('15');

        // Total should include custom tip
        await expect(page.locator('.total-amount-section')).toContainText('$115.00'); // $100 + $15 tip
    });

    test('should show amplify impact popover', async ({ page }) => {
        // Click the info button
        await page.locator('.more-info-button').click();

        // Popover should be visible
        await expect(page.locator('.popover.open')).toBeVisible();
        await expect(page.locator('.popover.open')).toContainText('EA Australia helps introduce more people');

        // Click outside the popover to close it
        await page.mouse.click(50, 50); // Click in top-left corner

        // Popover should be hidden
        await expect(page.locator('.popover.open')).not.toBeVisible();
    });

    test('should show bank transfer message when selected', async ({ page }) => {
        // Initially bank transfer message should be hidden
        await expect(page.locator('#payment-method-section--bank-details-message')).not.toBeVisible();

        // Select bank transfer
        await page.locator('label[for="payment-method-section--bank-transfer"]').click();

        // Message should now be visible
        await expect(page.locator('#payment-method-section--bank-details-message')).toBeVisible();
        await expect(page.locator('#payment-method-section--bank-details-message')).toContainText('After you submit this form');

        // Switch back to credit card
        await page.locator('label[for="payment-method-section--credit-card"]').click();

        // Message should be hidden again
        await expect(page.locator('#payment-method-section--bank-details-message')).not.toBeVisible();
    });

    test('should handle communication preferences', async ({ page }) => {
        // Initially updates should be checked, others unchecked
        await expect(page.locator('#communications-section--subscribe-to-updates')).toBeChecked();
        await expect(page.locator('#communications-section--subscribe-to-newsletter')).not.toBeChecked();
        await expect(page.locator('#communications-section--connect-to-community')).not.toBeChecked();

        // Toggle preferences
        await page.locator('label').filter({ has: page.locator('#communications-section--subscribe-to-updates') }).click();
        await page.locator('label').filter({ has: page.locator('#communications-section--subscribe-to-newsletter') }).click();
        await page.locator('label').filter({ has: page.locator('#communications-section--connect-to-community') }).click();

        // Check new states
        await expect(page.locator('#communications-section--subscribe-to-updates')).not.toBeChecked();
        await expect(page.locator('#communications-section--subscribe-to-newsletter')).toBeChecked();
        await expect(page.locator('#communications-section--connect-to-community')).toBeChecked();
    });
});

test.describe('Donation Portal - Mobile Responsiveness', () => {
    test('should work correctly on mobile devices', async ({ page, isMobile }) => {
        test.skip(!isMobile, 'This test only runs on mobile');

        await page.goto('/');

        // Check that form is usable on mobile
        await expect(page.locator('.donation-form-host')).toBeVisible();

        // Test form interaction on mobile
        await page.locator('label[for="donation-frequency-section--monthly"]').click();
        await page.locator('label[for="amount-section--donate-50"]').click();

        // Fill form fields
        await page.locator('#personal-details-section--first-name').fill('Mobile');
        await page.locator('#personal-details-section--last-name').fill('User');
        await page.locator('#personal-details-section--email').fill('mobile@example.com');
        await page.locator('#personal-details-section--postcode').fill('2000');

        // Check that speech bubble adapts to mobile
        await expect(page.locator('.speech-bubble')).toBeVisible();

        // Submit should work
        await page.locator('#donate-button-section--donate-button').click();
        await expect(page.locator('#thankyou-section')).toBeVisible({ timeout: 5000 });
    });
});

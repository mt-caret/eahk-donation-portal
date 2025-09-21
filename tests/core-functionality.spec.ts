import { test, expect } from '@playwright/test';
import { DonationFormHelper } from './utils/test-helpers';

test.describe('Donation Portal - Core Functionality', () => {
    let formHelper: DonationFormHelper;

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        formHelper = new DonationFormHelper(page);
    });

    test('should complete basic donation with default allocation', async ({ page }) => {
        await formHelper.completeBasicDonation({
            amount: 100,
            personalDetails: {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                postcode: '2000'
            }
        });

        await formHelper.expectSuccessfulSubmission();
    });

    test('should complete donation with specific charity allocations', async ({ page }) => {
        await formHelper.selectSpecificCharityAllocations({
            'against-malaria-foundation': 50,
            'givedirectly': 30,
            'unallocated': 20
        });

        await formHelper.fillBasicPersonalDetails({
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com'
        });

        await formHelper.selectReferralSource('friend-family');
        await formHelper.submitForm();
        await formHelper.expectSuccessfulSubmission();
    });

    test('should validate minimum donation amount', async ({ page }) => {
        await formHelper.fillBasicPersonalDetails();
        await formHelper.selectDonationAmount('custom', 1); // Below minimum
        await formHelper.selectTipAmount('percentage', 0); // No tip

        page.once('dialog', async dialog => {
            expect(dialog.message()).toContain('Please select an amount of at least $2');
            await dialog.accept();
        });
        await formHelper.submitForm();
    });

    test('should validate required personal details', async ({ page }) => {
        await formHelper.selectDonationAmount(50);
        // Don't fill personal details

        page.once('dialog', async dialog => {
            expect(dialog.message()).toContain('Please fill in all required personal details');
            await dialog.accept();
        });
        await formHelper.submitForm();
    });

    test('should switch between allocation types', async ({ page }) => {
        // Start with default allocation - amount section should be visible
        await expect(page.locator('#amount-section')).toBeVisible();
        await expect(page.locator('#specific-allocation-section')).not.toBeVisible();

        // Switch to specific allocation
        await page.locator('label[for="allocation-section--specific-allocation"]').click();
        await expect(page.locator('#amount-section')).not.toBeVisible();
        await expect(page.locator('#specific-allocation-section')).toBeVisible();

        // Switch back to default
        await page.locator('label[for="allocation-section--default-allocation"]').click();
        await expect(page.locator('#amount-section')).toBeVisible();
        await expect(page.locator('#specific-allocation-section')).not.toBeVisible();
    });

    test('should calculate tip amounts correctly', async ({ page }) => {
        // Set $100 donation
        await formHelper.selectDonationAmount(100);

        // Default 10% tip should show $110 total
        await expect(page.locator('#total-amount-section')).toContainText('$110.00');

        // Change to 20% tip
        await formHelper.selectTipAmount('percentage', 20);
        await expect(page.locator('#total-amount-section')).toContainText('$120.00');

        // Change to custom $15 tip
        await formHelper.selectTipAmount('custom', 15);
        await expect(page.locator('#total-amount-section')).toContainText('$115.00');
    });

    test('should handle monthly vs one-time donations', async ({ page }) => {
        await formHelper.selectDonationAmount(100);

        // Switch to monthly
        await page.locator('label[for="donation-frequency-section--monthly"]').click();
        await expect(page.locator('#total-amount-section')).toContainText('(each month)');

        // Switch back to one-time
        await page.locator('label[for="donation-frequency-section--one-time"]').click();
        await expect(page.locator('#total-amount-section')).not.toContainText('(each month)');
    });

    test('should show bank transfer message when selected', async ({ page }) => {
        // Initially message should be hidden
        await expect(page.locator('#payment-method-section--bank-details-message')).not.toBeVisible();

        // Select bank transfer
        await page.locator('label[for="payment-method-section--bank-transfer"]').click();
        await expect(page.locator('#payment-method-section--bank-details-message')).toBeVisible();

        // Switch back to credit card
        await page.locator('label[for="payment-method-section--credit-card"]').click();
        await expect(page.locator('#payment-method-section--bank-details-message')).not.toBeVisible();
    });

    test('should handle communication preferences', async ({ page }) => {
        // Test toggling checkboxes
        const updatesCheckbox = page.locator('#communications-section--subscribe-to-updates');
        const newsletterCheckbox = page.locator('#communications-section--subscribe-to-newsletter');

        // Initially updates should be checked, newsletter unchecked
        await expect(updatesCheckbox).toBeChecked();
        await expect(newsletterCheckbox).not.toBeChecked();

        // Toggle preferences
        await page.locator('label').filter({ has: updatesCheckbox }).click();
        await page.locator('label').filter({ has: newsletterCheckbox }).click();

        // Check new states
        await expect(updatesCheckbox).not.toBeChecked();
        await expect(newsletterCheckbox).toBeChecked();
    });

    test('should show amplify impact information popover', async ({ page }) => {
        // Click info button
        await page.locator('.more-info-button').click();

        // Popover should be visible with content
        await expect(page.locator('.popover.open')).toBeVisible();
        await expect(page.locator('.popover.open')).toContainText('EA Australia helps introduce more people');

        // Click outside to close
        await page.mouse.click(50, 50);
        await expect(page.locator('.popover.open')).not.toBeVisible();
    });
});

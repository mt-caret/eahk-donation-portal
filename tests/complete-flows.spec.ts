import { test, expect } from '@playwright/test';
import { DonationFormHelper, calculateTotalWithTip, formatCurrency } from './utils/test-helpers';

test.describe('Donation Portal - Complete User Flows', () => {
    let formHelper: DonationFormHelper;

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        formHelper = new DonationFormHelper(page);
    });

    test('Complete donation flow - Default allocation, Credit Card', async ({ page }) => {
        await formHelper.completeBasicDonation({
            frequency: 'monthly',
            amount: 250,
            tipPercentage: 20,
            personalDetails: {
                firstName: 'Alice',
                lastName: 'Johnson',
                email: 'alice.johnson@example.com',
                postcode: '2000'
            }
        });

        await formHelper.expectSuccessfulSubmission();
        await expect(page.locator('#thankyou-section h2')).toContainText('Thank you!');
    });

    test('Complete donation flow - Specific allocation, Bank Transfer', async ({ page }) => {
        // Set up specific charity allocations
        await formHelper.selectSpecificCharityAllocations({
            'against-malaria-foundation': 100,
            'givedirectly': 75,
            'unallocated': 25 // Top Charities Fund
        });

        // Set custom tip
        await formHelper.selectTipAmount('custom', 30);

        // Fill personal details
        await formHelper.fillBasicPersonalDetails({
            firstName: 'Bob',
            lastName: 'Smith',
            email: 'bob.smith@example.com',
            postcode: '3000'
        });

        // Set communication preferences
        await formHelper.setCommunicationPreferences({
            subscribeToUpdates: true,
            subscribeToNewsletter: true,
            connectToCommunity: true
        });

        // Select referral source
        await formHelper.selectReferralSource('social-media');

        // Select bank transfer
        await formHelper.selectPaymentMethod('bank-transfer');

        // Check total amount
        const expectedTotal = formatCurrency(200 + 30); // $200 donation + $30 tip
        await formHelper.expectTotalAmount(expectedTotal);

        // Submit form
        await formHelper.submitForm();

        // Should show loading and then alert for bank transfer
        await expect(page.locator('#donate-button-section--donate-button')).toContainText('Processing...');

        // Mock bank transfer flow would show instructions
        page.on('dialog', async dialog => {
            expect(dialog.message()).toContain('Bank transfer instructions would be shown here');
            await dialog.accept();
        });
    });

    test('Complete donation flow - Maximum amounts and edge cases', async ({ page }) => {
        // Test with large donation amount
        await formHelper.selectDonationAmount('custom', 50000);

        // Set maximum tip percentage
        await formHelper.selectTipAmount('percentage', 30);

        // Fill personal details with special characters
        await formHelper.fillBasicPersonalDetails({
            firstName: "Mary-Jane",
            lastName: "O'Connor",
            email: 'mary.jane+test@example-domain.co.uk',
            postcode: '4000'
        });

        // Select different country
        await page.locator('#personal-details-section--country').selectOption('Canada');

        // Set all communication preferences
        await formHelper.setCommunicationPreferences({
            subscribeToUpdates: true,
            subscribeToNewsletter: true,
            connectToCommunity: true
        });

        // Select referral source
        await formHelper.selectReferralSource('podcast');

        // Check calculated total
        const expectedTotal = calculateTotalWithTip(50000, 30);
        await formHelper.expectTotalAmount(formatCurrency(expectedTotal));

        // Submit form
        await formHelper.submitForm();
        await formHelper.expectSuccessfulSubmission();
    });

    test('Complete donation flow - Minimum valid amounts', async ({ page }) => {
        // Fill required personal details first
        await formHelper.fillBasicPersonalDetails({
            firstName: 'Min',
            lastName: 'User'
        });

        // Test with amount below minimum ($1.50 with 0% tip = $1.50 < $2)
        await formHelper.selectDonationAmount('custom', 1.50);
        await formHelper.selectTipAmount('percentage', 0);

        // This should fail validation (under $2)
        page.once('dialog', async dialog => {
            expect(dialog.message()).toContain('Please select an amount of at least $2');
            await dialog.accept();
        });
        await formHelper.submitForm();

        // Increase to meet minimum
        await formHelper.selectDonationAmount('custom', 2.00);

        // Should now succeed
        await formHelper.submitForm();
        await formHelper.expectSuccessfulSubmission();
    });

    test('Complete donation flow - Multiple charity allocations with complex calculations', async ({ page }) => {
        // Switch to specific allocation
        await page.locator('label[for="allocation-section--specific-allocation"]').click();

        // Add multiple small amounts that sum to valid total
        const charityAllocations = {
            'against-malaria-foundation': 15.50,
            'givedirectly': 8.25,
            'helen-keller-international': 12.75,
            'malaria-consortium': 20.00,
            'new-incentives': 5.50,
            'unallocated': 38.00 // Top Charities Fund
        };

        for (const [charityId, amount] of Object.entries(charityAllocations)) {
            await page.locator(`#${charityId}-amount`).fill(amount.toString());
        }

        // Set custom tip amount
        await formHelper.selectTipAmount('custom', 15.75);

        // Fill personal details
        await formHelper.fillBasicPersonalDetails({
            firstName: 'Complex',
            lastName: 'Donor',
            email: 'complex@donor.org'
        });

        // Check that total is calculated correctly
        const donationTotal = Object.values(charityAllocations).reduce((sum, amount) => sum + amount, 0);
        const totalWithTip = donationTotal + 15.75;
        await formHelper.expectTotalAmount(formatCurrency(totalWithTip));

        // Verify individual charity amounts are shown in summary
        await expect(page.locator('.total-amount-section')).toContainText('Against Malaria Foundation');
        await expect(page.locator('.total-amount-section')).toContainText('GiveDirectly');
        await expect(page.locator('.total-amount-section')).toContainText('Top Charities Fund');

        // Submit form
        await formHelper.submitForm();
        await formHelper.expectSuccessfulSubmission();
    });

    test('Complete donation flow - Monthly recurring with all options', async ({ page }) => {
        // Select monthly donation
        await page.locator('label[for="donation-frequency-section--monthly"]').click();

        // Select preset amount
        await formHelper.selectDonationAmount(500);

        // Set high tip percentage
        await formHelper.selectTipAmount('percentage', 30);

        // Fill comprehensive personal details
        await formHelper.fillBasicPersonalDetails({
            firstName: 'Recurring',
            lastName: 'Donor',
            email: 'recurring@monthly.com',
            postcode: '5000'
        });

        // Select different country
        await page.locator('#personal-details-section--country').selectOption('New Zealand');

        // Set communication preferences
        await formHelper.setCommunicationPreferences({
            subscribeToUpdates: true,
            subscribeToNewsletter: true,
            connectToCommunity: false
        });

        // Select referral source
        await formHelper.selectReferralSource('newsletter');

        // Check that monthly is indicated in total
        await expect(page.locator('.total-amount-section')).toContainText('(each month)');

        // Check total calculation
        const expectedTotal = calculateTotalWithTip(500, 30);
        await formHelper.expectTotalAmount(formatCurrency(expectedTotal));

        // Submit form
        await formHelper.submitForm();
        await formHelper.expectSuccessfulSubmission();

        // Check thank you message
        await expect(page.locator('#thankyou-section')).toContainText('Your receipt will be sent to your email address');
        await expect(page.getByRole('link', { name: 'Take Our 60 Second Survey' })).toBeVisible();
    });

    test('Complete donation flow - Form recovery after validation errors', async ({ page }) => {
        // Start with invalid data
        await formHelper.selectDonationAmount('custom', 1); // Too low

        // Try to submit with missing details - should get amount error first
        page.once('dialog', async dialog => {
            expect(dialog.message()).toContain('Please select an amount of at least $2');
            await dialog.accept();
        });
        await formHelper.submitForm();

        // Fix amount but leave personal details empty
        await formHelper.selectDonationAmount('custom', 50);
        page.once('dialog', async dialog => {
            expect(dialog.message()).toContain('Please fill in all required personal details');
            await dialog.accept();
        });
        await formHelper.submitForm();

        // Fill some but not all personal details
        await page.locator('#personal-details-section--first-name').fill('Recovery');
        await page.locator('#personal-details-section--email').fill('invalid-email'); // Invalid format
        await formHelper.submitForm();

        // Should catch email validation
        const emailInput = page.locator('#personal-details-section--email');
        const isValid = await emailInput.evaluate((input: HTMLInputElement) => input.validity.valid);
        expect(isValid).toBe(false);

        // Fix all issues
        await formHelper.fillBasicPersonalDetails({
            firstName: 'Recovery',
            lastName: 'User',
            email: 'recovery@fixed.com'
        });

        // Should now succeed
        await formHelper.submitForm();
        await formHelper.expectSuccessfulSubmission();
    });

});

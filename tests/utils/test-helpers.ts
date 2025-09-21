import { Page, expect } from '@playwright/test';

export class DonationFormHelper {
    constructor(private page: Page) { }

    async fillBasicPersonalDetails(data: {
        firstName?: string;
        lastName?: string;
        email?: string;
        postcode?: string;
        country?: string;
    } = {}) {
        const {
            firstName = 'Test',
            lastName = 'User',
            email = 'test@example.com',
            postcode = '1000',
            country = 'Australia'
        } = data;

        await this.page.locator('#personal-details-section--first-name').fill(firstName);
        await this.page.locator('#personal-details-section--last-name').fill(lastName);
        await this.page.locator('#personal-details-section--email').fill(email);
        await this.page.locator('#personal-details-section--postcode').fill(postcode);

        if (country !== 'Australia') {
            await this.page.locator('#personal-details-section--country').selectOption(country);
        }
    }

    async selectDonationAmount(amount: number | 'custom', customAmount?: number) {
        if (amount === 'custom') {
            await this.page.locator('#custom-amount-input').fill(customAmount?.toString() || '100');
        } else {
            await this.page.locator(`label[for="amount-section--donate-${amount}"]`).click();
        }
    }

    async selectSpecificCharityAllocations(allocations: Record<string, number>) {
        // Switch to specific allocation first
        await this.page.locator('label[for="allocation-section--specific-allocation"]').click();

        for (const [charityId, amount] of Object.entries(allocations)) {
            await this.page.locator(`#${charityId}-amount`).fill(amount.toString());
        }
    }

    async selectTipAmount(type: 'percentage' | 'custom', amount: number) {
        if (type === 'percentage') {
            await this.page.locator(`label[for="amplify-impact-section--amount-${amount}"]`).click();
        } else {
            await this.page.locator('#amplify-impact-section--custom-amount-input').fill(amount.toString());
        }
    }

    async selectReferralSource(source: string) {
        await this.page.locator('#communications-section--referral-sources').selectOption(source);
    }

    async setCommunicationPreferences(preferences: {
        subscribeToUpdates?: boolean;
        subscribeToNewsletter?: boolean;
        connectToCommunity?: boolean;
    }) {
        if (preferences.subscribeToUpdates !== undefined) {
            const checkbox = this.page.locator('#communications-section--subscribe-to-updates');
            const isChecked = await checkbox.isChecked();
            if (isChecked !== preferences.subscribeToUpdates) {
                await this.page.locator('label').filter({ has: checkbox }).click();
            }
        }

        if (preferences.subscribeToNewsletter !== undefined) {
            const checkbox = this.page.locator('#communications-section--subscribe-to-newsletter');
            const isChecked = await checkbox.isChecked();
            if (isChecked !== preferences.subscribeToNewsletter) {
                await this.page.locator('label').filter({ has: checkbox }).click();
            }
        }

        if (preferences.connectToCommunity !== undefined) {
            const checkbox = this.page.locator('#communications-section--connect-to-community');
            const isChecked = await checkbox.isChecked();
            if (isChecked !== preferences.connectToCommunity) {
                await this.page.locator('label').filter({ has: checkbox }).click();
            }
        }
    }

    async selectPaymentMethod(method: 'credit-card' | 'bank-transfer') {
        await this.page.locator(`label[for="payment-method-section--${method}"]`).click();
    }

    async submitForm() {
        await this.page.locator('#donate-button-section--donate-button').click();
    }

    async expectTotalAmount(expectedTotal: string) {
        await expect(this.page.locator('.total-amount-section')).toContainText(expectedTotal);
    }

    async expectValidationError(errorMessage: string) {
        this.page.on('dialog', async dialog => {
            expect(dialog.message()).toContain(errorMessage);
            await dialog.accept();
        });
    }

    async expectSuccessfulSubmission() {
        await expect(this.page.locator('#thankyou-section')).toBeVisible({ timeout: 5000 });
    }

    async completeBasicDonation(options: {
        frequency?: 'one-time' | 'monthly';
        amount?: number;
        tipPercentage?: number;
        personalDetails?: {
            firstName?: string;
            lastName?: string;
            email?: string;
            postcode?: string;
        };
        paymentMethod?: 'credit-card' | 'bank-transfer';
    } = {}) {
        const {
            frequency = 'one-time',
            amount = 100,
            tipPercentage = 10,
            personalDetails = {},
            paymentMethod = 'credit-card'
        } = options;

        // Select frequency
        if (frequency === 'monthly') {
            await this.page.locator('label[for="donation-frequency-section--monthly"]').click();
        }

        // Select amount
        await this.selectDonationAmount(amount);

        // Set tip if different from default
        if (tipPercentage !== 10) {
            await this.selectTipAmount('percentage', tipPercentage);
        }

        // Fill personal details
        await this.fillBasicPersonalDetails(personalDetails);

        // Select referral source
        await this.selectReferralSource('friend-family');

        // Select payment method if different from default
        if (paymentMethod !== 'credit-card') {
            await this.selectPaymentMethod(paymentMethod);
        }

        // Submit form
        await this.submitForm();
    }
}

export const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('en-AU', {
        style: 'currency',
        currency: 'AUD',
    });
};

export const calculateTotalWithTip = (donationAmount: number, tipPercentage: number): number => {
    const tipAmount = donationAmount * (tipPercentage / 100);
    return donationAmount + tipAmount;
};

export const waitForFormToLoad = async (page: Page) => {
    await expect(page.locator('.donation-form-host')).toBeVisible();
    await expect(page.locator('#donation-frequency-section')).toBeVisible();
    await expect(page.locator('#donate-button-section--donate-button')).toBeVisible();
};

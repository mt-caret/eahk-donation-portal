export interface Charity {
    slug_id: string;
    name: string;
    category: string;
    thumbnail?: string;
    is_eaae: boolean;
}

export interface FormData {
    donationFrequency: 'one-time' | 'monthly';
    allocationType: 'default' | 'specific';
    basicDonationAmount: number;
    specificAllocations: Record<string, number>;
    tipType: 'percentage' | 'dollar';
    tipSize: number;
    tipDollarAmount: number;
    firstName: string;
    lastName: string;
    email: string;
    postcode: string;
    country: string;
    paymentMethod: 'credit-card' | 'bank-transfer';
    subscribeToUpdates: boolean;
    subscribeToNewsletter: boolean;
    connectToCommunity: boolean;
    howDidYouHearAboutUs: string;
}

export interface ReferralSource {
    value: string;
    label: string;
}

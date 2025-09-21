import { useState, useCallback, useEffect } from 'react';
import { FormData } from '../types';
import { mockCharities } from '../mockData';

const initialFormData: FormData = {
    donationFrequency: 'one-time',
    allocationType: 'default',
    basicDonationAmount: 0,
    specificAllocations: {},
    tipType: 'percentage',
    tipSize: 10,
    tipDollarAmount: 0,
    firstName: '',
    lastName: '',
    email: '',
    postcode: '',
    country: 'Australia',
    paymentMethod: 'credit-card',
    subscribeToUpdates: true,
    subscribeToNewsletter: false,
    connectToCommunity: false,
    howDidYouHearAboutUs: ''
};

export const useFormState = () => {
    const [formData, setFormData] = useState<FormData>(() => {
        // Initialize specific allocations for all charities
        const specificAllocations: Record<string, number> = {};
        mockCharities.forEach(charity => {
            specificAllocations[charity.slug_id] = 0;
        });

        return {
            ...initialFormData,
            specificAllocations
        };
    });

    const updateFormData = useCallback((updates: Partial<FormData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    }, []);

    // Auto-update tip dollar amount when relevant values change
    useEffect(() => {
        const totalDonationAmount = formData.allocationType === 'specific'
            ? Object.values(formData.specificAllocations).reduce((sum, amount) => sum + amount, 0)
            : formData.basicDonationAmount;

        let tipDollarAmount = 0;
        if (formData.tipType === 'percentage') {
            tipDollarAmount = totalDonationAmount * (formData.tipSize / 100);
        } else {
            tipDollarAmount = formData.tipSize;
        }

        if (tipDollarAmount !== formData.tipDollarAmount) {
            setFormData(prev => ({ ...prev, tipDollarAmount }));
        }
    }, [formData.allocationType, formData.specificAllocations, formData.basicDonationAmount, formData.tipType, formData.tipSize, formData.tipDollarAmount]);

    const setDonationFrequency = useCallback((frequency: 'one-time' | 'monthly') => {
        updateFormData({ donationFrequency: frequency });
    }, [updateFormData]);

    const setAllocationType = useCallback((type: 'default' | 'specific') => {
        updateFormData({ allocationType: type });
    }, [updateFormData]);

    const setBasicDonationAmount = useCallback((amount: number) => {
        updateFormData({ basicDonationAmount: amount });
    }, [updateFormData]);

    const setCharityAllocation = useCallback((charityId: string, amount: number) => {
        setFormData(prev => ({
            ...prev,
            specificAllocations: {
                ...prev.specificAllocations,
                [charityId]: amount
            }
        }));
    }, []);

    const setTipValues = useCallback((amount: number, type: 'percentage' | 'dollar') => {
        updateFormData({ tipSize: amount, tipType: type });
    }, [updateFormData]);

    const getSpecificAllocationsTotal = useCallback(() => {
        return Object.values(formData.specificAllocations).reduce((sum, amount) => sum + amount, 0);
    }, [formData.specificAllocations]);

    return {
        formData,
        updateFormData,
        setDonationFrequency,
        setAllocationType,
        setBasicDonationAmount,
        setCharityAllocation,
        setTipValues,
        getSpecificAllocationsTotal
    };
};

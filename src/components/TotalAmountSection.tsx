import React from 'react';
import { FormData, Charity } from '../types';

interface TotalAmountSectionProps {
    formData: FormData;
    charities: Charity[];
}

export const TotalAmountSection: React.FC<TotalAmountSectionProps> = ({
    formData,
    charities
}) => {
    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('en-AU', {
            style: 'currency',
            currency: 'AUD',
        });
    };

    const buildBasicAllocationTable = () => {
        const { basicDonationAmount, tipDollarAmount, tipType, tipSize, donationFrequency } = formData;
        const isMonthly = donationFrequency === 'monthly';
        const amplifyPercentage = tipType === 'percentage' ? `(+${tipSize}%)` : '';
        const combinedTotal = basicDonationAmount + tipDollarAmount;

        return (
            <table>
                <tbody>
                    <tr>
                        <td><h2 className="text-lg mt-8">Summary</h2></td>
                        <td><h2 className="text-lg mt-8">Amount</h2></td>
                    </tr>
                    <tr>
                        <td>The most effective charities</td>
                        <td>{formatCurrency(basicDonationAmount)}</td>
                    </tr>
                    <tr>
                        <td>Help grow EA Australia's work {amplifyPercentage}</td>
                        <td>{formatCurrency(tipDollarAmount)}</td>
                    </tr>
                    <tr>
                        <td>
                            <div className='total-donation'>
                                TOTAL DONATION {isMonthly ? '(each month)' : ''}
                            </div>
                            <br />
                            <div className='tax-deductible'>100% tax deductible</div>
                        </td>
                        <td>{formatCurrency(combinedTotal)}</td>
                    </tr>
                </tbody>
            </table>
        );
    };

    const buildSpecificAllocationTable = () => {
        const { specificAllocations, tipDollarAmount, tipType, tipSize, donationFrequency } = formData;
        const isMonthly = donationFrequency === 'monthly';

        const amplifyPercentage = tipType === 'percentage' ? `(${tipSize}%)` : '';

        // Create a lookup table for charity names
        const charityNameLookup: Record<string, string> = {};
        charities.forEach(charity => {
            charityNameLookup[charity.slug_id] = charity.name;
        });

        // Calculate the total donation amount
        let combinedTotal = 0;
        for (const charity in specificAllocations) {
            combinedTotal += specificAllocations[charity] || 0;
        }
        combinedTotal = combinedTotal + tipDollarAmount;

        return (
            <table>
                <tbody>
                    <tr>
                        <td><h2 className="text-lg mt-8">Summary</h2></td>
                        <td><h2 className="text-lg mt-8">Amount</h2></td>
                    </tr>
                    {Object.entries(specificAllocations).map(([charitySlug, amount]) => {
                        const charityAmount = amount || 0;
                        if (charityAmount === 0) return null;
                        return (
                            <tr key={charitySlug}>
                                <td>{charityNameLookup[charitySlug]}</td>
                                <td>{formatCurrency(charityAmount)}</td>
                            </tr>
                        );
                    })}
                    <tr>
                        <td>Effective Altruism Australia {amplifyPercentage}</td>
                        <td>{formatCurrency(tipDollarAmount)}</td>
                    </tr>
                    <tr>
                        <td>
                            <div className='total-donation'>
                                TOTAL DONATION {isMonthly ? '(each month)' : ''}
                            </div>
                            <br />
                            <div className='tax-deductible'>100% tax deductible</div>
                        </td>
                        <td>{formatCurrency(combinedTotal)}</td>
                    </tr>
                </tbody>
            </table>
        );
    };

    return (
        <section id="total-amount-section" className="total-amount-section">
            {formData.allocationType === 'specific'
                ? buildSpecificAllocationTable()
                : buildBasicAllocationTable()
            }
        </section>
    );
};

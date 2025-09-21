import React from 'react';
import { Charity } from '../types';

interface SpecificAllocationSectionProps {
    charities: Charity[];
    allocations: Record<string, number>;
    onAllocationChange: (charityId: string, amount: number) => void;
    isVisible: boolean;
}

export const SpecificAllocationSection: React.FC<SpecificAllocationSectionProps> = ({
    charities,
    allocations,
    onAllocationChange,
    isVisible
}) => {
    if (!isVisible) return null;

    // Group charities by category
    const categories = {
        'Our top recommended charities & funds': [] as Charity[],
        'Other charities we support': [] as Charity[]
    };

    charities.forEach(charity => {
        if (charity.category === 'Our recommended charities') {
            categories['Our top recommended charities & funds'].push(charity);
        } else {
            categories['Other charities we support'].push(charity);
        }
    });

    // Sort charities to put funds at the top
    Object.keys(categories).forEach(category => {
        if (category === 'Our top recommended charities & funds') {
            const fundNames = ['Top Charities Fund', 'All Grants Fund'];
            const regularCharities = categories[category].filter(charity => !fundNames.includes(charity.name));
            const funds = categories[category].filter(charity => fundNames.includes(charity.name));
            categories[category] = [...funds.reverse(), ...regularCharities];
        }
    });

    const handleAllocationChange = (charityId: string, value: string) => {
        const amount = parseFloat(value) || 0;
        onAllocationChange(charityId, amount);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.classList.add('validate');
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.target.value === '') {
            e.target.classList.remove('validate');
        }
    };

    return (
        <section className="specific-allocation-section">
            {Object.entries(categories).map(([categoryName, categoryCharities]) => (
                <div key={categoryName}>
                    <h3>
                        {categoryName}
                        <sup>
                            <a href="https://effectivealtruism.org.au/inclusion-criteria/">ⓘ</a>
                        </sup>
                    </h3>

                    {categoryCharities.map(charity => {
                        const charityName = (charity.name === 'Top Charities Fund' || charity.name === 'All Grants Fund')
                            ? <i>{charity.name}</i>
                            : <span>{charity.name}</span>;

                        return (
                            <div key={charity.slug_id} className="flex charity-option">
                                <label htmlFor={charity.slug_id}>{charityName}</label>
                                <span className="flex items-center rounded-sm p-2 text-md border focus-outline">
                                    $
                                    <input
                                        type="number"
                                        inputMode="numeric"
                                        min="0"
                                        max="999999.99"
                                        step="0.01"
                                        id={`${charity.slug_id}-amount`}
                                        name={`${charity.slug_id}-amount`}
                                        className="specific-charity inline-block text-md"
                                        value={allocations[charity.slug_id] || ''}
                                        onChange={(e) => handleAllocationChange(charity.slug_id, e.target.value)}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        style={{ border: 'none', outline: 'none', width: '100%' }}
                                    />
                                </span>
                            </div>
                        );
                    })}
                </div>
            ))}
        </section>
    );
};

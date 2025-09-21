import React from 'react';

interface DonationFrequencySectionProps {
    frequency: 'one-time' | 'monthly';
    onFrequencyChange: (frequency: 'one-time' | 'monthly') => void;
}

export const DonationFrequencySection: React.FC<DonationFrequencySectionProps> = ({
    frequency,
    onFrequencyChange
}) => {
    return (
        <section id="donation-frequency-section">
            <h2 className="text-lg">I would like to give</h2>

            <div className="radio-group flex gap-2 mb-4">
                <input
                    type="radio"
                    id="donation-frequency-section--one-time"
                    name="donation-frequency-section--frequency"
                    value="one-time"
                    checked={frequency === 'one-time'}
                    onChange={(e) => onFrequencyChange(e.target.value as 'one-time' | 'monthly')}
                />
                <label htmlFor="donation-frequency-section--one-time" className="rounded-full text-blue">
                    One time
                </label>

                <input
                    type="radio"
                    id="donation-frequency-section--monthly"
                    name="donation-frequency-section--frequency"
                    value="monthly"
                    checked={frequency === 'monthly'}
                    onChange={(e) => onFrequencyChange(e.target.value as 'one-time' | 'monthly')}
                />
                <label htmlFor="donation-frequency-section--monthly" className="rounded-full text-blue">
                    Monthly
                </label>
            </div>

            <div className="speech-bubble">
                Giving regularly has a greater impact
            </div>
        </section>
    );
};

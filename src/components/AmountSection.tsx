import React, { useState } from 'react';

interface AmountSectionProps {
    basicDonationAmount: number;
    onAmountChange: (amount: number) => void;
    isVisible: boolean;
}

export const AmountSection: React.FC<AmountSectionProps> = ({
    basicDonationAmount,
    onAmountChange,
    isVisible
}) => {
    const [customAmount, setCustomAmount] = useState('');
    const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
    const [showValidation, setShowValidation] = useState(false);

    if (!isVisible) return null;

    const handlePresetAmountChange = (amount: number) => {
        setSelectedPreset(amount);
        setCustomAmount('');
        setShowValidation(false);
        onAmountChange(amount);
    };

    const handleCustomAmountChange = (value: string) => {
        setCustomAmount(value);
        setSelectedPreset(null);
        const numericValue = parseFloat(value) || 0;
        onAmountChange(numericValue);
    };

    const handleCustomAmountFocus = () => {
        setShowValidation(true);
        setSelectedPreset(null);
    };

    const handleCustomAmountBlur = () => {
        if (customAmount === '') {
            setShowValidation(false);
        }
    };

    return (
        <section id="amount-section" className="amount-section">
            <h2 className="text-lg mt-8">I would like to gift</h2>
            <div className="radio-group flex gap-2">
                <input
                    type="radio"
                    id="amount-section--donate-50"
                    name="donation-amount"
                    value="50"
                    checked={selectedPreset === 50}
                    onChange={() => handlePresetAmountChange(50)}
                />
                <label htmlFor="amount-section--donate-50" className="rounded-full text-blue larger-button">$50</label>

                <input
                    type="radio"
                    id="amount-section--donate-100"
                    name="donation-amount"
                    value="100"
                    checked={selectedPreset === 100}
                    onChange={() => handlePresetAmountChange(100)}
                />
                <label htmlFor="amount-section--donate-100" className="rounded-full text-blue larger-button">$100</label>

                <input
                    type="radio"
                    id="amount-section--donate-250"
                    name="donation-amount"
                    value="250"
                    checked={selectedPreset === 250}
                    onChange={() => handlePresetAmountChange(250)}
                />
                <label htmlFor="amount-section--donate-250" className="rounded-full text-blue larger-button">$250</label>

                <input
                    type="radio"
                    id="amount-section--donate-500"
                    name="donation-amount"
                    value="500"
                    checked={selectedPreset === 500}
                    onChange={() => handlePresetAmountChange(500)}
                />
                <label htmlFor="amount-section--donate-500" className="rounded-full text-blue larger-button">$500</label>
            </div>

            <div className={`flex flex-col mb-2 ${showValidation ? 'validate' : ''}`}>
                <label className="inline-block mb-2 mt-4" htmlFor="custom-amount-input">
                    Or a custom amount:
                </label>
                <span className="custom-amount-input-wrapper border rounded-full focus-outline">
                    $
                    <input
                        type="number"
                        inputMode="numeric"
                        min="0"
                        max="999999.99"
                        step="0.01"
                        id="custom-amount-input"
                        name="custom-amount-input"
                        className="custom-amount-input inline-block text-md larger-input"
                        value={customAmount}
                        onChange={(e) => handleCustomAmountChange(e.target.value)}
                        onFocus={handleCustomAmountFocus}
                        onBlur={handleCustomAmountBlur}
                        placeholder="Enter your custom amount here"
                    />
                </span>
            </div>
        </section>
    );
};

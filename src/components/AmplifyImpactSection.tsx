import React, { useState } from 'react';

interface AmplifyImpactSectionProps {
    tipSize: number;
    tipType: 'percentage' | 'dollar';
    onTipChange: (amount: number, type: 'percentage' | 'dollar') => void;
}

export const AmplifyImpactSection: React.FC<AmplifyImpactSectionProps> = ({
    tipSize,
    tipType,
    onTipChange
}) => {
    const [customAmount, setCustomAmount] = useState('');
    const [showValidation, setShowValidation] = useState(false);
    const [showPopover, setShowPopover] = useState(false);

    const handlePercentageChange = (percentage: number) => {
        setCustomAmount('');
        setShowValidation(false);
        onTipChange(percentage, 'percentage');
    };

    const handleCustomAmountChange = (value: string) => {
        setCustomAmount(value);
        const numericValue = parseFloat(value) || 0;
        onTipChange(numericValue, 'dollar');
    };

    const handleCustomAmountFocus = () => {
        setShowValidation(true);
        onTipChange(0, 'percentage');
    };

    const handleCustomAmountBlur = () => {
        if (customAmount === '') {
            setShowValidation(false);
        }
    };

    const togglePopover = () => {
        setShowPopover(!showPopover);
    };

    return (
        <>
            <section id="amplify-impact-section" className="amplify-impact-section">
                <h2 className="text-lg">Support our work</h2>
                <p>I would like to add:</p>
                <div className="radio-group flex gap-2 flex-wrap">
                    <input
                        type="radio"
                        id="amplify-impact-section--amount-0"
                        name="amplify-impact-section--amount"
                        value="0"
                        checked={tipType === 'percentage' && tipSize === 0}
                        onChange={() => handlePercentageChange(0)}
                    />
                    <label
                        htmlFor="amplify-impact-section--amount-0"
                        className="flex items-center justify-center rounded-full text-blue"
                    >
                        Skip
                    </label>

                    <input
                        type="radio"
                        id="amplify-impact-section--amount-5"
                        name="amplify-impact-section--amount"
                        value="5"
                        checked={tipType === 'percentage' && tipSize === 5}
                        onChange={() => handlePercentageChange(5)}
                    />
                    <label
                        htmlFor="amplify-impact-section--amount-5"
                        className="flex items-center justify-center rounded-full text-blue"
                    >
                        5%
                    </label>

                    <input
                        type="radio"
                        id="amplify-impact-section--amount-10"
                        name="amplify-impact-section--amount"
                        value="10"
                        checked={tipType === 'percentage' && tipSize === 10}
                        onChange={() => handlePercentageChange(10)}
                    />
                    <label
                        htmlFor="amplify-impact-section--amount-10"
                        className="flex items-center justify-center rounded-full text-blue"
                    >
                        10%
                    </label>

                    <input
                        type="radio"
                        id="amplify-impact-section--amount-20"
                        name="amplify-impact-section--amount"
                        value="20"
                        checked={tipType === 'percentage' && tipSize === 20}
                        onChange={() => handlePercentageChange(20)}
                    />
                    <label
                        htmlFor="amplify-impact-section--amount-20"
                        className="flex items-center justify-center rounded-full text-blue"
                    >
                        20%
                    </label>

                    <input
                        type="radio"
                        id="amplify-impact-section--amount-30"
                        name="amplify-impact-section--amount"
                        value="30"
                        checked={tipType === 'percentage' && tipSize === 30}
                        onChange={() => handlePercentageChange(30)}
                    />
                    <label
                        htmlFor="amplify-impact-section--amount-30"
                        className="flex items-center justify-center rounded-full text-blue"
                    >
                        30%
                    </label>
                </div>

                <div className={`flex flex-col mb-2 ${showValidation ? 'validate' : ''}`}>
                    <label className="inline-block mb-2 mt-4" htmlFor="custom-amount-input">
                        Or a custom dollar amount:
                    </label>
                    <span className="custom-amount-input-wrapper border rounded-full focus-outline">
                        $
                        <input
                            type="number"
                            inputMode="numeric"
                            min="0"
                            max="999999.99"
                            step="0.01"
                            id="amplify-impact-section--custom-amount-input"
                            name="custom-amount-input"
                            className="custom-amount-input inline-block text-md"
                            value={customAmount}
                            onChange={(e) => handleCustomAmountChange(e.target.value)}
                            onFocus={handleCustomAmountFocus}
                            onBlur={handleCustomAmountBlur}
                            placeholder="Enter your custom amount here"
                        />
                    </span>
                </div>

                <p className="mb-1">
                    $1 donated raises $5-$8 for partner charities
                    <button
                        className="more-info-button"
                        type="button"
                        onClick={togglePopover}
                    >
                        i
                    </button>
                </p>
            </section>

            {showPopover && (
                <>
                    <div className="popover-backdrop" onClick={() => setShowPopover(false)} />
                    <div className="popover open">
                        EA Australia helps introduce more people to effective charities, and the
                        ideas of effective altruism. Your support of our operations helps us grow,
                        and collectively grow our impact.{' '}
                        <a
                            href="https://effectivealtruism.org.au/we-help-others-give-better-but-how-effective-is-that/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Learn more
                        </a>{' '}
                        about our transparent impact evaluation for 2022-2024.
                    </div>
                </>
            )}
        </>
    );
};

import React from 'react';

interface DonateButtonSectionProps {
    onSubmit: () => void;
    isLoading: boolean;
}

export const DonateButtonSection: React.FC<DonateButtonSectionProps> = ({
    onSubmit,
    isLoading
}) => {
    return (
        <section id="donate-button-section">
            <button
                id="donate-button-section--donate-button"
                className="mt-8 py-5 px-10 text-white text-md border-none rounded-full focus-outline"
                type="button"
                onClick={onSubmit}
                disabled={isLoading}
            >
                {isLoading ? 'Processing...' : 'Donate'}
            </button>
        </section>
    );
};

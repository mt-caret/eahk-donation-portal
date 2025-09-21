import React from 'react';

interface AllocationSectionProps {
    allocationType: 'default' | 'specific';
    onAllocationTypeChange: (type: 'default' | 'specific') => void;
}

export const AllocationSection: React.FC<AllocationSectionProps> = ({
    allocationType,
    onAllocationTypeChange
}) => {
    return (
        <section id="allocation-section">
            <h2 className="text-lg mt-8">I would like my gift to go to</h2>
            <div className="radio-group flex flex-wrap gap-2 mb-4">
                <input
                    type="radio"
                    id="allocation-section--default-allocation"
                    name="allocation-section--allocation-type"
                    value="default"
                    checked={allocationType === 'default'}
                    onChange={(e) => onAllocationTypeChange(e.target.value as 'default' | 'specific')}
                />
                <label htmlFor="allocation-section--default-allocation" className="flex items-center justify-center rounded-full text-blue px-10">
                    <span>The most effective charities<sup>✧</sup></span>
                </label>

                <input
                    type="radio"
                    id="allocation-section--specific-allocation"
                    name="allocation-section--allocation-type"
                    value="specific"
                    checked={allocationType === 'specific'}
                    onChange={(e) => onAllocationTypeChange(e.target.value as 'default' | 'specific')}
                />
                <label htmlFor="allocation-section--specific-allocation" className="flex items-center justify-center rounded-full text-blue px-4">
                    These specific charities
                </label>
            </div>
            <p className="text-sm">
                <sup>✧</sup> Known as our Top Charities Fund. We select the most effective charities each quarter based on evidence and need. You can read more about how we evaluate
                charities{' '}
                <a href="https://effectivealtruism.org.au/evaluating-charities/">here</a>.
            </p>
        </section>
    );
};

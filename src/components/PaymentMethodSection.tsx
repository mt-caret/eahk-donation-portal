import React from 'react';

interface PaymentMethodSectionProps {
    paymentMethod: 'credit-card' | 'bank-transfer';
    onPaymentMethodChange: (method: 'credit-card' | 'bank-transfer') => void;
}

export const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
    paymentMethod,
    onPaymentMethodChange
}) => {
    return (
        <section id="payment-method-section">
            <h2 className="text-lg mt-8">Payment Method</h2>

            <div className="radio-group flex flex-wrap gap-2">
                <input
                    type="radio"
                    id="payment-method-section--credit-card"
                    name="payment-method-section--method"
                    value="credit-card"
                    checked={paymentMethod === 'credit-card'}
                    onChange={(e) => onPaymentMethodChange(e.target.value as 'credit-card' | 'bank-transfer')}
                />
                <label htmlFor="payment-method-section--credit-card" className="rounded-full text-blue">
                    Credit Card
                </label>

                <input
                    type="radio"
                    id="payment-method-section--bank-transfer"
                    name="payment-method-section--method"
                    value="bank-transfer"
                    checked={paymentMethod === 'bank-transfer'}
                    onChange={(e) => onPaymentMethodChange(e.target.value as 'credit-card' | 'bank-transfer')}
                />
                <label htmlFor="payment-method-section--bank-transfer" className="rounded-full text-blue">
                    Bank Transfer
                </label>
            </div>

            {paymentMethod === 'bank-transfer' && (
                <div id="payment-method-section--bank-details-message" style={{ opacity: 1 }}>
                    <div className="mt-4">
                        After you submit this form, we will give you our account details and a
                        unique reference number. You can then log in to your bank and make a bank
                        transfer using these details.
                    </div>
                </div>
            )}
        </section>
    );
};

import React from 'react';

interface ThankYouSectionProps {
    isVisible: boolean;
}

export const ThankYouSection: React.FC<ThankYouSectionProps> = ({ isVisible }) => {
    if (!isVisible) return null;

    return (
        <section id="thankyou-section">
            <h2>Thank you!</h2>
            <p>Your receipt will be sent to your email address.</p>

            <div style={{
                backgroundColor: 'var(--eaa-blue-100)',
                border: '2px solid var(--eaa-blue-200)',
                borderRadius: '8px',
                padding: '20px',
                margin: '20px 0',
                textAlign: 'center',
            }}>
                <a
                    href="https://forms.gle/qNKpAdyi3i6bZa5v9"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'inline-block',
                        backgroundColor: 'var(--eaa-blue-600)',
                        color: 'white',
                        padding: '12px 24px',
                        textDecoration: 'none',
                        borderRadius: '5px',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        transition: 'background-color 0.2s',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--eaa-blue-700)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--eaa-blue-600)'}
                >
                    Take Our 60 Second Survey
                </a>
                <p>
                    Your feedback will help us grow our impact and better serve donors like you.
                </p>
            </div>

            <h3>Any questions?</h3>

            <p>
                Please email us at{' '}
                <strong><a href="mailto:info@eaa.org.au">info@eaa.org.au</a></strong> or
                call us on <strong>+61 492 841 596</strong>, if you have any questions.
            </p>

            <p>Best wishes and thanks,</p>
            <p><strong>The team at Effective Altruism Australia</strong></p>
        </section>
    );
};

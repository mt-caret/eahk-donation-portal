import React, { useEffect, useState } from 'react';
import { ReferralSource } from '../types';
import { mockReferralSources } from '../mockData';

interface CommunicationsSectionProps {
    subscribeToUpdates: boolean;
    subscribeToNewsletter: boolean;
    connectToCommunity: boolean;
    howDidYouHearAboutUs: string;
    onSubscribeToUpdatesChange: (value: boolean) => void;
    onSubscribeToNewsletterChange: (value: boolean) => void;
    onConnectToCommunityChange: (value: boolean) => void;
    onHowDidYouHearAboutUsChange: (value: string) => void;
}

export const CommunicationsSection: React.FC<CommunicationsSectionProps> = ({
    subscribeToUpdates,
    subscribeToNewsletter,
    connectToCommunity,
    howDidYouHearAboutUs,
    onSubscribeToUpdatesChange,
    onSubscribeToNewsletterChange,
    onConnectToCommunityChange,
    onHowDidYouHearAboutUsChange
}) => {
    const [referralSources, setReferralSources] = useState<ReferralSource[]>([]);

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setReferralSources(mockReferralSources);
        }, 100);
    }, []);

    return (
        <section id="communications-section">
            <div className="flex flex-col">
                <h2 className="inline-block text-lg mt-8">How did you hear about us?</h2>
                <select
                    placeholder="Select an option"
                    name="communications-section--referral-sources"
                    id="communications-section--referral-sources"
                    className="eaa-select text-md flex flex-grow mb-4 rounded-full border h-12 border-none p-2 px-4 focus-outline"
                    value={howDidYouHearAboutUs}
                    onChange={(e) => onHowDidYouHearAboutUsChange(e.target.value)}
                >
                    <option value="" disabled>Please select one...</option>
                    {referralSources.map(source => (
                        <option key={source.value} value={source.value}>
                            {source.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col items-start">
                <label className="eaa-checkbox mb-4">
                    <input
                        type="checkbox"
                        id="communications-section--subscribe-to-updates"
                        name="communications-section--subscribe-to-updates"
                        checked={subscribeToUpdates}
                        onChange={(e) => onSubscribeToUpdatesChange(e.target.checked)}
                    />
                    Send me news and updates
                    <div className="checkmark rounded-sm"></div>
                </label>

                <label className="eaa-checkbox mb-4">
                    <input
                        type="checkbox"
                        id="communications-section--subscribe-to-newsletter"
                        name="communications-section--subscribe-to-newsletter"
                        checked={subscribeToNewsletter}
                        onChange={(e) => onSubscribeToNewsletterChange(e.target.checked)}
                    />
                    Subscribe me to the global Effective Altruism newsletter
                    <div className="checkmark rounded-sm"></div>
                </label>

                <label className="eaa-checkbox">
                    <input
                        type="checkbox"
                        id="communications-section--connect-to-community"
                        name="communications-section--connect-to-community"
                        checked={connectToCommunity}
                        onChange={(e) => onConnectToCommunityChange(e.target.checked)}
                    />
                    Connect me with my local Effective Altruism community
                    <div className="checkmark rounded-sm"></div>
                </label>
            </div>
        </section>
    );
};

import React from 'react';
import { COUNTRY_LIST, Country } from '../constants/countries';

interface PersonalDetailsSectionProps {
    firstName: string;
    lastName: string;
    email: string;
    postcode: string;
    country: Country;
    onFirstNameChange: (value: string) => void;
    onLastNameChange: (value: string) => void;
    onEmailChange: (value: string) => void;
    onPostcodeChange: (value: string) => void;
    onCountryChange: (value: Country) => void;
}

export const PersonalDetailsSection: React.FC<PersonalDetailsSectionProps> = ({
    firstName,
    lastName,
    email,
    postcode,
    country,
    onFirstNameChange,
    onLastNameChange,
    onEmailChange,
    onPostcodeChange,
    onCountryChange
}) => {
    return (
        <section id="personal-details-section">
            <h2 className="text-lg mt-8">Personal Details</h2>
            <div className="flex flex-col validate" style={{ gap: '24px' }}>
                <div>
                    <label htmlFor="personal-details-section--first-name">First name</label>
                    <input
                        type="text"
                        id="personal-details-section--first-name"
                        name="first_name"
                        className="block w-full p-2 text-md border rounded-full focus-outline px-4 mb-2 mt-1"
                        value={firstName}
                        onChange={(e) => onFirstNameChange(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="personal-details-section--last-name">Last name</label>
                    <input
                        type="text"
                        id="personal-details-section--last-name"
                        name="last_name"
                        className="block w-full p-2 text-md border rounded-full focus-outline px-4 mb-2 mt-1"
                        value={lastName}
                        onChange={(e) => onLastNameChange(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="personal-details-section--email">Email</label>
                    <input
                        id="personal-details-section--email"
                        name="email"
                        type="email"
                        className="block w-full p-2 text-md border rounded-full focus-outline px-4 mb-2 mt-1"
                        value={email}
                        onChange={(e) => onEmailChange(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="personal-details-section--postcode">Postcode</label>
                    <input
                        id="personal-details-section--postcode"
                        name="postcode"
                        type="text"
                        inputMode="numeric"
                        pattern="\d*"
                        className="block w-full p-2 text-md border rounded-full focus-outline px-4 mb-2 mt-1"
                        value={postcode}
                        onChange={(e) => onPostcodeChange(e.target.value)}
                        maxLength={4}
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="personal-details-section--country">Country</label>
                    <select
                        name="country"
                        id="personal-details-section--country"
                        className="eaa-select text-md flex flex-grow rounded-full border h-12 border-none p-2 focus-outline mt-1 px-4"
                        value={country}
                        onChange={(e) => onCountryChange(e.target.value as Country)}
                        required
                    >
                        {COUNTRY_LIST.map(countryOption => (
                            <option key={countryOption} value={countryOption}>
                                {countryOption}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </section>
    );
};

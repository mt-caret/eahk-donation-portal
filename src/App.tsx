import React, { useState } from 'react';
import './App.css';

import { useFormState } from './hooks/useFormState';
import { mockCharities } from './mockData';

import { DonationFrequencySection } from './components/DonationFrequencySection';
import { AllocationSection } from './components/AllocationSection';
import { AmountSection } from './components/AmountSection';
import { SpecificAllocationSection } from './components/SpecificAllocationSection';
import { AmplifyImpactSection } from './components/AmplifyImpactSection';
import { TotalAmountSection } from './components/TotalAmountSection';
import { PersonalDetailsSection } from './components/PersonalDetailsSection';
import { CommunicationsSection } from './components/CommunicationsSection';
import { PaymentMethodSection } from './components/PaymentMethodSection';
import { DonateButtonSection } from './components/DonateButtonSection';
import { ThankYouSection } from './components/ThankYouSection';
import { Loader } from './components/Loader';

export function App() {
  const {
    formData,
    updateFormData,
    setDonationFrequency,
    setAllocationType,
    setBasicDonationAmount,
    setCharityAllocation,
    setTipValues,
    getSpecificAllocationsTotal
  } = useFormState();

  const [isLoading, setIsLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const handleFormSubmit = async () => {
    // Validation
    if (formData.allocationType === 'specific') {
      const total = getSpecificAllocationsTotal() + formData.tipDollarAmount;
      if (total < 2) {
        alert('Please allocate at least $2 across your preferred charities.');
        return;
      }
    } else {
      const total = formData.basicDonationAmount + formData.tipDollarAmount;
      if (total < 2) {
        alert('Please select an amount of at least $2.');
        return;
      }
    }

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.postcode) {
      alert('Please fill in all required personal details.');
      return;
    }

    setIsLoading(true);

    // Mock API call
    setTimeout(() => {
      setIsLoading(false);
      if (formData.paymentMethod === 'bank-transfer') {
        // In real implementation, would show bank transfer instructions
        alert('Bank transfer instructions would be shown here');
      } else {
        // Mock Stripe redirect
        alert('Redirecting to Stripe checkout...');
        setShowThankYou(true);
      }
    }, 2000);
  };

  if (showThankYou) {
    return (
      <div className="donation-form-host">
        <ThankYouSection isVisible={true} />
      </div>
    );
  }

  return (
    <>
      <div className="donation-form-host">
        <form onSubmit={(e) => { e.preventDefault(); handleFormSubmit(); }}>
          <DonationFrequencySection
            frequency={formData.donationFrequency}
            onFrequencyChange={setDonationFrequency}
          />

          <AllocationSection
            allocationType={formData.allocationType}
            onAllocationTypeChange={setAllocationType}
          />

          <AmountSection
            basicDonationAmount={formData.basicDonationAmount}
            onAmountChange={setBasicDonationAmount}
            isVisible={formData.allocationType === 'default'}
          />

          <SpecificAllocationSection
            charities={mockCharities}
            allocations={formData.specificAllocations}
            onAllocationChange={setCharityAllocation}
            isVisible={formData.allocationType === 'specific'}
          />

          <AmplifyImpactSection
            tipSize={formData.tipSize}
            tipType={formData.tipType}
            onTipChange={setTipValues}
          />

          <TotalAmountSection
            formData={formData}
            charities={mockCharities}
          />

          <PersonalDetailsSection
            firstName={formData.firstName}
            lastName={formData.lastName}
            email={formData.email}
            postcode={formData.postcode}
            country={formData.country}
            onFirstNameChange={(value) => updateFormData({ firstName: value })}
            onLastNameChange={(value) => updateFormData({ lastName: value })}
            onEmailChange={(value) => updateFormData({ email: value })}
            onPostcodeChange={(value) => updateFormData({ postcode: value })}
            onCountryChange={(value) => updateFormData({ country: value })}
          />

          <CommunicationsSection
            subscribeToUpdates={formData.subscribeToUpdates}
            subscribeToNewsletter={formData.subscribeToNewsletter}
            connectToCommunity={formData.connectToCommunity}
            howDidYouHearAboutUs={formData.howDidYouHearAboutUs}
            onSubscribeToUpdatesChange={(value) => updateFormData({ subscribeToUpdates: value })}
            onSubscribeToNewsletterChange={(value) => updateFormData({ subscribeToNewsletter: value })}
            onConnectToCommunityChange={(value) => updateFormData({ connectToCommunity: value })}
            onHowDidYouHearAboutUsChange={(value) => updateFormData({ howDidYouHearAboutUs: value })}
          />

          <PaymentMethodSection
            paymentMethod={formData.paymentMethod}
            onPaymentMethodChange={(value) => updateFormData({ paymentMethod: value })}
          />

          <DonateButtonSection
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
          />
        </form>
      </div>

      <Loader isVisible={isLoading} />
    </>
  );
}

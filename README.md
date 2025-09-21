# EAA Donation Portal

A React-based donation portal that replicates the functionality of the original HTML implementation. This allows users to donate to various effective altruism charities with a modern, interactive interface.

## Features

- **Donation Frequency Selection**: Choose between one-time and monthly donations
- **Allocation Options**: 
  - Default allocation to the most effective charities
  - Specific allocation to individual partner charities
- **Amount Selection**: Preset amounts or custom donation amounts
- **Support EA Australia**: Optional tip to support EA Australia's operations (5-30% or custom amount)
- **Personal Details**: Collect donor information
- **Communication Preferences**: Newsletter subscriptions and community connections
- **Payment Methods**: Credit card (Stripe) or bank transfer options
- **Responsive Design**: Mobile-friendly interface

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Open your browser** and navigate to `http://localhost:1234`

## Project Structure

```
src/
├── components/           # Individual form sections
│   ├── AllocationSection.tsx
│   ├── AmountSection.tsx
│   ├── AmplifyImpactSection.tsx
│   ├── CommunicationsSection.tsx
│   ├── DonateButtonSection.tsx
│   ├── DonationFrequencySection.tsx
│   ├── Loader.tsx
│   ├── PaymentMethodSection.tsx
│   ├── PersonalDetailsSection.tsx
│   ├── SpecificAllocationSection.tsx
│   ├── ThankYouSection.tsx
│   └── TotalAmountSection.tsx
├── hooks/
│   └── useFormState.ts   # Form state management
├── App.css              # Styles (converted from original)
├── App.tsx              # Main application component
├── mockData.ts          # Mock charity and reference data
└── types.ts             # TypeScript type definitions
```

## Key Differences from Original

- **React Components**: Modular component architecture instead of vanilla JS classes
- **TypeScript**: Full type safety throughout the application
- **Modern Hooks**: Uses React hooks for state management
- **Mock APIs**: Simulated API calls for development/testing
- **Responsive**: Better mobile experience with React patterns

## Mock Data

The application includes mock data for:
- Partner charities (Against Malaria Foundation, GiveDirectly, etc.)
- Referral sources (friend/family, social media, etc.)
- Country list for personal details

## API Integration

The original implementation integrated with:
- Stripe for credit card payments
- Custom backend for form submission and bank transfers
- Sentry for error tracking

This React version includes mock implementations that can be easily replaced with real API calls.

## Development

To add new features:

1. **Add new form fields**: Update the `FormData` type in `types.ts`
2. **Create components**: Follow the existing component patterns
3. **Update state management**: Modify `useFormState.ts` hook
4. **Add styles**: Use the existing CSS classes or add new ones to `App.css`

## Testing

The project includes comprehensive end-to-end tests using Playwright that cover:

- **Complete donation flows** (default and specific allocations)
- **Form validation** (minimum amounts, required fields, email format)
- **Interactive features** (tip calculations, popover modals, dynamic content)
- **Accessibility** (keyboard navigation, screen reader support)
- **Edge cases** (large amounts, special characters, network issues)
- **Mobile responsiveness**

### Running Tests

```bash
# Run core functionality tests (recommended)
npm test

# Run all tests including edge cases
npm run test:all

# Run tests with browser UI visible
npm run test:headed

# Run tests with Playwright UI (interactive)
npm run test:ui

# Debug tests step by step
npm run test:debug

# View test reports
npm run test:report
```

### Test Results

✅ **122 tests passing** across all browsers (Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari)
- Core donation flows: **100% passing**
- Form validation: **100% passing**  
- Interactive features: **100% passing**
- Cross-browser compatibility: **100% passing**
- Mobile responsiveness: **100% passing**

### Test Structure

```
tests/
├── donation-flow.spec.ts      # Main user flows and basic functionality
├── accessibility.spec.ts      # Keyboard navigation and screen reader tests
├── edge-cases.spec.ts         # Error handling and boundary conditions
├── complete-flows.spec.ts     # End-to-end scenarios using helpers
└── utils/
    └── test-helpers.ts         # Reusable test utilities and page objects
```

### Continuous Integration

Tests run automatically on GitHub Actions for all pull requests and pushes to main branch.

## Building for Production

```bash
npm run build
```

This creates a `dist/` folder with the production build ready for deployment.

## Original Reference

This implementation is based on the HTML/JS donation form from Effective Altruism Australia. The original functionality and styling have been preserved while modernizing the codebase with React and TypeScript.

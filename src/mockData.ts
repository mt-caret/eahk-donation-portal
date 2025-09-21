import { Charity, ReferralSource } from './types';

export const mockCharities: Charity[] = [
    {
        slug_id: 'unallocated',
        name: 'Top Charities Fund',
        category: 'Our recommended charities',
        thumbnail: 'thumbnails/logo_eaa.png',
        is_eaae: false
    },
    {
        slug_id: 'all-grants-fund',
        name: 'All Grants Fund',
        category: 'Our recommended charities',
        thumbnail: 'thumbnails/all_grants_fund.png',
        is_eaae: false
    },
    {
        slug_id: 'against-malaria-foundation',
        name: 'Against Malaria Foundation',
        category: 'Our recommended charities',
        thumbnail: 'thumbnails/amf.png',
        is_eaae: false
    },
    {
        slug_id: 'givedirectly',
        name: 'GiveDirectly',
        category: 'Our recommended charities',
        thumbnail: 'thumbnails/givedirectly.png',
        is_eaae: false
    },
    {
        slug_id: 'helen-keller-international',
        name: 'Helen Keller International',
        category: 'Our recommended charities',
        thumbnail: 'thumbnails/hki.png',
        is_eaae: false
    },
    {
        slug_id: 'malaria-consortium',
        name: 'Malaria Consortium',
        category: 'Our recommended charities',
        thumbnail: 'thumbnails/malaria_consortium.png',
        is_eaae: false
    },
    {
        slug_id: 'new-incentives',
        name: 'New Incentives',
        category: 'Our recommended charities',
        thumbnail: 'thumbnails/new_incentives.png',
        is_eaae: false
    },
    {
        slug_id: 'schistosomiasis-control-initiative',
        name: 'Schistosomiasis Control Initiative',
        category: 'Other charities we support',
        thumbnail: 'thumbnails/sci.png',
        is_eaae: false
    },
    {
        slug_id: 'deworm-the-world',
        name: 'Deworm the World Initiative',
        category: 'Other charities we support',
        thumbnail: 'thumbnails/deworm.png',
        is_eaae: false
    },
    {
        slug_id: 'sightsavers',
        name: 'Sightsavers',
        category: 'Other charities we support',
        thumbnail: 'thumbnails/sightsavers.png',
        is_eaae: false
    }
];

export const mockReferralSources: ReferralSource[] = [
    { value: 'friend-family', label: 'Friend or family member' },
    { value: 'social-media', label: 'Social media (Facebook, Twitter, etc.)' },
    { value: 'google-search', label: 'Google search' },
    { value: 'podcast', label: 'Podcast' },
    { value: 'blog-article', label: 'Blog or article' },
    { value: 'event', label: 'Event or conference' },
    { value: 'newsletter', label: 'Newsletter' },
    { value: 'other', label: 'Other' }
];

export const mockCountries: string[] = [
    'Australia',
    'United States of America (the)',
    'United Kingdom of Great Britain and Northern Ireland (the)',
    'Canada',
    'Germany',
    'France',
    'Netherlands (the)',
    'New Zealand',
    'Singapore',
    'Japan',
    'Other'
];

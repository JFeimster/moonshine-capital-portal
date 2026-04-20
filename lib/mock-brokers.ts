import { BrokerProfile } from './types';
import { sanitizeUrl } from './utils';

export const mockBrokers: BrokerProfile[] = [
  {
    id: '1',
    fullName: 'Jane Doe',
    agencyName: 'Velocity Capital',
    slug: 'jane-doe',
    shortBio: 'Ex-founder turned capital allocator. I get deals done when banks say no.',
    city: 'Austin',
    state: 'TX',
    websiteUrl: sanitizeUrl('https://example.com'),
    publicEmail: 'jane@velocitycapital.com',
    whyChooseYou: 'No fluff. No slow banks. Just operators who know how to move money.',

    industries: ['SaaS', 'Manufacturing', 'Technology'],
    fundingTypes: ['SaaS Revenue', 'Equipment Finance', 'Bridge Loans'],
    urgencyCategory: 'fast',
    fundingSpecialties: ['SaaS Revenue', 'Equipment Finance', 'Bridge Loans'], // fallback

    primaryCta: {
      label: 'Apply for Funding',
      url: sanitizeUrl('https://example.com/apply'),
      variant: 'primary',
      trackingId: 'cta_jane_doe'
    },
    primaryCtaLink: sanitizeUrl('https://example.com/apply'),

    approvalStatus: 'approved',
    isActive: true,
    featuredFlag: true,
    featuredBroker: true,
    profileImage: sanitizeUrl('https://i.pravatar.cc/300?img=5'),
  },
  {
    id: '2',
    fullName: 'John Smith',
    agencyName: 'Ironclad Funding',
    slug: 'john-smith',
    shortBio: 'We fund heavy machinery and real estate. Fast, aggressive, reliable.',
    city: 'Chicago',
    state: 'IL',
    websiteUrl: sanitizeUrl('https://example.com'),
    publicEmail: 'john@ironcladfunding.com',
    whyChooseYou: 'We don\'t waste your time. If the numbers make sense, we wire within 48 hours.',

    industries: ['Construction', 'Real Estate', 'Logistics'],
    fundingTypes: ['Equipment Finance', 'Real Estate', 'SBA Loans'],
    urgencyCategory: 'standard',
    fundingSpecialties: ['Equipment Finance', 'Real Estate', 'SBA Loans'], // fallback

    primaryCta: {
      label: 'Submit Deal',
      url: sanitizeUrl('https://example.com/apply'),
      variant: 'primary',
      trackingId: 'cta_john_smith'
    },
    primaryCtaLink: sanitizeUrl('https://example.com/apply'),

    approvalStatus: 'approved',
    isActive: true,
    featuredFlag: false,
    featuredBroker: false,
    profileImage: sanitizeUrl('https://i.pravatar.cc/300?img=11'),
  },
  {
    id: '3',
    fullName: 'Sarah Jenkins',
    agencyName: 'Neon Growth Partners',
    slug: 'sarah-jenkins',
    shortBio: 'Specializing in e-commerce inventory and marketing capital.',
    city: 'New York',
    state: 'NY',
    websiteUrl: sanitizeUrl('https://example.com'),
    publicEmail: 'sarah@neongrowth.com',
    whyChooseYou: 'Built for founders who do not have time for institutional theater.',

    industries: ['E-commerce', 'Retail', 'DTC'],
    fundingTypes: ['Revenue Based', 'Working Capital'],
    urgencyCategory: 'fast',
    fundingSpecialties: ['E-commerce', 'Revenue Based', 'Working Capital'], // fallback

    primaryCta: {
      label: 'Get Funded Fast',
      url: sanitizeUrl('https://example.com/apply'),
      variant: 'primary',
      trackingId: 'cta_sarah_jenkins'
    },
    primaryCtaLink: sanitizeUrl('https://example.com/apply'),

    approvalStatus: 'approved',
    isActive: true,
    featuredFlag: true,
    featuredBroker: true,
    profileImage: sanitizeUrl('https://i.pravatar.cc/300?img=9'),
  },
  {
    id: '4',
    fullName: 'Marcus Vance',
    agencyName: 'Vance Capital Advisors',
    slug: 'marcus-vance',
    shortBio: 'Strategic financing for mid-market acquisitions and expansions.',
    city: 'Miami',
    state: 'FL',
    websiteUrl: sanitizeUrl('https://example.com'),
    publicEmail: 'marcus@vancecapital.com',
    whyChooseYou: 'I bring 20 years of structuring experience to the table. I solve complex capital stacks.',

    industries: ['Healthcare', 'B2B Services', 'Enterprise'],
    fundingTypes: ['M&A', 'Bridge Loans', 'Term Loans'],
    urgencyCategory: 'complex',
    fundingSpecialties: ['M&A', 'Bridge Loans', 'Term Loans'], // fallback

    primaryCta: {
      label: 'Book Consultation',
      url: sanitizeUrl('https://example.com/apply'),
      variant: 'primary',
      trackingId: 'cta_marcus_vance'
    },
    primaryCtaLink: sanitizeUrl('https://example.com/apply'),

    approvalStatus: 'approved',
    isActive: true,
    featuredFlag: false,
    featuredBroker: false,
    profileImage: sanitizeUrl('https://i.pravatar.cc/300?img=12'),
  }
];

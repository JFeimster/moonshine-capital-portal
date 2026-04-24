import { BrokerProfile } from './types';

export const mockBrokers: BrokerProfile[] = [
  {
    id: 'darwin-hanneman',
    fullName: 'Darwin Hanneman',
    agencyName: 'Moonshine Capital',
    slug: 'darwin-hanneman',
    shortBio: 'Moonshine Capital funding partner with a practical, relationship-driven approach to equipment financing and related funding paths.',
    city: 'Washington',
    state: 'DC',
    websiteUrl: 'https://www.distilledfunding.com',
    publicEmail: '',
    whyChooseYou: 'Darwin helps business owners make a more informed decision when equipment, vehicles, or business-critical assets are on the line. Instead of pitching funding like a magic trick, the goal is to help prospects understand which lane may fit best, where they may have stronger approval odds, and what next step is actually worth taking.',

    industries: ['Construction', 'Logistics', 'Service Businesses', 'Real Estate'],
    fundingTypes: ['Equipment Financing', 'Vehicle & Fleet Financing', 'Revenue-Based Funding', 'Business Term Loans', 'SBA Options'],
    urgencyCategory: 'standard',
    fundingSpecialties: ['Equipment Financing', 'Vehicle & Fleet Financing', 'Revenue-Based Funding', 'Business Term Loans', 'SBA Options'],

    primaryCta: {
      label: 'Apply Now',
      url: 'https://bit.ly/fundingwithdarwin',
      variant: 'primary',
      trackingId: 'cta_darwin_hanneman'
    },
    secondaryCta: {
      label: 'Book a Call',
      url: 'https://distilledfunding.com/book-online',
      variant: 'secondary',
      trackingId: 'cta_darwin_call'
    },
    primaryCtaLink: 'https://bit.ly/fundingwithdarwin',
    ctaLabel: 'Apply Now',

    approvalStatus: 'approved',
    isActive: true,
    featuredFlag: false,
    featuredBroker: false,
    brokerStatus: 'active',
  },
  {
    id: '1',
    fullName: 'Jane Doe',
    agencyName: 'Velocity Capital',
    slug: 'jane-doe',
    shortBio: 'Ex-founder turned capital allocator. I get deals done when banks say no.',
    city: 'Austin',
    state: 'TX',
    websiteUrl: 'https://example.com',
    publicEmail: 'jane@velocitycapital.com',
    whyChooseYou: 'No fluff. No slow banks. Just operators who know how to move money.',

    industries: ['SaaS', 'Manufacturing', 'Technology'],
    fundingTypes: ['SaaS Revenue', 'Equipment Finance', 'Bridge Loans'],
    urgencyCategory: 'fast',
    fundingSpecialties: ['SaaS Revenue', 'Equipment Finance', 'Bridge Loans'], // fallback

    primaryCta: {
      label: 'Apply for Funding',
      url: 'https://example.com/apply',
      variant: 'primary',
      trackingId: 'cta_jane_doe'
    },
    primaryCtaLink: 'https://example.com/apply',

    approvalStatus: 'approved',
    isActive: true,
    featuredFlag: true,
    featuredBroker: true,
    profileImage: 'https://i.pravatar.cc/300?img=5',
  },
  {
    id: '2',
    fullName: 'John Smith',
    agencyName: 'Ironclad Funding',
    slug: 'john-smith',
    shortBio: 'We fund heavy machinery and real estate. Fast, aggressive, reliable.',
    city: 'Chicago',
    state: 'IL',
    websiteUrl: 'https://example.com',
    publicEmail: 'john@ironcladfunding.com',
    whyChooseYou: 'We don\'t waste your time. If the numbers make sense, we wire within 48 hours.',

    industries: ['Construction', 'Real Estate', 'Logistics'],
    fundingTypes: ['Equipment Finance', 'Real Estate', 'SBA Loans'],
    urgencyCategory: 'standard',
    fundingSpecialties: ['Equipment Finance', 'Real Estate', 'SBA Loans'], // fallback

    primaryCta: {
      label: 'Submit Deal',
      url: 'https://example.com/apply',
      variant: 'primary',
      trackingId: 'cta_john_smith'
    },
    primaryCtaLink: 'https://example.com/apply',

    approvalStatus: 'approved',
    isActive: true,
    featuredFlag: false,
    featuredBroker: false,
    profileImage: 'https://i.pravatar.cc/300?img=11',
  },
  {
    id: '3',
    fullName: 'Sarah Jenkins',
    agencyName: 'Neon Growth Partners',
    slug: 'sarah-jenkins',
    shortBio: 'Specializing in e-commerce inventory and marketing capital.',
    city: 'New York',
    state: 'NY',
    websiteUrl: 'https://example.com',
    publicEmail: 'sarah@neongrowth.com',
    whyChooseYou: 'Built for founders who do not have time for institutional theater.',

    industries: ['E-commerce', 'Retail', 'DTC'],
    fundingTypes: ['Revenue Based', 'Working Capital'],
    urgencyCategory: 'fast',
    fundingSpecialties: ['E-commerce', 'Revenue Based', 'Working Capital'], // fallback

    primaryCta: {
      label: 'Get Funded Fast',
      url: 'https://example.com/apply',
      variant: 'primary',
      trackingId: 'cta_sarah_jenkins'
    },
    primaryCtaLink: 'https://example.com/apply',

    approvalStatus: 'approved',
    isActive: true,
    featuredFlag: true,
    featuredBroker: true,
    profileImage: 'https://i.pravatar.cc/300?img=9',
  },
  {
    id: '4',
    fullName: 'Marcus Vance',
    agencyName: 'Vance Capital Advisors',
    slug: 'marcus-vance',
    shortBio: 'Strategic financing for mid-market acquisitions and expansions.',
    city: 'Miami',
    state: 'FL',
    websiteUrl: 'https://example.com',
    publicEmail: 'marcus@vancecapital.com',
    whyChooseYou: 'I bring 20 years of structuring experience to the table. I solve complex capital stacks.',

    industries: ['Healthcare', 'B2B Services', 'Enterprise'],
    fundingTypes: ['M&A', 'Bridge Loans', 'Term Loans'],
    urgencyCategory: 'complex',
    fundingSpecialties: ['M&A', 'Bridge Loans', 'Term Loans'], // fallback

    primaryCta: {
      label: 'Book Consultation',
      url: 'https://example.com/apply',
      variant: 'primary',
      trackingId: 'cta_marcus_vance'
    },
    primaryCtaLink: 'https://example.com/apply',

    approvalStatus: 'approved',
    isActive: true,
    featuredFlag: false,
    featuredBroker: false,
    profileImage: 'https://i.pravatar.cc/300?img=12',
  }
];

import { BrokerProfile } from '@/lib/types';
import { getPartnerDisplaySpecialties } from '@/lib/partner-personalization';
import Link from 'next/link';
import { Avatar } from './Avatar';

interface BrokerCardProps {
  broker: BrokerProfile;
}

export function BrokerCard({ broker }: BrokerCardProps) {
  const topSpecialties = getPartnerDisplaySpecialties(broker).slice(0, 2);
  const topIndustries = (broker.industries || []).slice(0, 2);
  const location = [broker.city, broker.state].filter(Boolean).join(', ');

  return (
    <div className="card-brutal flex flex-col h-full bg-neo-white transition-all duration-200 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1">
      <div className="flex items-center gap-4 mb-5">
        <Avatar
          src={broker.profileImage}
          alt={broker.fullName}
          className="w-20 h-20 bg-neo-black border-2 border-neo-black shadow-brutal flex-shrink-0 overflow-hidden"
          imageClassName="w-full h-full object-cover"
          fallbackClassName="w-full h-full flex items-center justify-center text-neo-white font-black text-2xl"
        />
        <div>
          <h3 className="font-black text-xl uppercase tracking-tight leading-tight">{broker.fullName}</h3>
          {(broker.companyName || broker.agencyName) && <p className="font-bold text-neo-blue text-sm uppercase tracking-wide">{broker.companyName || broker.agencyName}</p>}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {location && <span className="inline-block bg-neo-black text-neo-white text-xs font-bold uppercase px-2 py-1 border border-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{location}</span>}
        {broker.title && <span className="inline-block bg-neo-orange text-neo-black text-xs font-bold uppercase px-2 py-1 border border-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{broker.title}</span>}
      </div>

      {broker.shortBio && <p className="font-bold text-sm mb-5 flex-grow leading-relaxed line-clamp-4">{broker.shortBio}</p>}

      <div className="flex flex-wrap gap-2 mb-8">
        {topSpecialties.map((spec) => (
          <span key={spec} className="text-xs font-black uppercase tracking-wider bg-neo-green text-neo-black border border-neo-black px-2 py-1">{spec}</span>
        ))}
        {topIndustries.map((industry) => <span key={industry} className="text-xs font-black uppercase tracking-wider bg-neo-pink text-neo-black border border-neo-black px-2 py-1">{industry}</span>)}
      </div>

      <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link href={`/${broker.slug}`} className="btn-brutal w-full bg-neo-black text-neo-white hover:bg-neo-black hover:text-neo-white border-2 border-neo-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all text-center">
          View Funding Site
        </Link>
        <Link href={`/${broker.slug}/apply`} className="btn-brutal-primary w-full text-sm py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all text-center">
          Apply
        </Link>
      </div>
    </div>
  );
}

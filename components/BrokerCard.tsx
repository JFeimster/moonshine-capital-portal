import { BrokerProfile } from '@/lib/types';
import Link from 'next/link';

interface BrokerCardProps {
  broker: BrokerProfile;
}

export function BrokerCard({ broker }: BrokerCardProps) {
  return (
    <div className="card-brutal flex flex-col h-full hover:bg-neo-white transition-colors duration-200">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-neo-black rounded-sm border-2 border-neo-black shadow-brutal flex-shrink-0 overflow-hidden">
          {broker.profileImage ? (
            <img src={broker.profileImage} alt={broker.fullName} className="w-full h-full object-cover" />
          ) : (
             <div className="w-full h-full flex items-center justify-center text-neo-white font-black text-xl">
               {broker.fullName.charAt(0)}
             </div>
          )}
        </div>
        <div>
          <h3 className="font-black text-xl uppercase tracking-tight">{broker.fullName}</h3>
          <p className="font-bold text-neo-blue text-sm uppercase">{broker.agencyName}</p>
        </div>
      </div>

      <div className="mb-4">
        <span className="inline-block bg-neo-black text-neo-white text-xs font-bold uppercase px-2 py-1 border border-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          {broker.city}, {broker.state}
        </span>
      </div>

      <p className="font-medium text-sm mb-6 flex-grow">
        {broker.shortBio}
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        {broker.fundingSpecialties.slice(0, 3).map((spec) => (
          <span key={spec} className="text-xs font-bold bg-neo-green/20 text-neo-black border border-neo-black px-2 py-1">
            {spec}
          </span>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-3">
        <Link href={`/directory/${broker.slug}`} className="btn-brutal w-full bg-neo-black text-neo-white hover:bg-neo-black hover:text-neo-white">
          View Profile
        </Link>
        <a href={broker.primaryCtaLink} target="_blank" rel="noopener noreferrer" className="btn-brutal-primary w-full text-sm py-2">
          {broker.ctaLabel || 'Connect'}
        </a>
      </div>
    </div>
  );
}

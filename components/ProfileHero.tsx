import { BrokerProfile } from '@/lib/types';
import { Avatar } from './Avatar';

interface ProfileHeroProps {
  broker: BrokerProfile;
}

export function ProfileHero({ broker }: ProfileHeroProps) {
  return (
    <div className="bg-neo-black text-neo-white p-8 md:p-16 border-4 border-neo-orange relative overflow-hidden shadow-brutal mb-12">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-neo-orange/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
        <Avatar
          src={broker.profileImage}
          alt={broker.fullName}
          className="w-32 h-32 md:w-48 md:h-48 bg-neo-cream border-4 border-neo-white shadow-brutal-white"
          fallbackClassName="text-neo-black text-5xl"
        />

        <div className="flex-1">
          <div className="inline-block bg-neo-orange text-neo-black font-black text-sm uppercase px-3 py-1 border-2 border-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-4">
            {broker.city}, {broker.state}
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2">{broker.fullName}</h1>
          <h2 className="text-xl md:text-3xl font-bold text-neo-orange uppercase tracking-wide mb-6">{broker.agencyName}</h2>

          <div className="flex flex-wrap gap-4">
            <a href={broker.primaryCtaLink} target="_blank" rel="noopener noreferrer" className="btn-brutal bg-neo-white text-neo-black px-8 py-4 text-lg">
              {broker.ctaLabel || 'Apply Now'}
            </a>
            {broker.websiteUrl && (
              <a href={broker.websiteUrl} target="_blank" rel="noopener noreferrer" className="btn-brutal-dark px-8 py-4 text-lg">
                Visit Website
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

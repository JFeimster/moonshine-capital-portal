import { BrokerProfile } from '@/lib/types';
import { Avatar } from './Avatar';

interface ProfileHeroProps {
  broker: BrokerProfile;
}

export function ProfileHero({ broker }: ProfileHeroProps) {
  const specialties = broker.fundingTypes || broker.fundingSpecialties || [];
  const ctaLabel = broker.primaryCta?.label || broker.ctaLabel || 'Apply for Funding';

  return (
    <div className="bg-neo-black text-neo-white border-4 border-neo-black shadow-brutal mb-16 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-neo-pink transform translate-x-1/2 -translate-y-1/2 rotate-45 opacity-20" />

      <div className="p-8 md:p-16 flex flex-col md:flex-row gap-12 items-center relative z-10">
        <Avatar
          src={broker.profileImage}
          alt={broker.fullName}
          className="w-48 h-48 md:w-64 md:h-64 bg-neo-white border-4 border-neo-black shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] flex-shrink-0 overflow-hidden"
          imageClassName="w-full h-full object-cover grayscale contrast-125"
          fallbackClassName="w-full h-full flex items-center justify-center text-neo-black font-black text-6xl"
        />

        <div className="flex-1 text-center md:text-left">
          <div className="inline-block bg-neo-yellow text-neo-black font-black text-sm uppercase px-3 py-1 mb-4 border border-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            Verified Partner
          </div>

          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-2">
            {broker.fullName}
          </h1>

          <h2 className="text-2xl md:text-4xl font-bold text-neo-blue mb-6 uppercase">
            {broker.agencyName}
          </h2>

          <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-8">
            <span className="bg-neo-white text-neo-black text-sm font-bold uppercase px-3 py-1 border border-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {broker.city}, {broker.state}
            </span>

            {broker.urgencyCategory && (
              <span className="bg-neo-orange text-neo-black text-sm font-bold uppercase px-3 py-1 border border-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                Speed: {broker.urgencyCategory}
              </span>
            )}

            {specialties.slice(0, 3).map((specialty) => (
              <span
                key={specialty}
                className="bg-neo-green text-neo-black text-sm font-bold uppercase px-3 py-1 border border-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                {specialty}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a
              href={`/out?broker=${broker.slug}&type=apply&source=profile`}
              target="_blank"
              rel="noopener noreferrer"
              data-tracking-id={broker.primaryCta?.trackingId}
              className="btn-brutal-primary text-lg px-8 py-4 bg-neo-green border-neo-black text-neo-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all text-center"
            >
              {ctaLabel}
            </a>

            {broker.websiteUrl && (
              <a
                href={`/out?broker=${broker.slug}&type=website&source=profile`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brutal text-lg px-8 py-4 bg-neo-white border-neo-black text-neo-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all text-center"
              >
                Visit Website
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

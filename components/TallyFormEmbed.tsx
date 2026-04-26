import Script from 'next/script';

export interface TallyFormEmbedProps {
  formId: string;
  title: string;
  description: string;
  badgeText?: string;
  badgeColor?: 'yellow' | 'pink' | 'blue' | 'green' | 'orange';
  titleColor?: 'black' | 'white';
}

export function TallyFormEmbed({
  formId,
  title,
  description,
  badgeText = 'Application',
  badgeColor = 'yellow',
  titleColor = 'black'
}: TallyFormEmbedProps) {
  const badgeColors = {
    yellow: 'bg-neo-yellow',
    pink: 'bg-neo-pink',
    blue: 'bg-neo-blue',
    green: 'bg-neo-green',
    orange: 'bg-neo-orange',
  };

  const titleColors = {
    black: 'text-neo-black',
    white: 'text-neo-white',
  };

  return (
    <section className="w-full">
      <div className="bg-neo-cream border-4 border-neo-black p-8 md:p-12 shadow-brutal text-neo-black relative">
        <div className={`absolute -top-6 -left-6 ${badgeColors[badgeColor]} border-2 border-neo-black px-4 py-2 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-2`}>
          {badgeText}
        </div>

        <h2 className={`text-3xl font-black uppercase tracking-tighter mb-6 mt-4 ${titleColors[titleColor]}`}>
          {title}
        </h2>
        <p className="font-medium text-lg mb-8 border-l-4 border-neo-pink pl-4">
          {description}
        </p>

        <iframe
          data-tally-src={`https://tally.so/embed/${formId}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`}
          loading="lazy"
          width="100%"
          height="500"
          frameBorder="0"
          marginHeight={0}
          marginWidth={0}
          title={title}>
        </iframe>
        <Script src="https://tally.so/widgets/embed.js" strategy="lazyOnload" />
      </div>
    </section>
  );
}

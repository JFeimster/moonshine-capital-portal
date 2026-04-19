interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  color?: 'yellow' | 'pink' | 'blue' | 'green' | 'orange';
}

export function SectionHeading({ title, subtitle, color = 'yellow' }: SectionHeadingProps) {
  const colorMap = {
    yellow: 'bg-neo-yellow',
    pink: 'bg-neo-pink',
    blue: 'bg-neo-blue',
    green: 'bg-neo-green',
    orange: 'bg-neo-orange',
  };

  return (
    <div className="mb-12">
      <div className={`inline-block ${colorMap[color]} text-neo-black font-black uppercase text-sm px-3 py-1 border-2 border-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-4`}>
        {subtitle || 'Section'}
      </div>
      <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
        {title}
      </h2>
    </div>
  );
}

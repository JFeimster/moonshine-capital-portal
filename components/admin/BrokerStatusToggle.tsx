interface BrokerStatusToggleProps {
  currentStatus?: 'pending' | 'in_review' | 'approved' | 'published' | 'hidden';
}

const statusOptions: Array<BrokerStatusToggleProps['currentStatus']> = [
  'pending',
  'in_review',
  'approved',
  'published',
  'hidden',
];

export function BrokerStatusToggle({ currentStatus = 'pending' }: BrokerStatusToggleProps) {
  return (
    <div className="border-4 border-neo-black bg-neo-white p-5 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
      <h3 className="mb-4 text-lg font-black uppercase tracking-tight text-neo-black">Broker status</h3>
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((status) => {
          const isActive = status === currentStatus;
          return (
            <button
              key={status}
              className={`border-2 border-neo-black px-3 py-2 text-xs font-black uppercase tracking-wide shadow-[3px_3px_0_0_rgba(0,0,0,1)] ${
                isActive ? 'bg-neo-green text-neo-black' : 'bg-neo-white text-neo-black'
              }`}
              type="button"
            >
              {status?.replace('_', ' ')}
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-sm font-medium leading-relaxed text-neo-black/75">
        Scaffold only for now. Wire this to Notion status + publish logic next so admin can actually control visibility instead of pretending.
      </p>
    </div>
  );
}

type QueueItem = {
  id: string;
  brokerName: string;
  email: string;
  status: 'pending' | 'in_review' | 'approved';
  source: string;
};

interface BrokerApprovalQueueProps {
  items?: QueueItem[];
}

const defaultItems: QueueItem[] = [
  {
    id: '1',
    brokerName: 'Darwin Hanneman',
    email: 'darwin@example.com',
    status: 'pending',
    source: 'Tally broker intake',
  },
  {
    id: '2',
    brokerName: 'Sample Broker',
    email: 'broker@example.com',
    status: 'in_review',
    source: 'Profile builder',
  },
];

export function BrokerApprovalQueue({ items = defaultItems }: BrokerApprovalQueueProps) {
  return (
    <div className="overflow-hidden border-4 border-neo-black bg-neo-white shadow-[10px_10px_0_0_rgba(0,0,0,1)]">
      <div className="border-b-4 border-neo-black bg-neo-black px-5 py-4 text-sm font-black uppercase tracking-wide text-neo-white">
        Broker approval queue
      </div>

      <div className="divide-y-4 divide-neo-black">
        {items.map((item) => (
          <div key={item.id} className="grid gap-4 px-5 py-5 md:grid-cols-[1.5fr_1.5fr_1fr_1fr] md:items-center">
            <div>
              <p className="text-lg font-black uppercase tracking-tight text-neo-black">{item.brokerName}</p>
              <p className="text-sm font-medium text-neo-black/70">{item.email}</p>
            </div>
            <p className="text-sm font-bold uppercase tracking-wide text-neo-black/75">{item.source}</p>
            <span className="inline-flex w-fit border-2 border-neo-black bg-neo-yellow px-3 py-1 text-xs font-black uppercase tracking-wide text-neo-black">
              {item.status.replace('_', ' ')}
            </span>
            <div className="flex flex-wrap gap-2">
              <button className="border-2 border-neo-black bg-neo-green px-3 py-2 text-xs font-black uppercase tracking-wide text-neo-black shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
                Review
              </button>
              <button className="border-2 border-neo-black bg-neo-pink px-3 py-2 text-xs font-black uppercase tracking-wide text-neo-black shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
                Request Fix
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

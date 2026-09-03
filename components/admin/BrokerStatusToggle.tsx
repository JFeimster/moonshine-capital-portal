import {
  APPROVAL_STATUSES,
  PROFILE_STATUSES,
  type ApprovalStatus,
  type ProfileStatus,
} from '@/lib/partner-contract';

interface BrokerStatusToggleProps {
  currentApprovalStatus?: ApprovalStatus;
  currentProfileStatus?: ProfileStatus;
}

function StatusRow<T extends string>({
  label,
  values,
  current,
}: {
  label: string;
  values: readonly T[];
  current: T;
}) {
  return (
    <div>
      <div className="mb-2 text-xs font-black uppercase tracking-wide text-neo-black/65">{label}</div>
      <div className="flex flex-wrap gap-2">
        {values.map((status) => (
          <button
            key={status}
            className={`border-2 border-neo-black px-3 py-2 text-xs font-black uppercase tracking-wide shadow-[3px_3px_0_0_rgba(0,0,0,1)] ${
              status === current ? 'bg-neo-green text-neo-black' : 'bg-neo-white text-neo-black'
            }`}
            type="button"
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>
    </div>
  );
}

export function BrokerStatusToggle({
  currentApprovalStatus = 'needs_review',
  currentProfileStatus = 'draft',
}: BrokerStatusToggleProps) {
  return (
    <div className="border-4 border-neo-black bg-neo-white p-5 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
      <h3 className="mb-4 text-lg font-black uppercase tracking-tight text-neo-black">Canonical lifecycle</h3>
      <div className="space-y-5">
        <StatusRow label="Approval Status" values={APPROVAL_STATUSES} current={currentApprovalStatus} />
        <StatusRow label="Profile Status" values={PROFILE_STATUSES} current={currentProfileStatus} />
      </div>
      <p className="mt-4 text-sm font-medium leading-relaxed text-neo-black/75">
        Scaffold only. Approval and publication remain separate operator-controlled states; wire writes through the canonical Notion lifecycle service before enabling these controls.
      </p>
    </div>
  );
}

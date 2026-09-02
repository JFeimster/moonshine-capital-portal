'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full border-2 border-neo-black bg-neo-green px-4 py-3 font-black uppercase tracking-wide text-neo-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:bg-neo-green/50 disabled:shadow-none"
    >
      {pending ? 'Authenticating...' : 'Submit'}
    </button>
  );
}

export function AccessForm({ returnTo }: { returnTo?: string }) {
  const [state, formAction] = useFormState(authenticate, { error: null });

  return (
    <form action={formAction} className="space-y-4">
      {returnTo && <input type="hidden" name="returnTo" value={returnTo} />}
      <div>
        <label htmlFor="code" className="sr-only">
          Access Code
        </label>
        <input
          id="code"
          name="code"
          type="password"
          required
          autoFocus
          className="w-full border-2 border-neo-black bg-neo-white p-3 font-medium outline-none focus:border-neo-blue"
          placeholder="Enter code"
        />
      </div>

      {state.error && (
        <div className="border-2 border-neo-black bg-neo-pink p-3 text-sm font-black uppercase text-neo-black">
          {state.error}
        </div>
      )}

      <SubmitButton />
    </form>
  );
}

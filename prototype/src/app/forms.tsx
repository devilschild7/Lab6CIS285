"use client";

import { useActionState } from "react";
import { addExpense, addMember, createGroup, type FormState } from "./actions";

const buttonStyle = "rounded-lg bg-teal-800 px-4 py-2.5 font-semibold text-white hover:bg-teal-900 disabled:opacity-60";

function Feedback({ state }: { state: FormState }) {
  if (state.error) return <p role="alert" className="text-sm font-medium text-red-700">{state.error}</p>;
  if (state.success) return <p role="status" className="text-sm font-medium text-teal-800">{state.success}</p>;
  return null;
}

export function GroupForm() {
  const [state, action, pending] = useActionState(createGroup, {});
  return (
    <form action={action} className="grid gap-3">
      <label className="field">Group name<input name="name" maxLength={80} required placeholder="e.g. Weekend trip" /></label>
      <button className={buttonStyle} disabled={pending}>Create group</button>
      <Feedback state={state} />
    </form>
  );
}

export function MemberForm({ groupId }: { groupId: number }) {
  const [state, action, pending] = useActionState(addMember, {});
  return (
    <form action={action} className="grid gap-3">
      <input type="hidden" name="groupId" value={groupId} />
      <label className="field">Member name<input name="name" maxLength={80} required placeholder="e.g. Alice" /></label>
      <button className={buttonStyle} disabled={pending}>Add member</button>
      <Feedback state={state} />
    </form>
  );
}

export function ExpenseForm({ groupId, members }: { groupId: number; members: { id: number; name: string }[] }) {
  const [state, action, pending] = useActionState(addExpense, {});
  if (!members.length) return <p className="text-slate-600">Add a member to record an expense.</p>;

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="groupId" value={groupId} />
      <label className="field">Description<input name="description" maxLength={160} required placeholder="e.g. Dinner" /></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="field">Amount ($)<input name="amount" inputMode="decimal" required placeholder="0.00" /></label>
        <label className="field">Paid by
          <select name="payerId" defaultValue="" required>
            <option value="" disabled>Select a member</option>
            {members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
          </select>
        </label>
      </div>
      <fieldset className="rounded-lg border border-slate-200 px-3 pb-3">
        <legend className="px-1 text-sm font-semibold">Split equally among</legend>
        <div className="grid gap-2 pt-1 sm:grid-cols-2">
          {members.map((member) => (
            <label key={member.id} className="flex min-w-0 items-start gap-2 break-all">
              <input type="checkbox" name="participantIds" value={member.id} className="mt-1 size-4 shrink-0 accent-teal-800" />
              {member.name}
            </label>
          ))}
        </div>
      </fieldset>
      <button className={buttonStyle} disabled={pending}>Record expense</button>
      <Feedback state={state} />
    </form>
  );
}

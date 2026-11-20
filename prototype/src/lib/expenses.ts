const maxPrismaInt = 2_147_483_647;

export function parseId(value: unknown) {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) return null;
  const id = Number(value);
  return id <= maxPrismaInt ? id : null;
}

export function parseAmount(value: unknown) {
  if (typeof value !== "string") return null;
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(value.trim());
  if (!match) return null;
  const cents = Number(match[1]) * 100 + Number((match[2] ?? "").padEnd(2, "0"));
  return cents > 0 && cents <= maxPrismaInt ? cents : null;
}

// The lowest member IDs receive any extra cents, independent of selection order.
export function splitExpense(amountCents: number, participantIds: number[]) {
  const base = Math.floor(amountCents / participantIds.length);
  const remainder = amountCents % participantIds.length;
  return [...participantIds].sort((a, b) => a - b).map((memberId, index) => ({
    memberId,
    amountCents: base + (index < remainder ? 1 : 0),
  }));
}

export function calculateBalances(
  members: { id: number }[],
  expenses: { payerId: number; amountCents: number; shares: ReturnType<typeof splitExpense> }[],
) {
  const balances = new Map(members.map(({ id }) => [id, 0n]));
  for (const { payerId, amountCents, shares } of expenses) {
    balances.set(payerId, balances.get(payerId)! + BigInt(amountCents));
    for (const share of shares) {
      balances.set(share.memberId, balances.get(share.memberId)! - BigInt(share.amountCents));
    }
  }
  return balances;
}

export function formatMoney(cents: number | bigint) {
  const value = BigInt(cents);
  const absolute = value < 0n ? -value : value;
  return `${value < 0n ? "-" : ""}$${(absolute / 100n).toLocaleString("en-US")}.${String(absolute % 100n).padStart(2, "0")}`;
}

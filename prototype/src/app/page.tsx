import Link from "next/link";
import { db } from "@/lib/db";
import { calculateBalances, formatMoney, parseId } from "@/lib/expenses";
import { ExpenseForm, GroupForm, MemberForm } from "./forms";

export const dynamic = "force-dynamic";

const card = "min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6";
const heading = "mb-4 text-xl font-bold tracking-tight";

export default async function Home({ searchParams }: { searchParams: Promise<{ group?: string | string[] }> }) {
  const requestedId = parseId((await searchParams).group);
  const groups = await db.group.findMany({ orderBy: { id: "desc" } });
  const selected = groups.find(({ id }) => id === requestedId) ?? groups[0];
  const group = selected && await db.group.findUniqueOrThrow({
    where: { id: selected.id },
    include: {
      members: { orderBy: { id: "asc" } },
      expenses: {
        orderBy: { id: "desc" },
        include: { payer: true, shares: { orderBy: { memberId: "asc" }, include: { member: true } } },
      },
    },
  });
  const balances = group && calculateBalances(group.members, group.expenses);

  return (
    <>
      <header className="bg-teal-950 text-white">
        <div className="mx-auto max-w-6xl px-5 py-7 sm:px-8">
          <h1 className="text-3xl font-bold tracking-tight">SplitSmart</h1>
          <p className="mt-1 text-teal-100">Track shared expenses and see who owes what.</p>
        </div>
      </header>
      <main className="mx-auto grid max-w-6xl items-start gap-5 px-5 py-7 sm:px-8 md:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className={card}>
          <h2 className={heading}>Groups</h2>
          {groups.length > 0 && (
            <nav aria-label="Groups" className="mb-5 grid gap-1">
              {groups.map(({ id, name }) => (
                <Link key={id} href={`/?group=${id}`} aria-current={id === group?.id ? "page" : undefined}
                  className={`break-words rounded-lg px-3 py-2 hover:bg-teal-50 ${id === group?.id ? "bg-teal-100 font-semibold text-teal-950" : "text-slate-700"}`}>
                  {name}
                </Link>
              ))}
            </nav>
          )}
          <GroupForm />
        </aside>
        {group && balances ? (
          <div className="min-w-0" key={group.id}>
            <h2 className="mb-4 break-words text-2xl font-bold tracking-tight">{group.name}</h2>
            <div className="grid items-start gap-5 lg:grid-cols-2">
              <section className={card}>
                <h3 className={heading}>Members and balances</h3>
                {group.members.length ? (
                  <ul className="mb-5 divide-y divide-slate-100">
                    {group.members.map(({ id, name }) => {
                      const balance = balances.get(id)!;
                      const status = balance > 0n ? "to receive" : balance < 0n ? "owed" : "settled";
                      return (
                        <li key={id} className="flex items-start justify-between gap-3 py-2.5">
                          <span className="min-w-0 break-words">{name}</span>
                          <span className="shrink-0 text-right">
                            <span className={`block font-semibold tabular-nums ${balance > 0n ? "text-teal-800" : balance < 0n ? "text-red-700" : "text-slate-700"}`}>
                              {balance > 0n ? "+" : ""}{formatMoney(balance)}
                            </span>
                            <span className="block text-sm text-slate-600">{status}</span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                ) : <p className="mb-4 text-slate-600">No members yet.</p>}
                <MemberForm groupId={group.id} />
              </section>
              <section className={card}>
                <h3 className={heading}>Record an expense</h3>
                <ExpenseForm groupId={group.id} members={group.members} />
              </section>
              <section className={`${card} lg:col-span-2`}>
                <h3 className={heading}>Expense history</h3>
                {group.expenses.length ? (
                  <ul className="divide-y divide-slate-200">
                    {group.expenses.map((expense) => (
                      <li key={expense.id} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="min-w-0 break-words font-semibold">{expense.description}</h4>
                          <span className="shrink-0 font-semibold tabular-nums">{formatMoney(expense.amountCents)}</span>
                        </div>
                        <p className="mt-1 break-words text-sm text-slate-600">Paid by {expense.payer.name} · <time dateTime={expense.createdAt.toISOString()}>{expense.createdAt.toLocaleDateString("en-US", { dateStyle: "medium", timeZone: "UTC" })}</time></p>
                        <p className="mt-1 break-words text-sm text-slate-600">Split among {expense.shares.map(({ member, amountCents }) => `${member.name} (${formatMoney(amountCents)})`).join(", ")}</p>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-slate-600">No expenses recorded yet.</p>}
              </section>
            </div>
          </div>
        ) : (
          <section className={card}>
            <h2 className={heading}>Create your first group</h2>
            <p className="text-slate-600">Once you create a group, you can add members and record expenses here.</p>
          </section>
        )}
      </main>
    </>
  );
}

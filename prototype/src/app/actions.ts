"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { parseAmount, parseId, splitExpense } from "@/lib/expenses";

export type FormState = { error?: string; success?: string };

function readText(data: FormData, field: string) {
  const value = data.get(field);
  return typeof value === "string" ? value.trim() : "";
}

export async function createGroup(_: FormState, data: FormData): Promise<FormState> {
  const name = readText(data, "name");
  if (!name || name.length > 80) return { error: "Enter a group name of 1 to 80 characters." };

  const group = await db.group.create({ data: { name } });
  revalidatePath("/");
  redirect(`/?group=${group.id}`);
}

export async function addMember(_: FormState, data: FormData): Promise<FormState> {
  const groupId = parseId(data.get("groupId"));
  const name = readText(data, "name");
  if (!name || name.length > 80) return { error: "Enter a member name of 1 to 80 characters." };
  if (!groupId || !(await db.group.findUnique({ where: { id: groupId } }))) {
    return { error: "Select an existing group." };
  }

  await db.member.create({ data: { name, groupId } });
  revalidatePath("/");
  return { success: "Member added." };
}

export async function addExpense(_: FormState, data: FormData): Promise<FormState> {
  const groupId = parseId(data.get("groupId"));
  const description = readText(data, "description");
  const amountCents = parseAmount(data.get("amount"));
  const payerId = parseId(data.get("payerId"));
  const participantIds = data.getAll("participantIds").map(parseId);

  if (!groupId) return { error: "Select an existing group." };
  if (!description || description.length > 160) return { error: "Enter a description of 1 to 160 characters." };
  if (amountCents === null) {
    return { error: "Enter an amount from $0.01 to $21,474,836.47 with at most two decimal places." };
  }
  if (!payerId) return { error: "Select a valid payer." };
  if (!participantIds.length || !participantIds.every((id) => id !== null)) {
    return { error: "Select at least one valid participant." };
  }
  if (new Set(participantIds).size !== participantIds.length) {
    return { error: "Select each participant only once." };
  }

  const memberIds = [...new Set([payerId, ...participantIds])];
  const memberCount = await db.member.count({ where: { groupId, id: { in: memberIds } } });
  if (memberCount !== memberIds.length) {
    return { error: "The payer and every participant must belong to this group." };
  }

  await db.expense.create({
    data: { groupId, description, amountCents, payerId, shares: { create: splitExpense(amountCents, participantIds) } },
  });
  revalidatePath("/");
  return { success: "Expense recorded." };
}

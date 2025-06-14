import { db } from "#db/index.js";
import { Transactions } from "#db/schema/index.js";
import { eq, gte, lte, sql } from "drizzle-orm";
import { TransactionReadPayload } from "./types.js";

export async function getTransactionFromtransactionId(transactionId: number) {
  if (!transactionId) return null;

  const transactionData = await db
    .select()
    .from(Transactions)
    .where(eq(Transactions.id, transactionId));

  if (!transactionData.length) {
    return null;
  }

  return transactionData[0];
}

export function getCommonFilters(
  filters: TransactionReadPayload,
  organizationId: number,
) {
  const {
    payee,
    minAmount,
    maxAmount,
    category,
    dateFrom,
    dateTo,
    cursor,
    pageSize = 10,
  } = filters;

  const commonFilters = [
    eq(Transactions.organization, organizationId),
    eq(Transactions.isDeleted, false),
  ];

  if (payee) {
    commonFilters.push(
      sql`LOWER(${Transactions.payee}) LIKE LOWER(${`%${payee}%`})`,
    );
  }

  if (category) {
    commonFilters.push(eq(Transactions.category, category));
  }

  if (minAmount !== undefined) {
    commonFilters.push(
      gte(Transactions.amountInPaise, Math.floor(minAmount * 100)),
    );
  }

  if (maxAmount !== undefined) {
    commonFilters.push(
      lte(Transactions.amountInPaise, Math.floor(maxAmount * 100)),
    );
  }

  if (dateFrom) {
    commonFilters.push(
      gte(Transactions.date, new Date(dateFrom).toISOString()),
    );
  }

  if (dateTo) {
    commonFilters.push(lte(Transactions.date, new Date(dateTo).toISOString()));
  }

  return commonFilters;
}

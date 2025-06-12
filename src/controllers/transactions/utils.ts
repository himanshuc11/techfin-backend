import { db } from "#db/index.js";
import { Transactions } from "#db/schema/index.js";
import { eq } from "drizzle-orm";

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

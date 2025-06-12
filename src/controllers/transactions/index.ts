import { RESPONSE_ERROR_CODES } from "#constants/errorCodes.js";
import { STATUS_CODES } from "#constants/statusCodes.js";
import { getUserFromUsername } from "#controllers/users/utils.js";
import { db } from "#db/index.js";
import { TransactionHistory, Transactions } from "#db/schema/index.js";
import {
  generateErrorResponse,
  generateSuccessResponse,
} from "#utils/generateResponse.js";
import { AddTransactionParams } from "./types.js";

export async function addTransaction(params: AddTransactionParams) {
  try {
    const user = await getUserFromUsername(params.username);

    if (!user) {
      throw new Error("Invalid username");
    }

    const amountInPaise = params.amount * 100;
    const organizationId = user.organization;
    const date = new Date(params.date).toISOString();

    const result = await db.transaction(async (tx) => {
      const insertedTx = await tx
        .insert(Transactions)
        .values({
          payee: params.payee,
          amountInPaise,
          category: params.category,
          date,
          isDeleted: false,
          organization: organizationId,
        })
        .returning();

      await tx.insert(TransactionHistory).values({
        payee: params.payee,
        amountInPaise,
        category: params.category,
        date,
        isDeleted: false,
        organization: organizationId,
        transactionId: insertedTx[0].id,
        updatedBy: user.id,
      });

      return insertedTx;
    });

    return generateSuccessResponse({
      status: STATUS_CODES.OK,
      data: result[0],
    });
  } catch (err: unknown) {
    console.error("ERROR", err);

    if (err instanceof Error && err.message === "Invalid username") {
      return generateErrorResponse({
        status: STATUS_CODES.NOT_FOUND,
        error: RESPONSE_ERROR_CODES.USER_NOT_FOUND,
      });
    }

    return generateErrorResponse({
      status: STATUS_CODES.SERVER_ERROR,
      error: RESPONSE_ERROR_CODES.SOMETHING_WENT_WRONG_SERVER_ERROR,
    });
  }
}

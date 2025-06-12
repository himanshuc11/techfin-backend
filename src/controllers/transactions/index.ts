import { RESPONSE_ERROR_CODES } from "#constants/errorCodes.js";
import { STATUS_CODES } from "#constants/statusCodes.js";
import { getUserFromUsername } from "#controllers/users/utils.js";
import { db } from "#db/index.js";
import { TransactionHistory, Transactions } from "#db/schema/index.js";
import {
  generateErrorResponse,
  generateSuccessResponse,
} from "#utils/generateResponse.js";
import { eq } from "drizzle-orm";
import {
  AddTransactionParams,
  DeleteTransactionPayload,
  UpdateTransactionPayload,
} from "./types.js";

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

export async function updateTransaction(params: UpdateTransactionPayload) {
  try {
    const user = await getUserFromUsername(params.username);

    if (!user) {
      throw new Error("Invalid username");
    }

    let mappedData: { amount?: number; date?: string } = {};

    if (params.amount) {
      mappedData.amount = params.amount * 100;
    }

    if (params.date) {
      mappedData.date = new Date(params.date).toISOString();
    }

    const transactionData = {
      ...params,
      ...mappedData,
    } as { [key: string]: any };

    delete transactionData.id;

    const result = await db.transaction(async (tx) => {
      const updatedTx = await tx
        .update(Transactions)
        .set(transactionData)
        .where(eq(Transactions.id, params.transactionId))
        .returning();

      if (!updatedTx.length) {
        return updatedTx;
      }

      const historyData = {
        payee: updatedTx[0].payee,
        amountInPaise: updatedTx[0].amountInPaise,
        category: updatedTx[0].category,
        date: updatedTx[0].date,
        isDeleted: updatedTx[0].isDeleted,
        organization: updatedTx[0].organization,
        updatedBy: user.id,
        transactionId: updatedTx[0].id,
      };

      await tx.insert(TransactionHistory).values(historyData);

      return updatedTx;
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

export async function deleteTransaction(params: DeleteTransactionPayload) {
  try {
    const user = await getUserFromUsername(params.username);

    if (!user) {
      throw new Error("Invalid username");
    }

    const result = await db.transaction(async (tx) => {
      const updatedTx = await tx
        .update(Transactions)
        .set({ isDeleted: true })
        .where(eq(Transactions.id, params.transactionId))
        .returning();

      if (!updatedTx.length) {
        return updatedTx;
      }

      console.log("::3");
      const historyData = {
        payee: updatedTx[0].payee,
        amountInPaise: updatedTx[0].amountInPaise,
        category: updatedTx[0].category,
        date: updatedTx[0].date,
        isDeleted: updatedTx[0].isDeleted,
        organization: updatedTx[0].organization,
        updatedBy: user.id,
        transactionId: updatedTx[0].id,
      };

      await tx.insert(TransactionHistory).values(historyData);

      return updatedTx;
    });

    return generateSuccessResponse({
      status: STATUS_CODES.OK,
      data: {},
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

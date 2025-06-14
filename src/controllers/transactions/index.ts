import { RESPONSE_ERROR_CODES } from "#constants/errorCodes.js";
import { STATUS_CODES } from "#constants/statusCodes.js";
import { getUserFromUsername } from "#controllers/users/utils.js";
import { db } from "#db/index.js";
import { TransactionHistory, Transactions } from "#db/schema/index.js";
import {
  generateErrorResponse,
  generateSuccessResponse,
} from "#utils/generateResponse.js";
import { and, eq, gt, lte, gte, sql, lt } from "drizzle-orm";
import {
  AddTransactionParams,
  DeleteTransactionPayload,
  TransactionReadPayload,
  UpdateTransactionPayload,
  Username,
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

    let mappedData: { amountInPaise?: number; date?: string } = {};

    if (params.amount) {
      mappedData.amountInPaise = params.amount * 100;
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

export async function readTransactions(
  params: Username,
  filters: TransactionReadPayload = {},
) {
  try {
    const user = await getUserFromUsername(params.username);

    if (!user) {
      throw new Error("Invalid username");
    }

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
      eq(Transactions.organization, user.organization),
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
      commonFilters.push(
        lte(Transactions.date, new Date(dateTo).toISOString()),
      );
    }

    const nextQueryFilters = [...commonFilters];

    if (cursor !== undefined) {
      nextQueryFilters.push(gt(Transactions.id, cursor));
    }

    // select id, payee, amountInPaise, category, from transactions where isDeleted = false and organization = user.organization;
    const query = db
      .select({
        id: Transactions.id,
        payee: Transactions.payee,
        amount: sql`ROUND(${Transactions.amountInPaise} / 100.0, 2)`,
        category: Transactions.category,
        date: Transactions.date,
      })
      .from(Transactions)
      .where(and(...nextQueryFilters))
      .orderBy(Transactions.id)
      .limit(pageSize + 1); // +1 to check if there's more

    const results = await query;
    const data = results.slice(0, pageSize);
    const nextCursor =
      results.length > pageSize ? results[pageSize - 1].id : null;

    // Get previous page data to determine previous cursor
    let prevCursorQuery = null;

    if (cursor) {
      prevCursorQuery = db
        .select({ id: Transactions.id })
        .from(Transactions)
        .where(and(...commonFilters, lt(Transactions.id, cursor)))
        .orderBy(sql`${Transactions.id} desc`)
        .limit(pageSize);
    }

    const previousResults = cursor ? await prevCursorQuery : null;

    const previousCursor = previousResults?.length
      ? previousResults[previousResults.length - 1].id
      : null;

    // Get total count matching filters
    const totalResult = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(Transactions)
      .where(and(...commonFilters));

    return generateSuccessResponse({
      status: STATUS_CODES.OK,
      data: {
        nextCursor,
        previousCursor,
        transactions: data,
        totalResult: totalResult[0].count,
      },
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

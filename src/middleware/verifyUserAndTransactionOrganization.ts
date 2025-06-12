import { RESPONSE_ERROR_CODES } from "#constants/errorCodes.js";
import { STATUS_CODES } from "#constants/statusCodes.js";
import { getTransactionFromtransactionId } from "#controllers/transactions/utils.js";
import { getUserFromUsername } from "#controllers/users/utils.js";
import { generateErrorResponse } from "#utils/generateResponse.js";
import { Request, Response, NextFunction } from "express";

export async function verifyUserAndTransactionOrganization(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const user = req.user;
  const { status, payload } = generateErrorResponse({
    status: STATUS_CODES.UNAUTHORIZED,
    error: RESPONSE_ERROR_CODES.UNAUTHORIZED,
  });

  if (!user) {
    res.status(status).json(payload);
    return;
  }

  try {
    const userData = await getUserFromUsername(user.username);
    if (!userData) {
      res.status(status).json(payload);
      return;
    }

    const transactionData = await getTransactionFromtransactionId(
      req.body.transactionId,
    );
    if (!transactionData) {
      res.status(status).json(payload);
      return;
    }

    if (
      transactionData?.organization === userData?.organization &&
      !!transactionData?.organization &&
      !!userData?.organization
    ) {
      next();
      return;
    }

    res.status(status).json(payload);
  } catch (err) {
    const { status, payload } = generateErrorResponse({
      status: STATUS_CODES.FORBIDDEN,
      error: RESPONSE_ERROR_CODES.UNAUTHORIZED,
    });
    res.status(status).json(payload);
    return;
  }
}

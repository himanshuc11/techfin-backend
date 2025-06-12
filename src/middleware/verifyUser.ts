import { JWT_TOKEN } from "#constants/env.js";
import { RESPONSE_ERROR_CODES } from "#constants/errorCodes.js";
import { STATUS_CODES } from "#constants/statusCodes.js";
import { UserRequestCookiePayload } from "#controllers/users/types.js";
import { generateErrorResponse } from "#utils/generateResponse.js";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend the Request type to include "user"
declare global {
  namespace Express {
    interface Request {
      user?: UserRequestCookiePayload;
    }
  }
}

export function verifyUserMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies?.accessToken;

  if (!token) {
    const { status, payload } = generateErrorResponse({
      status: STATUS_CODES.UNAUTHORIZED,
      error: RESPONSE_ERROR_CODES.UNAUTHORIZED,
    });
    res.status(status).json(payload);
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_TOKEN) as UserRequestCookiePayload;
    req.user = decoded;
    next();
  } catch (err) {
    const { status, payload } = generateErrorResponse({
      status: STATUS_CODES.FORBIDDEN,
      error: RESPONSE_ERROR_CODES.UNAUTHORIZED,
    });
    res.status(status).json(payload);
    return;
  }
}

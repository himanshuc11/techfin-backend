import type { Request, Response } from "express";
import type { LoginUserRequestPayload } from "./types.js";
import { Users } from "#db/schema/index.js";
import { db } from "#db/index.js";
import { eq } from "drizzle-orm";
import { generateErrorResponse } from "#utils/generateResponse.js";
import { RESPONSE_ERROR_CODES } from "#constants/errorCodes.js";
import { STATUS_CODES } from "#constants/statusCodes.js";
import { diduserHaveValidCredentials } from "./utils.js";
import { JWT_TOKEN } from "#constants/env.js";
import jwt from "jsonwebtoken";

export async function loginUser(userData: LoginUserRequestPayload) {
  try {
    const user = await db
      .select()
      .from(Users)
      .where(eq(Users.username, userData.username));

    if (user.length !== 1) {
      return generateErrorResponse({
        status: STATUS_CODES.NOT_FOUND,
        error: RESPONSE_ERROR_CODES.USER_NOT_FOUND,
      });
    }

    const isValid = await diduserHaveValidCredentials(userData);

    if (!isValid) {
      return generateErrorResponse({
        status: STATUS_CODES.NOT_FOUND,
        error: RESPONSE_ERROR_CODES.USER_NOT_FOUND,
      });
    }

    // User has matched, need to login
    const userDetails = {
      username: user[0].username,
      role: user[0].role,
    };

    const accessToken = jwt.sign(userDetails, JWT_TOKEN, {
      algorithm: "HS256",
      expiresIn: "1h",
    });

    return {
      status: STATUS_CODES.OK,
      payload: {},
      accessToken,
    };
  } catch (err) {
    console.error("::ERROR", err);
    return generateErrorResponse({
      status: STATUS_CODES.SERVER_ERROR,
      error: RESPONSE_ERROR_CODES.SOMETHING_WENT_WRONG_SERVER_ERROR,
    });
  }
}

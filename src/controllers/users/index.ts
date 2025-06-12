import type {
  LoginUserRequestPayload,
  UserRequestCookiePayload,
} from "./types.js";
import { generateErrorResponse } from "#utils/generateResponse.js";
import { RESPONSE_ERROR_CODES } from "#constants/errorCodes.js";
import { STATUS_CODES } from "#constants/statusCodes.js";
import { diduserHaveValidCredentials, getUserFromUsername } from "./utils.js";
import { JWT_TOKEN } from "#constants/env.js";
import jwt from "jsonwebtoken";

export async function loginUser(userData: LoginUserRequestPayload) {
  try {
    const userDetails = await getUserFromUsername(userData.username);

    if (!userDetails) {
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
    const tokenData: UserRequestCookiePayload = {
      username: userDetails.username,
      role: userDetails.role,
    };

    const accessToken = jwt.sign(tokenData, JWT_TOKEN, {
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

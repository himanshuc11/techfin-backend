import {
  ACCESS_TOKEN_COOKIE_KEY,
  COOKIE_CONFIG,
} from "#constants/cookieConfig.js";
import { STATUS_CODES } from "#constants/statusCodes.js";
import { loginUser } from "#controllers/users/index.js";
import { LoginUserRequestPayload } from "#controllers/users/types.js";
import { userLoginRequestPayload } from "#controllers/users/validators.js";
import validateDataSchemaMiddleware from "#middleware/validateDataSchema.js";
import { verifyUserMiddleware } from "#middleware/verifyUser.js";
import express from "express";

const userRouter = express.Router();

userRouter.post(
  "/login",
  validateDataSchemaMiddleware(userLoginRequestPayload),
  async (req, res) => {
    const userData = req.body as LoginUserRequestPayload;
    const result = await loginUser(userData);
    const { status, payload } = result;

    const accessToken =
      ACCESS_TOKEN_COOKIE_KEY in result ? result.accessToken : undefined;

    if (accessToken) {
      res.cookie(ACCESS_TOKEN_COOKIE_KEY, accessToken, COOKIE_CONFIG);
    }

    res.status(status).send(payload);
  },
);

userRouter.post("/logout", verifyUserMiddleware, async (req, res) => {
  res
    .clearCookie(ACCESS_TOKEN_COOKIE_KEY, COOKIE_CONFIG)
    .status(STATUS_CODES.PERMANENT_REDIRECT)
    .redirect("/login");
});

export default userRouter;

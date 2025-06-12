import { loginUser } from "#controllers/users/index.js";
import { LoginUserRequestPayload } from "#controllers/users/types.js";
import { userLoginRequestPayload } from "#controllers/users/validators.js";
import validateDataSchemaMiddleware from "#middleware/index.js";
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
      "accessToken" in result ? result.accessToken : undefined;

    if (accessToken) {
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // HTTPS only in prod
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        path: process.env.NODE_ENV === "production" ? "" : "/", // In production should be set to deployed site's url
      });
    }

    res.status(status).send(payload);
  },
);

export default userRouter;

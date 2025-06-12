import { userLoginRequestPayload } from "#controllers/users/validators.js";
import validateDataSchemaMiddleware from "#middleware/index.js";
import express from "express";

const userRouter = express.Router();

userRouter.post(
  "/login",
  validateDataSchemaMiddleware(userLoginRequestPayload),
  (req, res) => {
    console.log("::SUCCESS");
    res.status(200);
  },
);

export default userRouter;

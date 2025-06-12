import express from "express";

const userRouter = express.Router();

userRouter.get("/", () => {
  console.log("Get User");
});

export default userRouter;

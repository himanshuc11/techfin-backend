import express from "express";

const transactionRouter = express.Router();

transactionRouter.get("/", () => {
  console.log("Get Transactions");
});

export default transactionRouter;

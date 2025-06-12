import {
  addTransaction,
  updateTransaction,
} from "#controllers/transactions/index.js";
import {
  TransactionInsertRequestPayload,
  TransactionUpdateRequestPayload,
} from "#controllers/transactions/types.js";
import {
  transactionInsertRequestPayload,
  transactionUpdateRequestPayload,
} from "#controllers/transactions/validation.js";
import validateDataSchemaMiddleware from "#middleware/index.js";
import { verifyUserMiddleware } from "#middleware/verifyUser.js";
import { verifyUserAndTransactionOrganization } from "#middleware/verifyUserAndTransactionOrganization.js";
import express from "express";

const transactionRouter = express.Router();

transactionRouter.get("/", () => {
  console.log("Get Transactions");
});

transactionRouter.post(
  "/add",
  verifyUserMiddleware,
  validateDataSchemaMiddleware(transactionInsertRequestPayload),
  async (req, res) => {
    const body = req.body as TransactionInsertRequestPayload;
    const username = req.user!.username;

    const addTransactionPayload = { ...body, username };

    const { status, payload } = await addTransaction(addTransactionPayload);

    res.status(status).send(payload);
  },
);

transactionRouter.patch(
  "/update",
  verifyUserMiddleware,
  validateDataSchemaMiddleware(transactionUpdateRequestPayload),
  verifyUserAndTransactionOrganization,
  async (req, res) => {
    const body = req.body as TransactionUpdateRequestPayload;
    const username = req.user!.username;

    const updateTransactionPayload = { ...body, username };

    const { status, payload } = await updateTransaction(
      updateTransactionPayload,
    );

    res.status(status).send(payload);
  },
);

export default transactionRouter;

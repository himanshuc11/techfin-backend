import {
  addTransaction,
  deleteTransaction,
  updateTransaction,
} from "#controllers/transactions/index.js";
import {
  TransactionDeleteRequestPayload,
  TransactionInsertRequestPayload,
  TransactionUpdateRequestPayload,
} from "#controllers/transactions/types.js";
import {
  transactionDeleteRequestPayload,
  transactionInsertRequestPayload,
  transactionUpdateRequestPayload,
} from "#controllers/transactions/validation.js";
import validateDataSchemaMiddleware from "#middleware/index.js";
import { verifyUserMiddleware } from "#middleware/verifyUser.js";
import { verifyUserAndTransactionOrganization } from "#middleware/verifyUserAndTransactionOrganization.js";
import express from "express";

const transactionRouter = express.Router();

transactionRouter.get("/", verifyUserMiddleware, () => {
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

transactionRouter.delete(
  "/delete",
  verifyUserMiddleware,
  validateDataSchemaMiddleware(transactionDeleteRequestPayload),
  verifyUserAndTransactionOrganization,
  async (req, res) => {
    const body = req.body as TransactionDeleteRequestPayload;
    const username = req.user!.username;

    const updateTransactionPayload = { ...body, username };

    const { status, payload } = await deleteTransaction(
      updateTransactionPayload,
    );

    res.status(status).send(payload);
  },
);

export default transactionRouter;

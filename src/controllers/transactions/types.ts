import { z } from "zod";
import {
  transactionInsertRequestPayload,
  transactionUpdateRequestPayload,
} from "./validation.js";

export type TransactionInsertRequestPayload = z.infer<
  typeof transactionInsertRequestPayload.shape.body
>;

export type TransactionUpdateRequestPayload = z.infer<
  typeof transactionUpdateRequestPayload.shape.body
>;

export type TransactionDeleteRequestPayload = z.infer<
  typeof transactionUpdateRequestPayload.shape.body
>;

export type AddTransactionParams = TransactionInsertRequestPayload & {
  username: string;
};

export type UpdateTransactionPayload = TransactionUpdateRequestPayload & {
  username: string;
};

export type DeleteTransactionPayload = TransactionDeleteRequestPayload & {
  username: string;
};

import { z } from "zod";
import {
  transactionInsertRequestPayload,
  transactionUpdateRequestPayload,
} from "./validation.js";

export type Username = {
  username: string;
};

export type TransactionInsertRequestPayload = z.infer<
  typeof transactionInsertRequestPayload.shape.body
>;

export type TransactionUpdateRequestPayload = z.infer<
  typeof transactionUpdateRequestPayload.shape.body
>;

export type TransactionDeleteRequestPayload = z.infer<
  typeof transactionUpdateRequestPayload.shape.body
>;

export type AddTransactionParams = TransactionInsertRequestPayload & Username;

export type UpdateTransactionPayload = TransactionUpdateRequestPayload &
  Username;

export type DeleteTransactionPayload = TransactionDeleteRequestPayload &
  Username;

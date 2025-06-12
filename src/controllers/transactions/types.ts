import { z } from "zod";
import { transactionInsertRequestPayload } from "./validation.js";

export type TransactionInsertRequestPayload = z.infer<
  typeof transactionInsertRequestPayload.shape.body
>;

export type AddTransactionParams = TransactionInsertRequestPayload & {
  username: string;
};

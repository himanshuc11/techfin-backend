import { z } from "zod";

export const transactionInsertRequestPayload = z.object({
  body: z.object({
    payee: z.string().min(1),
    amount: z.number().multipleOf(0.01).positive(),
    category: z.string().min(1),
    date: z.coerce.date(),
  }),
});

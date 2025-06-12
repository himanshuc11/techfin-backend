import { z } from "zod";

export const transactionInsertRequestPayload = z.object({
  body: z
    .object({
      payee: z.string().min(1),
      amount: z.number().multipleOf(0.01).positive(),
      category: z.string().min(1),
      date: z.coerce.date(),
    })
    .strict(),
});

export const transactionUpdateRequestPayload = z.object({
  body: transactionInsertRequestPayload.shape.body
    .partial()
    .extend({
      transactionId: z.number(),
    })
    .strict()
    .refine(
      (data) => Object.keys(data).length > 1,
      "At least one field must be provided and id",
    ),
});

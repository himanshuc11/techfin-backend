import { z } from "zod";

export const startUploadRequestPayload = z.object({
  body: z
    .object({
      filename: z.string(),
      numberOfChunks: z.number(),
    })
    .strict(),
});

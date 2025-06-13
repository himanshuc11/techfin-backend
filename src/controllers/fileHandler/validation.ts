import { z } from "zod";

export const startUploadRequestPayload = z.object({
  body: z
    .object({
      filename: z.string(),
      numberOfChunks: z.number(),
    })
    .strict(),
});

export const uploadFileChunkRequestPayload = z.object({
  headers: z.object({
    "x-file-id": z.string().uuid(),
    "x-start-byte": z.coerce.number(),
    "x-file-name": z.string(),
  }),
});

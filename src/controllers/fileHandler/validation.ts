import { z } from "zod";

export const startUploadRequestPayload = z.object({
  body: z
    .object({
      filename: z.string(),
      numberOfChunks: z.number(),
    })
    .strict(),
});

export const xFileIdPayload = z.object({
  "x-file-id": z.string().uuid(),
});

export const uploadFileChunkRequestPayload = z.object({
  headers: z.object({
    "x-start-byte": z.coerce.number(),
    "x-file-name": z.string(),
    ...xFileIdPayload.shape,
  }),
});

export const mergeRequestPayload = z.object({
  headers: z.object({
    ...xFileIdPayload.shape,
  }),
});

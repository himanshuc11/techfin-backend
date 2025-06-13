import { z } from "zod";
import { startUploadRequestPayload } from "./validation.js";

export type StartUploadParams = z.infer<
  typeof startUploadRequestPayload.shape.body
>;

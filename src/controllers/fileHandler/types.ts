import { z } from "zod";
import {
  mergeRequestPayload,
  startUploadRequestPayload,
  uploadFileChunkRequestPayload,
} from "./validation.js";
import { IncomingHttpHeaders } from "http";

export type StartUploadParams = z.infer<
  typeof startUploadRequestPayload.shape.body
>;

export type UploadFileChunkParams = z.infer<
  typeof uploadFileChunkRequestPayload.shape.headers
> &
  IncomingHttpHeaders;

export type UploadFileChunkFunctionParams = {
  startByte: string;
  filename: string;
  fileId: string;
};

export type XfileHeadersParams = z.infer<
  typeof mergeRequestPayload.shape.headers
> &
  IncomingHttpHeaders;

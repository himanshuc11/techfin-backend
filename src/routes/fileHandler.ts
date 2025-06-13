import { RESPONSE_ERROR_CODES } from "#constants/errorCodes.js";
import { STATUS_CODES } from "#constants/statusCodes.js";
import { UPLOAD_DIR } from "#controllers/fileHandler/constants.js";
import {
  generateErrorResponse,
  generateSuccessResponse,
} from "#utils/generateResponse.js";
import express from "express";
import path from "path";
import fs from "fs";
import validateDataSchemaMiddleware from "#middleware/validateDataSchema.js";
import {
  startUploadRequestPayload,
  uploadFileChunkRequestPayload,
} from "#controllers/fileHandler/validation.js";
import {
  StartUploadParams,
  UploadFileChunkParams,
} from "#controllers/fileHandler/types.js";
import {
  startFileUpload,
  uploadFileChunk,
} from "#controllers/fileHandler/index.js";

const fileRouter = express.Router();

fileRouter.post(
  "/start-upload",
  validateDataSchemaMiddleware(startUploadRequestPayload),
  (req, res) => {
    const body = req.body as StartUploadParams;

    const { status, payload } = startFileUpload(body);

    res.status(status).json(payload);
  },
);

fileRouter.put(
  "/upload",
  validateDataSchemaMiddleware(uploadFileChunkRequestPayload),
  (req, res) => {
    const headers = req.headers as UploadFileChunkParams;

    const startByte = headers["x-start-byte"] as unknown as string;
    const filename = headers["x-file-name"];
    const fileId = headers["x-file-id"];

    const writableStreamOrError = uploadFileChunk({
      startByte,
      filename,
      fileId,
    });

    if (writableStreamOrError instanceof fs.WriteStream) {
      req.pipe(writableStreamOrError);

      req.on("end", () => {
        const { status, payload } = generateSuccessResponse({
          status: STATUS_CODES.OK,
          data: { uploaded: true },
        });

        res.status(status).json(payload);
      });

      req.on("error", (err) => {
        console.error(":ERROR", err);

        const { status, payload } = generateErrorResponse({
          status: STATUS_CODES.SERVER_ERROR,
          error: RESPONSE_ERROR_CODES.SOMETHING_WENT_WRONG_SERVER_ERROR,
        });
        res.status(status).send(payload);
      });
    } else {
      res
        .status(writableStreamOrError.status)
        .send(writableStreamOrError.payload);
    }
  },
);

export default fileRouter;

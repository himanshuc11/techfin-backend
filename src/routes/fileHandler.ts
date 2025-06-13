import { RESPONSE_ERROR_CODES } from "#constants/errorCodes.js";
import { STATUS_CODES } from "#constants/statusCodes.js";
import { UPLOAD_DIR } from "#controllers/fileHandler/constants.js";
import { generateErrorResponse } from "#utils/generateResponse.js";
import express from "express";
import path from "path";
import fs from "fs";
import validateDataSchemaMiddleware from "#middleware/validateDataSchema.js";
import { startUploadRequestPayload } from "#controllers/fileHandler/validation.js";
import { StartUploadParams } from "#controllers/fileHandler/types.js";
import { startFileUpload } from "#controllers/fileHandler/index.js";

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

fileRouter.put("/upload", (req, res) => {
  const fileId = req.headers["x-file-id"] as string;
  const startByte = parseInt(
    (req.headers["x-start-byte"] as string) || "0",
    10,
  );
  const fileName = req.headers["x-file-name"] as string;

  if (!!startByte) {
    const { status, payload } = generateErrorResponse({
      status: STATUS_CODES.BAD_REQUEST,
      error: RESPONSE_ERROR_CODES.REQUEST_VALIDATION_FAILED,
    });

    res.status(status).json(payload);
    return;
  }

  const folderPath = path.join(UPLOAD_DIR, fileId);
  fs.mkdirSync(folderPath, { recursive: true });

  const filePath = path.join(folderPath, fileName);

  const writeStream = fs.createWriteStream(filePath, {
    flags: "a",
    start: startByte,
  });

  req.pipe(writeStream);

  req.on("end", () => {
    res.status(200).json({ uploaded: true });
  });

  req.on("error", () => {
    res.status(500).send("Upload failed");
  });
});

export default fileRouter;

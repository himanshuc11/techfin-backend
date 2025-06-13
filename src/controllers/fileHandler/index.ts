import { STATUS_CODES } from "#constants/statusCodes.js";
import {
  generateErrorResponse,
  generateSuccessResponse,
} from "#utils/generateResponse.js";
import path from "path";
import { UPLOAD_DIR } from "./constants.js";
import fs from "fs";

import { StartUploadParams, UploadFileChunkFunctionParams } from "./types.js";
import { v4 as uuidv4 } from "uuid";
import { RESPONSE_ERROR_CODES } from "#constants/errorCodes.js";

export function startFileUpload(params: StartUploadParams) {
  try {
    const fileId = uuidv4();
    const folderPath = path.join(UPLOAD_DIR, fileId);
    fs.mkdirSync(folderPath, { recursive: true });

    // Create metaData file
    const metaData: StartUploadParams = {
      ...params,
    };

    fs.writeFileSync(
      path.join(folderPath, "meta.json"),
      JSON.stringify(metaData),
    );

    return generateSuccessResponse({
      status: STATUS_CODES.OK,
      data: { fileId, ...metaData },
    });
  } catch (err) {
    console.error("::Error", err);
    return generateErrorResponse({
      status: STATUS_CODES.SERVER_ERROR,
      error: RESPONSE_ERROR_CODES.SOMETHING_WENT_WRONG_SERVER_ERROR,
    });
  }
}

export function uploadFileChunk(params: UploadFileChunkFunctionParams) {
  const { startByte: startByteAsString, fileId, filename } = params;
  const startByte = parseInt(startByteAsString || "0", 10);

  if (typeof startByte !== "number") {
    return generateErrorResponse({
      status: STATUS_CODES.BAD_REQUEST,
      error: RESPONSE_ERROR_CODES.REQUEST_VALIDATION_FAILED,
    });
  }

  const folderPath = path.join(UPLOAD_DIR, fileId);
  fs.mkdirSync(folderPath, { recursive: true });

  const filePath = path.join(folderPath, filename);

  const writeStream = fs.createWriteStream(filePath, {
    flags: "a",
    start: startByte,
  });

  return writeStream;
}

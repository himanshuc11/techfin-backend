import { STATUS_CODES } from "#constants/statusCodes.js";
import {
  generateErrorResponse,
  generateSuccessResponse,
} from "#utils/generateResponse.js";
import path from "path";
import { META_FILE, UPLOAD_DIR } from "./constants.js";
import fs from "fs";
import { promisify } from "util";

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);
const rmdir = promisify(fs.rmdir);

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
      path.join(folderPath, META_FILE),
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

export async function mergeFileChunks(fileId: string) {
  try {
    const folderPath = path.join(UPLOAD_DIR, fileId);
    const metaFileData = JSON.parse(
      fs.readFileSync(path.join(folderPath, META_FILE), "utf8"),
    );

    if (!fs.existsSync(folderPath) || !metaFileData) {
      throw new Error("Incorrect File Id");
    }

    const chunkFilesWithMetaData = await readdir(folderPath);
    const chunkFiles = chunkFilesWithMetaData.filter(
      (chunkFile) => chunkFile !== META_FILE,
    );

    const { filename } = metaFileData;
    const outputFilePath = path.join(folderPath, `${fileId}_${filename}`);

    const sortedChunks = chunkFiles.sort();
    const writeStream = fs.createWriteStream(outputFilePath);

    for (const chunk of sortedChunks) {
      const chunkPath = path.join(folderPath, chunk);
      const data = await fs.promises.readFile(chunkPath);
      writeStream.write(data);
    }

    writeStream.end();

    return generateSuccessResponse({
      status: STATUS_CODES.OK,
      data: { fileId },
    });
  } catch (err) {
    if (err instanceof Error && err.message === "Incorrect File Id") {
      return generateErrorResponse({
        status: STATUS_CODES.NOT_FOUND,
        error: RESPONSE_ERROR_CODES.REQUEST_VALIDATION_FAILED,
      });
    }

    return generateErrorResponse({
      status: STATUS_CODES.SERVER_ERROR,
      error: RESPONSE_ERROR_CODES.SOMETHING_WENT_WRONG_SERVER_ERROR,
    });
  }
}

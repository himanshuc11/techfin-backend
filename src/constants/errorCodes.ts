import type { ErrorData } from "#utils/generateResponse.js";

export const RESPONSE_ERROR_CODES: Record<string, ErrorData> = {
  REQUEST_VALIDATION_FAILED: {
    errorCode: 1,
    errorMessage: "Validation failed",
  },
  SOMETHING_WENT_WRONG_SERVER_ERROR: {
    errorCode: 2,
    errorMessage: "Something went wrong",
  },
} as const;

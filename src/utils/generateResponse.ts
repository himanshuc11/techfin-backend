type ResponseObjectSuccessType = {
  status: number;
  data: Record<string, any> | any[];
};

export type ErrorData = {
  errorCode: number;
  errorMessage: string;
};

type ResponseObjectError = {
  status: number;
  error: ErrorData;
};

export function generateSuccessResponse(
  successData: ResponseObjectSuccessType,
) {
  return {
    status: successData.status,
    payload: { data: successData.data, error: null },
  };
}

export function generateErrorResponse(errorData: ResponseObjectError) {
  return {
    status: errorData.status,
    payload: { error: errorData.error, data: null },
  };
}

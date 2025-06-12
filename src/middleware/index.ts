import { RESPONSE_ERROR_CODES } from "#constants/errorCodes.js";
import { STATUS_CODES } from "#constants/statusCodes.js";
import { generateErrorResponse } from "#utils/generateResponse.js";
import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import { ZodError } from "zod";

const validateDataSchemaMiddleware =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => {
          const fieldPath = err.path.join(".");
          return `${fieldPath}: ${err.message}`;
        });

        console.error("ERROR", formattedErrors);

        const { status, payload } = generateErrorResponse({
          status: STATUS_CODES.BAD_REQUEST,
          error: RESPONSE_ERROR_CODES.REQUEST_VALIDATION_FAILED,
        });

        res.status(status).json(payload);
        return;
      }

      console.error("ERROR", error);
      // Catch-all for other unknown errors
      const { status, payload } = generateErrorResponse({
        status: STATUS_CODES.SERVER_ERROR,
        error: RESPONSE_ERROR_CODES.SOMETHING_WENT_WRONG_SERVER_ERROR,
      });
      res.status(status).json(payload);
      return;
    }
  };

export default validateDataSchemaMiddleware;

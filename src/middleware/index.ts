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

        res.status(400).json({
          error: formattedErrors[0],
        });
        return;
      }

      // Catch-all for other unknown errors
      res.status(500).json({ error: "Internal server error" });
      return;
    }
  };

export default validateDataSchemaMiddleware;

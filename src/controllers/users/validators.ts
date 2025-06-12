import { z } from "zod";
import { AUTHETICATION_TYPE } from "./constants.js";

export const authTypeSchema = z.enum(
  Object.values(AUTHETICATION_TYPE) as [string, ...string[]],
);

export const userLoginRequestPayload = z.object({
  body: z.object({
    username: z.string(),
    credential: z.string(),
    authenticationType: authTypeSchema,
  }),
});

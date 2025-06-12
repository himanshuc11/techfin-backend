import { z } from "zod";
import { AUTHETICATION_TYPE } from "./constants.js";
import { createZodEnumFromConst } from "#utils/index.js";

const authTypeSchema = createZodEnumFromConst(AUTHETICATION_TYPE);

export const userLoginRequestPayload = z.object({
  body: z.object({
    username: z.string(),
    credential: z.string(),
    authenticationType: authTypeSchema,
  }),
});

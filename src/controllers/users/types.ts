import { z } from "zod";
import { userLoginRequestPayload } from "./validators.js";

export type LoginUserRequestPayload = z.infer<
  typeof userLoginRequestPayload.shape.body
>;

export type UserRequestCookiePayload = {
  username: string;
  role: number;
};

export type JWTPayload = UserRequestCookiePayload & {
  iat: number;
  exp: number;
};

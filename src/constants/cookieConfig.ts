import { CookieOptions } from "express";

export const COOKIE_CONFIG: CookieOptions = {
  httpOnly: true,
  secure: false, // Need to run in HTTP environment
  sameSite: "lax", // Allows cross-site requests
  maxAge: 24 * 60 * 60 * 1000, // 1 day
  path: "/", // Root path to ensure cookie is sent for all requests
} as const;

export const ACCESS_TOKEN_COOKIE_KEY = "accessToken";

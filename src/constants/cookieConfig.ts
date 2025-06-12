export const COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // HTTPS only in prod
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
  path: process.env.NODE_ENV === "production" ? "" : "/", // In production should be set to deployed site's url
} as const;

export const ACCESS_TOKEN_COOKIE_KEY = "accessToken";

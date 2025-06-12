import { z } from "zod";

export function createZodEnumFromConst<T extends Record<string, string>>(
  obj: T,
) {
  return z.enum(Object.values(obj) as [T[keyof T], ...T[keyof T][]]);
}

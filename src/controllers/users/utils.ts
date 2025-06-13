import { db } from "#db/index.js";
import { Users } from "#db/schema/index.js";
import { eq } from "drizzle-orm";
import { AUTHETICATION_TYPE } from "./constants.js";
import { LoginUserRequestPayload } from "./types.js";
import bcrypt from "bcrypt";

export async function diduserHaveValidCredentials(
  props: LoginUserRequestPayload,
) {
  const { username, authenticationType, credential } = props;

  const user = await db
    .select()
    .from(Users)
    .where(eq(Users.username, username));

  let isValid = false;

  switch (authenticationType) {
    case AUTHETICATION_TYPE.PASSWORD:
      isValid = await bcrypt.compare(credential, user[0].password);
      break;
    default:
      break;
  }

  return isValid;
}

export async function getUserFromUsername(username: string) {
  const user = await db
    .select()
    .from(Users)
    .where(eq(Users.username, username));

  if (user.length !== 1) {
    return null;
  }

  const userDetails = user[0];
  return userDetails;
}

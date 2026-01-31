import { prisma } from "../db/prisma";
import { v4 as uuidv4 } from "uuid";

export async function createAuthorizationCode(
  userId: string,
  clientId: string,
  codeChallenge: string
) {
  const code = uuidv4();

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

  await prisma.authorizationCode.create({
    data: {
      code,
      userId,
      clientId,
      codeChallenge,
      expiresAt
    }
  });

  return code;
}

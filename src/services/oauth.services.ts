import { createHash, randomUUID } from "node:crypto";
import { prisma } from "../db/prisma";
import { v4 as uuidv4 } from "uuid";
import { signAccessToken } from "../utils/jwt";
import { signIdToken } from "./jwks.service";


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




export async function exchangeCodeforToken(
    code: string,
    codeVerifier: string,
    clientId: string
){

    //findcode

    const authCode =  await prisma.authorizationCode.findUnique({
        where: {code}
    });

    if(!authCode){
        throw new Error("Invalid code");
    }

    if(authCode.expiresAt<new Date()){
        throw new Error("code expired");
     }

    if(authCode.clientId!==clientId){
        throw new Error("Client mismatch");
    }


    const hashed = createHash("sha256").update(codeVerifier).digest("base64url");

    if(hashed!== authCode.codeChallenge){
        throw new Error("Invalid PKCE verifier");
    }

    await prisma.authorizationCode.delete({
        where: {code}
    })

    const user = await prisma.user.findUnique({
        where: { id: authCode.userId}
    });

    if(!user){
        throw new Error("User not found");
    }

    const accessToken= await signAccessToken(authCode.userId);

    const idToken = await signIdToken(user);


    const refreshToken = randomUUID();

    const refreshHash = createHash("sha256").update(refreshToken).digest("hex");

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate()+30);


    await prisma.refreshToken.create({
        data: {
            userId: authCode.userId,
            clientId,
            tokenHash: refreshHash,
            expiresAt,
        }
    });

    return {
        accessToken,
        idToken,
        refreshToken
    }

}

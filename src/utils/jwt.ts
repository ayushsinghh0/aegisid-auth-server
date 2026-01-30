import { readFileSync } from "node:fs";
import { SignJWT,jwtVerify } from "jose";
import path from "path";

import { createPrivateKey, createPublicKey } from "node:crypto";

const privateKey = createPrivateKey(
  readFileSync(path.join(process.cwd(), "keys/private.pem"))
);

const publicKey = createPublicKey(
  readFileSync(path.join(process.cwd(), "keys/public.pem"))
);

const ISSUER = "aegisid";
const AUDIENCE = "aegisid-api";

export async function signAccessToken(userId:string) {

    return new SignJWT({})
    .setProtectedHeader({alg:"RS256"})
    .setSubject(userId)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setExpirationTime("15m")
    .setIssuedAt()
    .sign(privateKey);
}

export async function verifyAccessToken(token: string){
    return jwtVerify(token,publicKey, {
        issuer:ISSUER,
        audience:AUDIENCE
    })
}
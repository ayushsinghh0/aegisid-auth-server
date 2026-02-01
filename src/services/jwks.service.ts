import { createPublicKey } from "crypto";
import { readFileSync } from "fs";
import { importPKCS8, SignJWT } from "jose";
import path from "path";



const ALG = "RS256";

const basePath = process.cwd();


const publicKeyPath = path.join(
    basePath,
    "keys/public.pem"
);

const publicKeyPem = readFileSync(publicKeyPath,"utf-8");

const privateKeyPath = path.join(basePath,"keys/public.pem")

const privateKeyPem = readFileSync(privateKeyPath,"utf-8");

export function getJWKS() {
    const key = createPublicKey(publicKeyPem);

    const jwk = key.export({ format:"jwk"});

    return {
        keys : [
           { ...jwk,
            use:"sig",
            alg:"RS256",
            kid: "aegisid-key-1"
            }
        ]
    };
}

export async function signIdToken(user:{
    id: string;
    email: string;
    name?: string|null;
}) {
    const privateKeyObj = await importPKCS8(privateKeyPem,ALG);

    return new SignJWT({
        email:user.email,
        name:user.name
    }).setProtectedHeader({alg:ALG})
    .setAudience("aegisid-client")
    .setSubject(user.id)
    .setExpirationTime("15m")
    .setIssuer("aegisid")
    .setIssuedAt()
    .sign(privateKeyObj);
}
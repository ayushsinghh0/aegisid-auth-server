import { createPublicKey } from "crypto";
import { readFileSync } from "fs";
import path from "path";



const publicKeyPath = path.join(
    process.cwd(),
    "keys/publc.pem"
);

const publicKeyPem = readFileSync(publicKeyPath,"utf-8");

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
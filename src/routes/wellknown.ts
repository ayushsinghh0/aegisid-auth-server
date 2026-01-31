import { Router } from "express";
import { env } from "../config/env";
import { userInfo } from "node:os";
import { getJWKS } from "../services/jwks.service";



const router= Router();


router.get("/openid-configuration",(req,res)=>{
    res.json({
        issuer:`hhtp://localhost:${env.port}`,

        authorization_endpoint:
        `http://localhost:${env.port}/oauth/authorize`,

        token_endpoint:
        `http://localhost:${env.port}/oauth/token`,

        userInfo_endpoint:
         `http://localhost:${env.port}/userinfo`,

         jkws_uri:
         `http://localhost:${env.port}/.well-known/jwks.json`,

         response_types_supported: ["code"],

         grant_types_supported: ["authorization_code"],

         scopes_supported: ["openid","profile","email"],
         
         subject_types_supported: ["public"],

         id_token_signing_alg_values_spported: ["rs-256"]
    });
});


router.get("/jwks.json",(req,res)=>{
    res.json(getJWKS());
})

export default router;
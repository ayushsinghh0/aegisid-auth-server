import { Router } from "express";
import { prisma } from "../db/prisma";
import { randomBytes } from "node:crypto";
import { createAuthorizationCode, exchangeCodeforToken } from "../services/oauth.services";
import { authenticate } from "../middleware/auth";



const router= Router();

router.get("/authorize",authenticate,async (req,res)=>{
    const {
        response_type,
        client_id,
        redirect_uri,
        code_challenge
    }=req.query as Record<string,string>;

    if(response_type!=="code") {
        return res.status(400).json({
            error:"Unsupported response_type"
        })
    }

    if(!code_challenge|| !redirect_uri||!client_id){
        return res.status(400).json({error:"missing parameter"})
    }

    const client = await prisma.oAuthClient.findUnique({
        where: {clientId:client_id!}
    });

    if(!client){
        return res.status(400).json({ error: "Invalid client"})
    }

    if(!client.redirectUris.includes(redirect_uri!)) {
        return res.status(400).json({
            error:"Imvalid redirect_uri"
        });
    }

    // assume for r8 now that the user is authenticated
    //  this happens AFTER login

    const userId = (req as any).userId ;

    if(!userId){
        return res.status(401).json({error:"User not authenticated"});
        
    }

    const code =await createAuthorizationCode(
        userId,client_id,code_challenge
    );

    const redirectUrl = new URL(redirect_uri);

   redirectUrl.searchParams.set("code",code);


    return res.redirect(redirectUrl.toString());


});

router.post("/token",authenticate,async (req,res)=>{
    const {
        code,code_verifier,client_id,grant_type
    }= req.body;

    if(grant_type!=="authorization_code"){
        return res.status(400).json({ error: "Invalid grant_type"});
    }

    if(!code || !code_verifier || !client_id) {
        return res.status(400).json({
            error:"Missing parameters"
        });
    }

    try {
        const token =  await exchangeCodeforToken(
            code,code_verifier,client_id
        );

        res.json({
            access_token:token.accessToken,
            refreshe_token: token.refreshToken,
            token_type:"Bearer",
            expires_in: 900
        });


    }
    catch(err: any){
        res.status(400).json({
            error:err.message
        });
    }
    
})

export default router;
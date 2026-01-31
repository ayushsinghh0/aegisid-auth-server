import { Router } from "express";
import { prisma } from "../db/prisma";
import { randomBytes } from "node:crypto";



const router= Router();

router.get("/authorize",async (req,res)=>{
    const {
        response_type,
        client_id,
        redirect_uri,
        code_challenge,
        code_challenge_method
    }=req.query as Record<string,string>;

    if(response_type!=="code") {
        return res.status(400).json({
            error:"Unsupported response_type"
        })
    }

    if(code_challenge !== "S256"){
        return res.status(400).json({error:"invalid code"})
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

    const userId = req.query.userId as string;

    if(!userId){
        return res.status(401).json({error:"User not authenticated"});
        
    }

    const code = randomBytes(32).toString("hex");

    await prisma.authorizationCode.create({
        data: {
            code,
            userId,
            clientId:client.clientId,
            codeChallenge: code_challenge,
            expiresAt: new Date(Date.now()+5*60*1000) // 5min
        }
    });

    const redirectUrl = new URL(redirect_uri!);
    redirectUrl.searchParams.set("code",code);

    return res.redirect(redirectUrl.toString());


});


export default router;
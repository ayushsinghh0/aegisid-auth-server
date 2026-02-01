import {Router} from "express";
import { authenticate } from "../middleware/auth";
import { prisma } from "../db/prisma";
import { use } from "react";



const router= Router();


router.get("/",authenticate,async (req,res)=>{

    const userId=(req as any).userId;

    const user=await prisma.user.findUnique({
        where:{id:userId},
        select : {
            id:true,
            email:true,
            name:true,
            emailVerified:true
        }
    });

    if(!user){
        return res.status(404).json({error:"User not found"});
    }

    res.json({
        sub:user.id,
        email:user.email,
        name:user.name,
        email_verified:user.emailVerified
    });

});

export default router;
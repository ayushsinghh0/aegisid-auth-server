import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { prisma } from "../db/prisma";
import { runInContext } from "node:vm";


const router = Router();

router.get("/",authenticate,async (req,res)=>{
    const userId = (req as any).userId;

    const user = await prisma.user.findUnique({
        where: {id:userId},

        select:{
            id:true,
            email: true,
            name:true
        }
    });

    res.json(user);
});

export default router;
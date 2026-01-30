import { NextFunction, Request, Response } from "express";
import { error } from "node:console";
import { verifyAccessToken } from "../utils/jwt";


export async function authenticate(req:Request,res: Response,next:NextFunction) {
    try{
        const auth = req.headers.authorization;

        if(!auth || !auth.startsWith("Bearer")) {
            return res.status(401).json({error:"Missing token"})
        }

        const token= auth.substring(7);

        const { payload } = await verifyAccessToken(token);

        (req as any).userId = payload.sub;

        next();
    } catch {
        res.status(401).json({
            error: "Invalid token"
        });
    }
}
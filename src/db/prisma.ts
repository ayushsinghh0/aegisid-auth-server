import bcrypt from "bcrypt";
import { PrismaClient } from "../generated/prisma/client";
import { withAccelerate } from '@prisma/extension-accelerate'

export const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL!,
}).$extends(withAccelerate())

import bcrypt from "bcrypt";
import { prisma } from "../db/prisma";
import { Credential, CredentialType } from "../generated/prisma/client";


const SaltRounds=9;

export async function registerUser(email:string,password:string,name:string) {

    
    const existingUser=await prisma.user.findUnique({
        where: { email}
    });

    if(existingUser) {
        throw new Error("usser already exists");
    }

    const passwordHash = await bcrypt.hash(password,SaltRounds);


    const user=await prisma.user.create({
        data: {
           email,
            name,
            credentials:{
                create: {
                    type: CredentialType.PASSWORD,
                    passwordHash
                }
            }
        }
    })

    return user;
    
}



export async function loginUser(email:string,password:string) {

    const user = await prisma.user.findUnique({
        where : {email},
        include: {credentials: true}
    });
    
    if(!user){
        throw new Error("Invalid email or password");
    }

    const passwordCredential = user.credentials.find(
        c=> c.type === CredentialType.PASSWORD
    );

    if(!passwordCredential || !passwordCredential.passwordHash){
        throw new Error("password login is not available")
    }

    const isvalid=bcrypt.compare(
        password,
        passwordCredential.passwordHash
    )

    if(!isvalid){
        throw new Error("invalid email or password")
    }

    return user;


}


import {prisma} from "../src/db/prisma"


async function main() {
    await prisma.oAuthClient.create({
        data : {
            clientId: "test-client",
            redirectUris:["http://localhost:3000/callback"],
            grantTypes:["authorization_code"]
        },
    });
     console.log("oAuth client created");   
}

main().catch(console.error).finally(async () =>{
    await prisma.$disconnect();
});
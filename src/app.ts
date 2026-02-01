import express from "express";
import healthRouter from "./routes/health";
import authRouter from "./routes/auth";
import profileRouter from "./routes/profile";
import oauthRouter from "./routes/oauth";
import wellKnownRouter from "./routes/wellknown";
import  userInfoRouter from "./routes/userinfo";
export function createApp(){
    const app=express();

    app.use(express.json());

    app.use("/health",healthRouter);
    app.use("/auth",authRouter);
    app.use("/profile",profileRouter);
    app.use("/oauth",oauthRouter);
    app.use("/.well-known",wellKnownRouter);
    app.use("/userinfo",userInfoRouter);

    return app;
}
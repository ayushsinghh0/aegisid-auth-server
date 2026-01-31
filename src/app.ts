import express from "express";
import healthRouter from "./routes/health";
import authRouter from "./routes/auth";
import profileRouter from "./routes/profile";
import oauthRouter from "./routes/oauth";

export function createApp(){
    const app=express();

    app.use(express.json());

    app.use("/health",healthRouter);
    app.use("/auth",authRouter);
    app.use("/profile",profileRouter);
    app.use("/oauth",oauthRouter);

    return app;
}
import "./telemetry/tracing.js"; // MUST BE FIRST

import express from "express";
import { env } from "./config/env.js";
import healthRouter from "./routes/health.js";
import { testDbConnection } from "./db/index.js";

const app = express();

app.use(express.json());
app.use(healthRouter);

async function start() {
  await testDbConnection();
  console.log("Database connected");

  app.listen(env.port, () => {
    console.log(`Auth server running on port ${env.port}`);
  });
}

start().catch((err) => {
  console.error("Startup failed", err);
  process.exit(1);
});

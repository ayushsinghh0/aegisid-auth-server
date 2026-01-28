import { Pool } from "pg";
import { env } from "../config/env.js";
import { trace } from "@opentelemetry/api";

const tracer = trace.getTracer("db");

export const pool = new Pool({
  connectionString: env.databaseUrl
});

export async function testDbConnection() {
  return tracer.startActiveSpan("db.testConnection", async (span) => {
    try {
      const res = await pool.query("SELECT 1");
      span.setStatus({ code: 1 });
      return res;
    } catch (err) {
      span.recordException(err as Error);
      throw err;
    } finally {
      span.end();
    }
  });
}

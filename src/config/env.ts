import "dotenv/config";

export const env = {
  port: Number(process.env.PORT || 4000),
  databaseUrl: process.env.DATABASE_URL!,
  serviceName: process.env.SERVICE_NAME || "aegisid-auth"
};
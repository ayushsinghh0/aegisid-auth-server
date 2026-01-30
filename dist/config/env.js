"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
exports.env = {
    port: Number(process.env.PORT || 4000),
    databaseUrl: process.env.DATABASE_URL,
    serviceName: process.env.SERVICE_NAME || "aegisid-auth"
};
//# sourceMappingURL=env.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const health_1 = __importDefault(require("./routes/health"));
const auth_1 = __importDefault(require("./routes/auth"));
const profile_1 = __importDefault(require("./routes/profile"));
const oauth_1 = __importDefault(require("./routes/oauth"));
const wellknown_1 = __importDefault(require("./routes/wellknown"));
const userinfo_1 = __importDefault(require("./routes/userinfo"));
const rateLimit_1 = require("./middleware/rateLimit");
const error_1 = require("./middleware/error");
function createApp() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(rateLimit_1.authLimiter);
    app.use(error_1.errorHandler);
    app.use("/auth/login", rateLimit_1.strictAuthLimiter);
    app.use("/oauth/token", rateLimit_1.strictAuthLimiter);
    app.use("/health", health_1.default);
    app.use("/auth", auth_1.default);
    app.use("/profile", profile_1.default);
    app.use("/oauth", oauth_1.default);
    app.use("/.well-known", wellknown_1.default);
    app.use("/userinfo", userinfo_1.default);
    return app;
}
//# sourceMappingURL=app.js.map
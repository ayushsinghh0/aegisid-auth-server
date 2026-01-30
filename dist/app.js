"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const health_1 = __importDefault(require("./routes/health"));
const auth_1 = __importDefault(require("./routes/auth"));
function createApp() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use("/health", health_1.default);
    app.use("/auth", auth_1.default);
    return app;
}
//# sourceMappingURL=app.js.map
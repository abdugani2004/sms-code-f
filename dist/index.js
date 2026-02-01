"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const redis_1 = require("./config/redis");
const authController_1 = require("./controllers/authController");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Marshrutlar
app.post('/api/auth/send-sms', authController_1.sendSMS);
app.post('/api/auth/verify-sms', authController_1.verifySMS);
const startServer = async () => {
    await (0, redis_1.connectRedis)();
    app.listen(3000, () => {
        console.log('🚀 Server running on http://localhost:3000');
    });
};
startServer();

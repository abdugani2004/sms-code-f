"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMSService = void 0;
const redis_1 = __importDefault(require("../config/redis"));
class SMSService {
    static async generateAndSaveOTP(phone) {
        const cooldownKey = `limit:${phone}`;
        const otpKey = `otp:${phone}`;
        // 1. Rate limiting tekshirish
        const isLimited = await redis_1.default.get(cooldownKey);
        if (isLimited)
            throw new Error("Iltimos, 60 soniya kuting!");
        // 2. Tasodifiy 6 xonali kod yaratish
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        // 3. Kodni keshga saqlash (5 daqiqaga)
        await redis_1.default.set(otpKey, code, { EX: this.OTP_TTL });
        // 4. Qayta yuborishni bloklash (1 daqiqaga)
        await redis_1.default.set(cooldownKey, "blocked", { EX: this.RATE_LIMIT_TTL });
        return code; // Real loyihada bu kod SMS provayderiga ketadi
    }
    static async verifyOTP(phone, inputCode) {
        const otpKey = `otp:${phone}`;
        const savedCode = await redis_1.default.get(otpKey);
        if (!savedCode)
            throw new Error("Kod muddati o'tgan yoki yuborilmagan");
        if (savedCode !== inputCode)
            throw new Error("Kod noto'g'ri!");
        // Tasdiqlangach kodni o'chirish (bir marta ishlatish uchun)
        await redis_1.default.del(otpKey);
        return true;
    }
}
exports.SMSService = SMSService;
SMSService.OTP_TTL = 300; // 5 daqiqa amal qilish muddati
SMSService.RATE_LIMIT_TTL = 60; // 1 daqiqa qayta yuborish taqiqi

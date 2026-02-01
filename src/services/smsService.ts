import redisClient from '../config/redis';

export class SMSService {
    private static OTP_TTL = 300; 
    private static RATE_LIMIT_TTL = 60; 

    static async generateAndSaveOTP(phone: string) {
        const cooldownKey = `limit:${phone}`;
        const otpKey = `otp:${phone}`;

        
        const isLimited = await redisClient.get(cooldownKey);
        if (isLimited) throw new Error("Iltimos, 60 soniya kuting!");

        
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        
        await redisClient.set(otpKey, code, { EX: this.OTP_TTL });

        
        await redisClient.set(cooldownKey, "blocked", { EX: this.RATE_LIMIT_TTL });

        return code; 
    }

    static async verifyOTP(phone: string, inputCode: string) {
        const otpKey = `otp:${phone}`;
        const savedCode = await redisClient.get(otpKey);

        if (!savedCode) throw new Error("Kod muddati o'tgan yoki yuborilmagan");
        if (savedCode !== inputCode) throw new Error("Kod noto'g'ri!");

        
        await redisClient.del(otpKey);
        return true;
    }
}
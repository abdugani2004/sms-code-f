"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySMS = exports.sendSMS = void 0;
const smsService_1 = require("../services/smsService");
const sendSMS = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone)
            return res.status(400).json({ message: "Telefon raqami kerak" });
        const code = await smsService_1.SMSService.generateAndSaveOTP(phone);
        // Bu yerda SMS yuborish mantiqi (Twilio/Eskiz) bo'ladi
        console.log(`[SMS] ${phone} raqamiga kod yuborildi: ${code}`);
        res.status(200).json({ message: "Kod yuborildi" });
    }
    catch (error) {
        res.status(429).json({ message: error.message });
    }
};
exports.sendSMS = sendSMS;
const verifySMS = async (req, res) => {
    try {
        const { phone, code } = req.body;
        await smsService_1.SMSService.verifyOTP(phone, code);
        res.status(200).json({ message: "Muvaffaqiyatli tasdiqlandi!" });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.verifySMS = verifySMS;

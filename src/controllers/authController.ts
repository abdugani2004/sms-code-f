import { Request, Response } from 'express';
import { SMSService } from '../services/smsService';

export const sendSMS = async (req: Request, res: Response) => {
    try {
        const { phone } = req.body;
        if (!phone) return res.status(400).json({ message: "Telefon raqami kerak" });

        const code = await SMSService.generateAndSaveOTP(phone);
        
        
        console.log(`[SMS] ${phone} raqamiga kod yuborildi: ${code}`);

        res.status(200).json({ message: "Kod yuborildi" });
    } catch (error: any) {
        res.status(429).json({ message: error.message });
    }
};

export const verifySMS = async (req: Request, res: Response) => {
    try {
        const { phone, code } = req.body;
        await SMSService.verifyOTP(phone, code);
        res.status(200).json({ message: "Muvaffaqiyatli tasdiqlandi" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
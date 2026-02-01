import express from 'express';
import { connectRedis } from './config/redis';
import { sendSMS, verifySMS } from './controllers/authController';

const app = express();
app.use(express.json());


app.post('/api/auth/send-sms', sendSMS);
app.post('/api/auth/verify-sms', verifySMS);

const startServer = async () => {
    await connectRedis();
    app.listen(3000, () => {
        console.log(' Server running on http://localhost:3000');
    });
};

startServer();
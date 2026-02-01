import { createClient } from 'redis';

const redisClient = createClient({
    url: 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('Redis Error:', err));

export const connectRedis = async () => {
    if (!redisClient.isOpen) await redisClient.connect();
    console.log(' Redis-ga ulanish hosil qilindi');
};

export default redisClient;
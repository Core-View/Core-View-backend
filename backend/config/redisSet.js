const redis = require('redis');
const dotenv = require('dotenv');
dotenv.config();

const redisClient = redis.createClient({
	host: `${process.env.REDIS_HOST}`,
    port: process.env.REDIS_PORT,
	legacyMode: true
});

//redis 연결
redisClient.on('connect', () => {
	console.info('Redis connected!');
});
redisClient.on('error', (err) => {
	console.error('Redis Client Error', err);
});
redisClient.connect().then(); // redis v4 연결 (비동기)
const redisCli = redisClient.v4;

module.exports = redisCli;
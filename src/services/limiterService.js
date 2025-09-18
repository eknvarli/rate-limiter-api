import redis from '../config/redis.js'

export async function checkRateLimit(apiKey, identifier, limit, window) {
    const key = `rate:${apiKey}:${identifier}`
    const current = await redis.incr(key)

    if (current === 1) {
        await redis.expire(key, window)
    }


    const ttl = await redis.ttl(key)

    if (current > limit) {
        return {
            allowed: false,
            reset_in: ttl,
            remaining: 0
        }
    }

    return {
        allowed: true,
        reset_in: ttl,
        remaining: limit - current
    }
}
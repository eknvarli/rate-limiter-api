import redis from '../config/redis'

export async function checkRateLimit(apiKey: any, identifier: any, limit: any, window: any) {
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
import { checkRateLimit } from "../services/limiterService.js";

export async function handleRateLimit(req, res) {
    const apiKey = req.headers.authorization?.split(" ")[1]
    if (!apiKey) {
        return res.status(401).json({'error':'API key required.'})
    }

    const { identifier, limit = 100, window = 60 } = req.body
    const result = await checkRateLimit(apiKey, identifier, limit, window)

    if (!result.allowed) {
        return res.status(429).json({
            allowed: false,
            message: 'Rate limit exceeded',
            reset_in: result.reset_in
        })
    }

    return res.json(result)
}
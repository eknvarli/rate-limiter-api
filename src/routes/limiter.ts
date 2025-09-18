import express from 'express'
import { handleRateLimit } from '../controllers/limiterController'

const router = express.Router()

router.post('/check', handleRateLimit)

export default router
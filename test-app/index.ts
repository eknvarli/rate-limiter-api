import express from 'express'
import axios from 'axios'


const app = express()
const PORT = 4000

const RATE_LIMITER_URL = 'http://localhost:3000/api/limiter/check'
const API_KEY = 'key1'
const LIMIT = 5
const WINDOW = 60

app.get('/data', async (req, res) => {
    try {
        const identifier = req.ip

        const response = await axios.post(RATE_LIMITER_URL, {
            identifier,
            limit: LIMIT,
            window: WINDOW
        }, {
            headers: {
                'Authorization': 'Bearer TEST_KEY',
                'Content-Type': 'application/json'
            }
        })

        const result = response.data

        if (!result.allowed) {
            return res.status(429).json({
                message: "Çok fazla istek attınız. Lütfen biraz bekleyin.",
                reset_in: result.reset_in
            })
        }

        res.json({
            message: "Başarılı! Rate limiter izin verdi.",
            remaining: result.remaining,
            reset_in: result.reset_in
        })
    } catch (err: any) {
        console.error(err.message)
        res.status(500).json({'error':'Rate limiter API ile iletişim kurulamadı'})
    }
})


app.listen(PORT, () => {
    console.log(`Uygulama ${PORT} portunda çalışıyor`)
})
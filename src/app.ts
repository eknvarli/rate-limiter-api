import express from "express";
import limitRoutes from './routes/limiter'

const app = express()

app.use(express.json())
app.use('/api/limiter', limitRoutes)


app.listen(3000, () => {
    console.log('Rate Limiter API running on port 3000')
})
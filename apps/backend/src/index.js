import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'
import contactRouter from './routes/contact.js'

const app = express()
const PORT = process.env.PORT || 4000
const CLIENT_ORIGINS = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)
const isProduction = process.env.NODE_ENV === 'production'

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || CLIENT_ORIGINS.includes(origin)) return callback(null, true)
      if (!isProduction && /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
        return callback(null, true)
      }
      callback(new Error('Origen no permitido por CORS'))
    },
  })
)
app.use(express.json())

const mailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes. Intenta de nuevo más tarde.' },
})

app.use('/api', mailLimiter)
app.use('/api', contactRouter)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

const server = app.listen(PORT, () => {
  console.log(`Backend escuchando en http://localhost:${PORT}`)
})

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(
      `\nEl puerto ${PORT} ya está en uso por otro proceso.\n` +
        'Cierra la instancia existente o cambia PORT en .env.\n'
    )
    process.exit(1)
  }
  throw error
})

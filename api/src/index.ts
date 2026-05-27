import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'node:path'

import authRouter from './routes/auth'
import wordsRouter from './routes/words'
import quizRouter from './routes/quiz'
import storyRouter from './routes/story'
import settingsRouter from './routes/settings'
import reportRouter from './routes/report'

dotenv.config()

const app = express()

const PORT = process.env.PORT ?? 5001
// CORS yapılandırması
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/words', wordsRouter)
app.use('/api/quiz', quizRouter)
app.use('/api/story', storyRouter)
app.use('/uploads', express.static(path.join(__dirname, '../src/uploads')))
app.use('/api/settings', settingsRouter)
app.use('/api/report', reportRouter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Backend çalışıyor: http://localhost:${PORT}`)
})
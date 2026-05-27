import { Router, Request, Response } from 'express'
import pool from '../db'
import { verifyToken } from '../middleware/verifyToken'
import { upload } from '../middleware/upload'

const router = Router()

router.get('/', verifyToken, async (req: Request, res: Response) => {
  const { uid } = (req as any).user

  try {
    const user = await pool.query('SELECT id FROM users WHERE firebase_uid = $1', [uid])
    if (user.rows.length === 0) {
      res.status(404).json({ error: 'Kullanıcı bulunamadı' })
      return
    }
    // Kullanıcının kelimelerini ve örnek cümlelerini çek
    const words = await pool.query(
      `SELECT w.*, array_agg(s.sentence) as samples
       FROM words w
       LEFT JOIN samples s ON s.word_id = w.id
       WHERE w.user_id = $1
       GROUP BY w.id
       ORDER BY w.created_at DESC`,
      [user.rows[0].id]
    )

    res.json({ words: words.rows })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

router.post(
  '/',
  verifyToken,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
  ]),
  async (req: Request, res: Response) => {
    const { uid } = (req as any).user
    const { eng_word, tur_word, samples } = req.body
    const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    // Dosya URL'lerini oluştur
    const imageUrl = files?.image?.[0]
      ? `http://localhost:5001/uploads/${files.image[0].filename}`
      : null

    const audioUrl = files?.audio?.[0]
      ? `http://localhost:5001/uploads/${files.audio[0].filename}`
      : null

    try {
      const user = await pool.query('SELECT id FROM users WHERE firebase_uid = $1', [uid])
      if (user.rows.length === 0) {
        res.status(404).json({ error: 'Kullanıcı bulunamadı' })
        return
      }

      const userId = user.rows[0].id
      // Kelimeyi veritabanına ekle ve eklenen kelimenin ID'sini al
      const word = await pool.query(
        'INSERT INTO words (user_id, eng_word, tur_word, image_url, audio_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [userId, eng_word, tur_word, imageUrl, audioUrl]
      )

      const wordId = word.rows[0].id

      if (samples) {
        const sampleList = Array.isArray(samples) ? samples : [samples]
        for (const sentence of sampleList) {
          if (sentence.trim()) {
            await pool.query(
              'INSERT INTO samples (word_id, sentence) VALUES ($1, $2)',
              [wordId, sentence]
            )
          }
        }
      }

      res.json({ word: word.rows[0] })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Sunucu hatası' })
    }
  }
)
// Kelime silme endpoint'i
router.delete('/:id', verifyToken, async (req: Request, res: Response) => {
  const { uid } = (req as any).user
  const wordId = req.params.id

  try {
    const user = await pool.query('SELECT id FROM users WHERE firebase_uid = $1', [uid])
    if (user.rows.length === 0) {
      res.status(404).json({ error: 'Kullanıcı bulunamadı' })
      return
    }

    await pool.query(
      'DELETE FROM words WHERE id = $1 AND user_id = $2',
      [wordId, user.rows[0].id]
    )

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

export default router
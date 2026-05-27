import { Router, Request, Response } from 'express'
import pool from '../db'
import { verifyToken } from '../middleware/verifyToken'

const router = Router()

router.post('/provision', verifyToken, async (req: Request, res: Response) => {
  const { uid, email, name } = (req as any).user

  try {
    // Kullanıcı zaten varsa, mevcut kullanıcıyı döndür
    const existing = await pool.query(
      'SELECT * FROM users WHERE firebase_uid = $1',
      [uid]
    )
    // Eğer kullanıcı zaten varsa, mevcut kullanıcıyı döndür
    if (existing.rows.length > 0) {
      res.json({ user: existing.rows[0] })
      return
    }
    // Yeni kullanıcı oluştur
    const result = await pool.query(
      'INSERT INTO users (firebase_uid, email, username) VALUES ($1, $2, $3) RETURNING *',
      [uid, email, name ?? email.split('@')[0]]
    )

    res.json({ user: result.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

export default router
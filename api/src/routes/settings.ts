import { Router, Request, Response } from 'express'
import pool from '../db'
import { verifyToken } from '../middleware/verifyToken'

const router = Router()

router.get('/', verifyToken, async (req: Request, res: Response) => {
  const { uid } = (req as any).user

  try {
    const user = await pool.query('SELECT id FROM users WHERE firebase_uid = $1', [uid])
    if (user.rows.length === 0) {
      res.status(404).json({ error: 'Kullanıcı bulunamadı' })
      return
    }

    const userId = user.rows[0].id

    const settings = await pool.query(
      'SELECT * FROM user_settings WHERE user_id = $1',
      [userId]
    )

    if (settings.rows.length === 0) {
      await pool.query(
        'INSERT INTO user_settings (user_id, daily_word_count) VALUES ($1, 10)',
        [userId]
      )
      res.json({ settings: { daily_word_count: 10 } })
      return
    }

    res.json({ settings: settings.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

router.put('/', verifyToken, async (req: Request, res: Response) => {
  const { uid } = (req as any).user
  const { daily_word_count } = req.body

  if (!daily_word_count || daily_word_count < 1 || daily_word_count > 50) {
    res.status(400).json({ error: 'Kelime sayısı 1 ile 50 arasında olmalıdır.' })
    return
  }

  try {
    const user = await pool.query('SELECT id FROM users WHERE firebase_uid = $1', [uid])
    if (user.rows.length === 0) {
      res.status(404).json({ error: 'Kullanıcı bulunamadı' })
      return
    }

    const userId = user.rows[0].id

    await pool.query(
      `INSERT INTO user_settings (user_id, daily_word_count, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id)
       DO UPDATE SET daily_word_count = $2, updated_at = NOW()`,
      [userId, daily_word_count]
    )

    res.json({ success: true, daily_word_count })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

export default router
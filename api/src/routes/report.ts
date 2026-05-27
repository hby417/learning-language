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

    // Genel istatistikler
    const general = await pool.query(
      `SELECT
        COUNT(DISTINCT w.id) as total_words,
        COUNT(DISTINCT CASE WHEN wp.mastered = true THEN w.id END) as mastered_words,
        COUNT(DISTINCT CASE WHEN wp.correct_streak >= 3 AND wp.mastered = false THEN w.id END) as learning_words,
        COUNT(DISTINCT CASE WHEN COALESCE(wp.correct_streak, 0) = 0 THEN w.id END) as not_started
       FROM words w
       LEFT JOIN word_progress wp ON wp.word_id = w.id AND wp.user_id = $1
       WHERE w.user_id = $1`,
      [userId]
    )

    // Kelime bazlı detay
    const wordDetails = await pool.query(
      `SELECT
        w.eng_word,
        w.tur_word,
        COALESCE(wp.correct_streak, 0) as correct_streak,
        COALESCE(wp.mastered, false) as mastered,
        wp.last_seen
       FROM words w
       LEFT JOIN word_progress wp ON wp.word_id = w.id AND wp.user_id = $1
       WHERE w.user_id = $1
       ORDER BY COALESCE(wp.correct_streak, 0) DESC`,
      [userId]
    )

    const stats = general.rows[0]
    const total = Number.parseInt(stats.total_words)
    const mastered = Number.parseInt(stats.mastered_words)
    const learning = Number.parseInt(stats.learning_words)
    const notStarted = Number.parseInt(stats.not_started)

    res.json({
      report: {
        total_words: total,
        mastered_words: mastered,
        learning_words: learning,
        not_started: notStarted,
        mastered_percent: total > 0 ? Math.round((mastered / total) * 100) : 0,
        learning_percent: total > 0 ? Math.round((learning / total) * 100) : 0,
        not_started_percent: total > 0 ? Math.round((notStarted / total) * 100) : 0,
        words: wordDetails.rows
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

export default router